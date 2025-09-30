from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
import json
import time
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
from horizons_integration import horizons_api, enhanced_ml
from plotly_visualizations import PlotlyVisualizations
import logging
from config import NASA_API_KEY, NASA_BASE_URL, CACHE_DURATION, MODEL_CONFIDENCE_THRESHOLD

app = Flask(__name__)
CORS(app)

# Initialize visualization services
plotly_viz = PlotlyVisualizations()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache for API responses
cache = {}

# ML models
risk_model = None
cluster_model = None
scaler = None

def load_or_train_models():
    """Load existing models or train new ones"""
    global risk_model, cluster_model, scaler
    
    try:
        # Try to load existing models
        risk_model = joblib.load('models/risk_model.pkl')
        cluster_model = joblib.load('models/cluster_model.pkl')
        scaler = joblib.load('models/scaler.pkl')
        logger.info("Loaded existing ML models")
    except FileNotFoundError:
        logger.info("Training new ML models...")
        train_ml_models()

def train_ml_models():
    """Train ML models with enhanced synthetic data based on real NASA asteroid characteristics"""
    global risk_model, cluster_model, scaler
    
    # Generate much larger and more realistic training dataset
    np.random.seed(42)
    n_samples = 5000  # Increased from 1000 to 5000
    
    # Generate realistic asteroid data based on actual NASA statistics
    # Diameter distribution (most asteroids are small, few are large)
    diameters = np.random.lognormal(1.5, 1.2, n_samples)  # 0.1-1000m range, more realistic
    
    # Velocity distribution (based on real asteroid velocities)
    velocities = np.random.lognormal(2.8, 0.6, n_samples)  # 1-40 km/s range
    
    # Miss distance distribution (most are far, few are close)
    miss_distances = np.random.lognormal(6.5, 1.1, n_samples)  # 1000-10000000 km range
    
    # Additional features for better prediction
    # Absolute magnitude (brightness) - inversely related to size
    absolute_magnitudes = 20 - 2.5 * np.log10(diameters) + np.random.normal(0, 1, n_samples)
    
    # Orbital period (derived from velocity and distance)
    orbital_periods = np.sqrt(miss_distances**3) / (velocities * 1000)  # Simplified calculation
    
    # Create sophisticated risk assessment based on multiple factors
    risk_labels = []
    for i in range(n_samples):
        risk_score = 0
        
        # Size factor (logarithmic scale - larger objects exponentially more dangerous)
        if diameters[i] > 500:  # Very large objects (>500m)
            risk_score += 4
        elif diameters[i] > 200:  # Large objects (200-500m)
            risk_score += 3
        elif diameters[i] > 100:  # Medium-large objects (100-200m)
            risk_score += 2
        elif diameters[i] > 50:  # Medium objects (50-100m)
            risk_score += 1
        elif diameters[i] > 20:  # Small-medium objects (20-50m)
            risk_score += 0.5
        
        # Velocity factor (exponential impact energy)
        if velocities[i] > 25:  # Very high velocity (>25 km/s)
            risk_score += 3
        elif velocities[i] > 20:  # High velocity (20-25 km/s)
            risk_score += 2
        elif velocities[i] > 15:  # Medium-high velocity (15-20 km/s)
            risk_score += 1
        elif velocities[i] > 10:  # Medium velocity (10-15 km/s)
            risk_score += 0.5
        
        # Distance factor (closer = more dangerous)
        if miss_distances[i] < 1000:  # Very close (<1000 km)
            risk_score += 4
        elif miss_distances[i] < 5000:  # Close (1000-5000 km)
            risk_score += 3
        elif miss_distances[i] < 10000:  # Medium-close (5000-10000 km)
            risk_score += 2
        elif miss_distances[i] < 50000:  # Medium distance (10000-50000 km)
            risk_score += 1
        elif miss_distances[i] < 100000:  # Far (50000-100000 km)
            risk_score += 0.5
        
        # Magnitude factor (brighter = larger = more dangerous)
        if absolute_magnitudes[i] < 15:  # Very bright (large)
            risk_score += 2
        elif absolute_magnitudes[i] < 18:  # Bright (medium-large)
            risk_score += 1
        elif absolute_magnitudes[i] < 22:  # Medium brightness
            risk_score += 0.5
        
        # Orbital period factor (shorter period = more frequent encounters)
        if orbital_periods[i] < 1:  # Very short period
            risk_score += 1
        elif orbital_periods[i] < 2:  # Short period
            risk_score += 0.5
        
        # Add some randomness to make it more realistic
        risk_score += np.random.normal(0, 0.3)
        
        # More nuanced risk classification
        if risk_score >= 6:
            risk_labels.append(3)  # High risk
        elif risk_score >= 4:
            risk_labels.append(2)  # Moderate risk
        elif risk_score >= 2:
            risk_labels.append(1)  # Medium risk
        else:
            risk_labels.append(0)  # Low risk
    
    # Prepare enhanced features
    X = np.column_stack([diameters, velocities, miss_distances, absolute_magnitudes, orbital_periods])
    y = np.array(risk_labels)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train enhanced risk classification model with better parameters
    risk_model = RandomForestClassifier(
        n_estimators=200,  # Increased from 100
        max_depth=15,      # Added depth control
        min_samples_split=5,  # Added split control
        min_samples_leaf=2,   # Added leaf control
        max_features='sqrt',  # Added feature selection
        random_state=42,
        n_jobs=-1  # Use all CPU cores
    )
    risk_model.fit(X_train_scaled, y_train)
    
    # Train enhanced clustering model
    cluster_model = KMeans(
        n_clusters=5,  # Increased from 4 for better separation
        random_state=42,
        n_init=10,  # Multiple initializations
        max_iter=300  # More iterations
    )
    cluster_model.fit(X_train_scaled)
    
    # Evaluate model performance
    train_score = risk_model.score(X_train_scaled, y_train)
    test_score = risk_model.score(X_test_scaled, y_test)
    
    logger.info(f"Model training completed:")
    logger.info(f"Training accuracy: {train_score:.3f}")
    logger.info(f"Test accuracy: {test_score:.3f}")
    
    # Log feature importance
    feature_names = ['diameter', 'velocity', 'miss_distance', 'magnitude', 'orbital_period']
    importances = risk_model.feature_importances_
    for name, importance in zip(feature_names, importances):
        logger.info(f"Feature importance - {name}: {importance:.3f}")
    
    # Create models directory and save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(risk_model, 'models/risk_model.pkl')
    joblib.dump(cluster_model, 'models/cluster_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    logger.info("ML models trained and saved successfully")

def make_nasa_request(url, params=None):
    """Make request to NASA API with retry logic and caching"""
    cache_key = f"{url}_{str(params)}"
    
    # Check cache first
    if cache_key in cache:
        cached_data, timestamp = cache[cache_key]
        if time.time() - timestamp < CACHE_DURATION:
            return cached_data
    
    # Make request with exponential backoff
    max_retries = 3
    for attempt in range(max_retries):
        try:
            if params is None:
                params = {}
            params['api_key'] = NASA_API_KEY
            
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Cache the response
            cache[cache_key] = (data, time.time())
            
            return data
            
        except requests.exceptions.RequestException as e:
            logger.warning(f"NASA API request failed (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise e

def predict_asteroid_risk(asteroid_data):
    """Predict risk level for an asteroid using enhanced ML models"""
    try:
        # Extract primary features
        diameter = asteroid_data.get('estimated_diameter', {}).get('meters', {}).get('estimated_diameter_max', 0)
        velocity = asteroid_data.get('close_approach_data', [{}])[0].get('relative_velocity', {}).get('kilometers_per_second', 0)
        miss_distance = asteroid_data.get('close_approach_data', [{}])[0].get('miss_distance', {}).get('kilometers', 0)
        absolute_magnitude = asteroid_data.get('absolute_magnitude_h', 0)
        
        # Handle missing data with realistic defaults
        if not diameter or diameter == 0:
            diameter = 10  # Default small diameter (10m)
        if not velocity or velocity == 0:
            velocity = 15  # Default medium velocity (15 km/s)
        if not miss_distance or miss_distance == 0:
            miss_distance = 1000000  # Default far distance (1M km)
        if not absolute_magnitude or absolute_magnitude == 0:
            # Calculate from diameter if not available
            absolute_magnitude = 20 - 2.5 * np.log10(diameter)
        
        # Convert to float
        diameter = float(diameter)
        velocity = float(velocity)
        miss_distance = float(miss_distance)
        absolute_magnitude = float(absolute_magnitude)
        
        # Calculate additional features
        orbital_period = np.sqrt(miss_distance**3) / (velocity * 1000)  # Simplified calculation
        
        # Prepare enhanced features (5 features total)
        features = np.array([[diameter, velocity, miss_distance, absolute_magnitude, orbital_period]])
        features_scaled = scaler.transform(features)
        
        # Predict risk level
        risk_prediction = risk_model.predict(features_scaled)[0]
        risk_proba = risk_model.predict_proba(features_scaled)[0]
        confidence = np.max(risk_proba)
        
        # Predict cluster
        cluster = cluster_model.predict(features_scaled)[0]
        
        # Map risk levels to labels
        risk_labels = {0: "Low", 1: "Medium", 2: "Moderate", 3: "High"}
        risk_level = risk_labels.get(risk_prediction, "Unknown")
        
        # Handle low confidence
        if confidence < MODEL_CONFIDENCE_THRESHOLD:
            risk_level = "Uncertain"
        
        logger.info(f"Prediction successful: {risk_level} (confidence: {confidence:.3f})")
        return {
            "risk_level": risk_level,
            "confidence": float(confidence),
            "cluster_group": int(cluster)
        }
        
    except Exception as e:
        logger.error(f"Error predicting asteroid risk: {e}")
        logger.error(f"Features shape: {features.shape if 'features' in locals() else 'N/A'}")
        logger.error(f"Scaler fitted: {hasattr(scaler, 'mean_') if 'scaler' in locals() else 'N/A'}")
        return {
            "risk_level": "Unknown",
            "confidence": 0.0,
            "cluster_group": 0
        }

def get_asteroids_data(start_date=None, end_date=None):
    """Get raw asteroids data (for internal use)"""
    try:
        if not start_date:
            start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        # Validate date range (NASA API limit: 7 days)
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        
        if (end_dt - start_dt).days > 7:
            return None
        
        # Fetch from NASA API
        url = f"{NASA_BASE_URL}/feed"
        params = {
            'start_date': start_date,
            'end_date': end_date
        }
        
        data = make_nasa_request(url, params)
        return data
    except Exception as e:
        logger.error(f"Error fetching asteroids data: {e}")
        return None

@app.route('/asteroids', methods=['GET'])
def get_asteroids():
    """Get asteroids for a date range"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        data = get_asteroids_data(start_date, end_date)
        if not data:
            return jsonify({"error": "Date range cannot exceed 7 days"}), 400
        
        # Process and flatten asteroid data
        asteroids = []
        for date, asteroids_list in data.get('near_earth_objects', {}).items():
            for asteroid in asteroids_list:
                # Get the closest approach data
                close_approach = asteroid.get('close_approach_data', [{}])[0]
                
                # Get risk prediction for this asteroid
                risk_prediction = predict_asteroid_risk(asteroid)
                
                processed_asteroid = {
                    'id': asteroid.get('id'),
                    'name': asteroid.get('name'),
                    'nasa_jpl_url': asteroid.get('nasa_jpl_url'),
                    'absolute_magnitude_h': asteroid.get('absolute_magnitude_h'),
                    'estimated_diameter': asteroid.get('estimated_diameter'),
                    'is_potentially_hazardous': asteroid.get('is_potentially_hazardous', False),
                    'close_approach_date': close_approach.get('close_approach_date'),
                    'close_approach_date_full': close_approach.get('close_approach_date_full'),
                    'epoch_date_close_approach': close_approach.get('epoch_date_close_approach'),
                    'relative_velocity': close_approach.get('relative_velocity'),
                    'miss_distance': close_approach.get('miss_distance'),
                    'orbiting_body': close_approach.get('orbiting_body'),
                    'risk_prediction': risk_prediction
                }
                asteroids.append(processed_asteroid)
        
        return jsonify({
            'asteroids': asteroids,
            'element_count': data.get('element_count'),
            'date_range': f"{start_date} to {end_date}"
        })
        
    except Exception as e:
        logger.error(f"Error fetching asteroids: {e}")
        return jsonify({"error": "Failed to fetch asteroid data"}), 500

def get_asteroid_data(asteroid_id):
    """Get raw asteroid data (for internal use)"""
    try:
        url = f"{NASA_BASE_URL}/neo/{asteroid_id}"
        data = make_nasa_request(url)
        return data
    except Exception as e:
        logger.error(f"Error fetching asteroid data: {e}")
        return None

@app.route('/asteroid/<asteroid_id>', methods=['GET'])
def get_asteroid_details(asteroid_id):
    """Get detailed information about a specific asteroid"""
    try:
        data = get_asteroid_data(asteroid_id)
        if not data:
            return jsonify({"error": "Failed to fetch asteroid details"}), 500
        
        # Get risk prediction
        risk_prediction = predict_asteroid_risk(data)
        
        return jsonify({
            'asteroid': data,
            'risk_prediction': risk_prediction
        })
        
    except Exception as e:
        logger.error(f"Error fetching asteroid details: {e}")
        return jsonify({"error": "Failed to fetch asteroid details"}), 500

@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    """Predict risk for asteroid data"""
    try:
        asteroid_data = request.get_json()
        if not asteroid_data:
            return jsonify({"error": "No asteroid data provided"}), 400
        
        risk_prediction = predict_asteroid_risk(asteroid_data)
        return jsonify(risk_prediction)
        
    except Exception as e:
        logger.error(f"Error predicting risk: {e}")
        return jsonify({"error": "Failed to predict risk"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/planets', methods=['GET'])
def get_planets():
    """Get real-time planetary positions from NASA Horizons API"""
    try:
        # Get current date in Horizons format
        current_date = datetime.now().strftime('%Y-%m-%d')
        next_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        # Planetary body codes for Horizons API
        planet_codes = {
            'Mercury': '199',
            'Venus': '299', 
            'Earth': '399',
            'Mars': '499',
            'Jupiter': '599',
            'Saturn': '699',
            'Uranus': '799',
            'Neptune': '899'
        }
        
        planets_data = []
        
        for name, code in planet_codes.items():
            try:
                # Horizons API endpoint
                horizons_url = f"https://ssd.jpl.nasa.gov/api/horizons.api"
                params = {
                    'format': 'json',
                    'COMMAND': code,
                    'OBJ_DATA': 'YES',
                    'MAKE_EPHEM': 'YES',
                    'EPHEM_TYPE': 'VECTORS',
                    'CENTER': '@sun',  # Sun-centered
                    'START_TIME': current_date,
                    'STOP_TIME': next_date,
                    'STEP_SIZE': '1d'
                }
                
                response = requests.get(horizons_url, params=params, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                
                if 'result' in data:
                    # Parse the ephemeris data from the result text
                    result_text = data['result']
                    lines = result_text.split('\n')
                    
                    # Look for the data section between $$SOE and $$EOE
                    in_data_section = False
                    for line in lines:
                        if '$$SOE' in line:
                            in_data_section = True
                            continue
                        elif '$$EOE' in line:
                            break
                        elif in_data_section and 'X =' in line:
                            logger.info(f"Found data line for {name}: {line}")
                            # Extract position and velocity
                            # Line format: " X = 1.491173097759252E+08 Y = 1.503816543161083E+07 Z =-1.252418242000043E+03"
                            parts = line.split()
                            if len(parts) >= 8:
                                try:
                                    x = float(parts[2])  # X position
                                    # Handle Y coordinate - sometimes it's at index 5, sometimes 4
                                    y_str = parts[5] if len(parts) > 5 else parts[4]
                                    y = float(y_str)
                                    # Handle Z coordinate - sometimes it's at index 7, sometimes 6
                                    z_str = parts[7] if len(parts) > 7 else parts[6]
                                    z = float(z_str.replace('=', ''))  # Remove equals sign
                                except (ValueError, IndexError) as e:
                                    logger.error(f"Error parsing line for {name}: {line} - {e}")
                                    continue
                                
                                # Convert from km to AU (1 AU = 149,597,870.7 km)
                                au_conversion = 149597870.7
                                x_au = x / au_conversion
                                y_au = y / au_conversion
                                z_au = z / au_conversion
                                
                                # Calculate distance from Sun (in AU)
                                distance = np.sqrt(x_au*x_au + y_au*y_au + z_au*z_au)
                                
                                # Calculate orbital period (simplified)
                                if name == 'Mercury':
                                    period = 88  # days
                                elif name == 'Venus':
                                    period = 225
                                elif name == 'Earth':
                                    period = 365
                                elif name == 'Mars':
                                    period = 687
                                elif name == 'Jupiter':
                                    period = 4333
                                elif name == 'Saturn':
                                    period = 10759
                                elif name == 'Uranus':
                                    period = 30687
                                elif name == 'Neptune':
                                    period = 60190
                                else:
                                    period = 365
                                
                                planets_data.append({
                                    'name': name,
                                    'position': [x_au, y_au, z_au],
                                    'distance': distance,
                                    'orbital_period': period,
                                    'size': get_planet_size(name),
                                    'color': get_planet_color(name)
                                })
                                break
                
            except Exception as e:
                logger.error(f"Error fetching {name} data: {e}")
                # Fallback to approximate positions
                planets_data.append({
                    'name': name,
                    'position': get_fallback_position(name),
                    'distance': get_fallback_distance(name),
                    'orbital_period': get_fallback_period(name),
                    'size': get_planet_size(name),
                    'color': get_planet_color(name)
                })
        
        return jsonify({
            'planets': planets_data,
            'date': current_date,
            'source': 'NASA Horizons API'
        })
        
    except Exception as e:
        logger.error(f"Error fetching planetary data: {e}")
        return jsonify({"error": "Failed to fetch planetary data"}), 500

def get_planet_size(name):
    """Get relative planet size for visualization"""
    sizes = {
        'Mercury': 0.05,
        'Venus': 0.08,
        'Earth': 0.1,
        'Mars': 0.08,
        'Jupiter': 0.3,
        'Saturn': 0.25,
        'Uranus': 0.15,
        'Neptune': 0.15
    }
    return sizes.get(name, 0.1)

def get_planet_color(name):
    """Get planet color for visualization"""
    colors = {
        'Mercury': '#8c7853',
        'Venus': '#ffc649',
        'Earth': '#1e40af',
        'Mars': '#cd5c5c',
        'Jupiter': '#d8ca9d',
        'Saturn': '#fad5a5',
        'Uranus': '#4fd0e7',
        'Neptune': '#4b70dd'
    }
    return colors.get(name, '#ffffff')

def get_fallback_position(name):
    """Fallback positions if Horizons API fails"""
    positions = {
        'Mercury': [0.39, 0, 0],
        'Venus': [0.72, 0, 0],
        'Earth': [1.0, 0, 0],
        'Mars': [1.52, 0, 0],
        'Jupiter': [5.2, 0, 0],
        'Saturn': [9.5, 0, 0],
        'Uranus': [19.2, 0, 0],
        'Neptune': [30.1, 0, 0]
    }
    return positions.get(name, [1.0, 0, 0])

def get_fallback_distance(name):
    """Fallback distances if Horizons API fails"""
    distances = {
        'Mercury': 0.39,
        'Venus': 0.72,
        'Earth': 1.0,
        'Mars': 1.52,
        'Jupiter': 5.2,
        'Saturn': 9.5,
        'Uranus': 19.2,
        'Neptune': 30.1
    }
    return distances.get(name, 1.0)

def get_fallback_period(name):
    """Fallback orbital periods if Horizons API fails"""
    periods = {
        'Mercury': 88,
        'Venus': 225,
        'Earth': 365,
        'Mars': 687,
        'Jupiter': 4333,
        'Saturn': 10759,
        'Uranus': 30687,
        'Neptune': 60190
    }
    return periods.get(name, 365)

@app.route('/asteroid/<asteroid_id>/horizons/ephemeris', methods=['GET'])
def get_asteroid_ephemeris(asteroid_id):
    """Get real-time ephemeris data from Horizons API"""
    try:
        # Get time range from query parameters
        start_time = request.args.get('start_time', datetime.now().strftime('%Y-%m-%d'))
        end_time = request.args.get('end_time', (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'))
        step_size = request.args.get('step_size', '1d')
        
        # Get asteroid designation
        asteroid_data = get_asteroid_data(asteroid_id)
        designation = asteroid_data.get('designation', asteroid_data.get('name', asteroid_id))
        
        # Get ephemeris data
        ephemeris_data = horizons_api.get_asteroid_ephemeris(designation, start_time, end_time, step_size)
        
        return jsonify({
            'asteroid_id': asteroid_id,
            'designation': designation,
            'ephemeris_data': ephemeris_data,
            'time_range': {
                'start': start_time,
                'end': end_time,
                'step_size': step_size
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error fetching ephemeris data for asteroid {asteroid_id}: {e}")
        return jsonify({"error": f"Failed to fetch ephemeris data: {str(e)}"}), 500

@app.route('/asteroid/<asteroid_id>/horizons/orbital-elements', methods=['GET'])
def get_asteroid_orbital_elements(asteroid_id):
    """Get orbital elements from Horizons API"""
    try:
        # Get asteroid designation
        asteroid_data = get_asteroid_data(asteroid_id)
        designation = asteroid_data.get('designation', asteroid_data.get('name', asteroid_id))
        
        # Get orbital elements
        orbital_elements = horizons_api.get_orbital_elements(designation)
        
        # Calculate derived properties
        if orbital_elements:
            from horizons_integration import EnhancedOrbitalMechanics
            orbital_mechanics = EnhancedOrbitalMechanics()
            
            orbital_elements['orbital_period_days'] = orbital_mechanics.calculate_orbital_period(
                orbital_elements.get('semi_major_axis', 1.0)
            )
            orbital_elements['orbital_stability'] = orbital_mechanics.calculate_orbital_stability(orbital_elements)
            orbital_elements['perihelion_distance'] = orbital_elements.get('semi_major_axis', 1.0) * (1 - orbital_elements.get('eccentricity', 0.0))
            orbital_elements['aphelion_distance'] = orbital_elements.get('semi_major_axis', 1.0) * (1 + orbital_elements.get('eccentricity', 0.0))
        
        return jsonify({
            'asteroid_id': asteroid_id,
            'designation': designation,
            'orbital_elements': orbital_elements,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error fetching orbital elements for asteroid {asteroid_id}: {e}")
        return jsonify({"error": f"Failed to fetch orbital elements: {str(e)}"}), 500

@app.route('/asteroid/<asteroid_id>/horizons/close-approaches', methods=['GET'])
def get_asteroid_close_approaches(asteroid_id):
    """Get close approach data from Horizons API"""
    try:
        # Get time range from query parameters
        start_time = request.args.get('start_time', datetime.now().strftime('%Y-%m-%d'))
        end_time = request.args.get('end_time', (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d'))
        
        # Get asteroid designation
        asteroid_data = get_asteroid_data(asteroid_id)
        designation = asteroid_data.get('designation', asteroid_data.get('name', asteroid_id))
        
        # Get close approaches
        close_approaches = horizons_api.get_close_approaches(designation, start_time, end_time)
        
        # Calculate risk metrics
        risk_metrics = {}
        if close_approaches:
            earth_approaches = [ca for ca in close_approaches if 'Earth' in ca['body']]
            if earth_approaches:
                closest_earth = min(earth_approaches, key=lambda x: x['distance'])
                risk_metrics = {
                    'closest_earth_approach_au': closest_earth['distance'],
                    'closest_earth_approach_km': closest_earth['distance'] * 149597870.7,
                    'closest_earth_approach_velocity': closest_earth['velocity'],
                    'closest_earth_approach_date': closest_earth['date'],
                    'num_earth_approaches': len(earth_approaches),
                    'risk_level': 'HIGH' if closest_earth['distance'] < 0.05 else 'MEDIUM' if closest_earth['distance'] < 0.1 else 'LOW'
                }
        
        return jsonify({
            'asteroid_id': asteroid_id,
            'designation': designation,
            'close_approaches': close_approaches,
            'risk_metrics': risk_metrics,
            'time_range': {
                'start': start_time,
                'end': end_time
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error fetching close approaches for asteroid {asteroid_id}: {e}")
        return jsonify({"error": f"Failed to fetch close approaches: {str(e)}"}), 500

@app.route('/asteroid/<asteroid_id>/enhanced-analysis', methods=['GET'])
def get_enhanced_asteroid_analysis(asteroid_id):
    """Get comprehensive enhanced analysis using Horizons data"""
    try:
        # Get basic asteroid data
        asteroid_data = get_asteroid_data(asteroid_id)
        
        # Get enhanced features
        enhanced_features = enhanced_ml.extract_horizons_features(asteroid_data)
        
        # Get orbital elements
        designation = asteroid_data.get('designation', asteroid_data.get('name', asteroid_id))
        orbital_elements = horizons_api.get_orbital_elements(designation)
        
        # Get close approaches
        start_date = datetime.now().strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d')
        close_approaches = horizons_api.get_close_approaches(designation, start_date, end_date)
        
        # Enhanced risk prediction
        enhanced_risk_prediction = predict_enhanced_risk(asteroid_data, enhanced_features)
        
        return jsonify({
            'asteroid_id': asteroid_id,
            'basic_data': asteroid_data,
            'enhanced_features': enhanced_features,
            'orbital_elements': orbital_elements,
            'close_approaches': close_approaches,
            'enhanced_risk_prediction': enhanced_risk_prediction,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error performing enhanced analysis for asteroid {asteroid_id}: {e}")
        return jsonify({"error": f"Failed to perform enhanced analysis: {str(e)}"}), 500

@app.route('/ml/enhanced-model/train', methods=['POST'])
def train_enhanced_model():
    """Train enhanced ML model with Horizons data"""
    try:
        # Get asteroids data
        asteroids_data = get_asteroids_data()
        if not asteroids_data:
            return jsonify({"error": "No data available for training"}), 400
        
        # Process asteroids data
        asteroids = []
        for date, asteroids_list in asteroids_data.get('near_earth_objects', {}).items():
            asteroids.extend(asteroids_list)
        
        # Create enhanced dataset
        enhanced_df = enhanced_ml.create_enhanced_dataset(asteroids)
        
        if enhanced_df.empty:
            return jsonify({"error": "No data available for training"}), 400
        
        # Train enhanced model
        training_results = enhanced_ml.train_enhanced_model(enhanced_df)
        
        return jsonify({
            'message': 'Enhanced model trained successfully',
            'results': training_results,
            'dataset_size': len(enhanced_df),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error training enhanced model: {e}")
        return jsonify({"error": f"Failed to train enhanced model: {str(e)}"}), 500

def predict_enhanced_risk(asteroid_data, enhanced_features):
    """Predict risk using enhanced features"""
    try:
        # Load enhanced model if available
        try:
            enhanced_model = joblib.load('enhanced_asteroid_model.pkl')
            
            # Prepare features for prediction
            feature_columns = [
                'diameter_min', 'diameter_max', 'absolute_magnitude',
                'semi_major_axis', 'eccentricity', 'inclination',
                'orbital_period', 'orbital_stability',
                'num_close_approaches', 'closest_approach_distance',
                'closest_approach_velocity', 'avg_approach_distance',
                'num_earth_approaches', 'closest_earth_approach',
                'next_earth_approach_days', 'impact_probability'
            ]
            
            # Create feature vector
            features = []
            for col in feature_columns:
                if col in enhanced_features:
                    features.append(enhanced_features[col])
                else:
                    # Use basic data as fallback
                    if col == 'diameter_min':
                        features.append(asteroid_data.get('estimated_diameter', {}).get('meters', {}).get('estimated_diameter_min', 0))
                    elif col == 'diameter_max':
                        features.append(asteroid_data.get('estimated_diameter', {}).get('meters', {}).get('estimated_diameter_max', 0))
                    elif col == 'absolute_magnitude':
                        features.append(asteroid_data.get('absolute_magnitude', 0))
                    else:
                        features.append(0)
            
            # Make prediction
            risk_score = enhanced_model.predict_proba([features])[0][1]  # Probability of being hazardous
            risk_level = 'HIGH' if risk_score > 0.7 else 'MEDIUM' if risk_score > 0.3 else 'LOW'
            
            return {
                'risk_score': float(risk_score),
                'risk_level': risk_level,
                'confidence': float(enhanced_model.predict_proba([features])[0].max()),
                'model_type': 'enhanced_horizons',
                'features_used': len(features)
            }
            
        except FileNotFoundError:
            # Fallback to basic model
            return predict_asteroid_risk(asteroid_data)
            
    except Exception as e:
        logger.error(f"Error in enhanced risk prediction: {e}")
        return predict_asteroid_risk(asteroid_data)


# Helper function to extract asteroids from NASA API response
def extract_asteroids(asteroids_data):
    """Extract asteroids list from NASA API response"""
    if not asteroids_data or 'near_earth_objects' not in asteroids_data:
        return []
    
    asteroids = []
    for date, asteroid_list in asteroids_data['near_earth_objects'].items():
        asteroids.extend(asteroid_list)
    return asteroids

# Legacy visualization endpoints (redirected to Plotly)
@app.route('/visualizations/size-distribution', methods=['GET'])
def get_size_distribution_chart():
    """Get size distribution chart (redirected to Plotly)"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_violin_plot(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating size distribution chart: {str(e)}")
        return jsonify({'error': f'Failed to create chart: {str(e)}'}), 500

@app.route('/visualizations/risk-analysis', methods=['GET'])
def get_risk_analysis_chart():
    """Get risk analysis chart (redirected to Plotly)"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_sunburst_chart(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating risk analysis chart: {str(e)}")
        return jsonify({'error': f'Failed to create chart: {str(e)}'}), 500

@app.route('/visualizations/magnitude-vs-size', methods=['GET'])
def get_magnitude_vs_size_chart():
    """Get magnitude vs size chart (redirected to Plotly)"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_3d_scatter_plot(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating magnitude vs size chart: {str(e)}")
        return jsonify({'error': f'Failed to create chart: {str(e)}'}), 500

@app.route('/visualizations/orbital-parameters', methods=['GET'])
def get_orbital_parameters_chart():
    """Get orbital parameters chart (redirected to Plotly)"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_parallel_coordinates(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating orbital parameters chart: {str(e)}")
        return jsonify({'error': f'Failed to create chart: {str(e)}'}), 500

@app.route('/visualizations/time-series', methods=['GET'])
def get_time_series_chart():
    """Get time series chart (redirected to Plotly)"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_animated_timeline(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating time series chart: {str(e)}")
        return jsonify({'error': f'Failed to create chart: {str(e)}'}), 500

@app.route('/visualizations/physical-properties', methods=['GET'])
def get_physical_properties_chart():
    """Get physical properties chart (redirected to Plotly)"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_box_plot(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating physical properties chart: {str(e)}")
        return jsonify({'error': f'Failed to create chart: {str(e)}'}), 500

@app.route('/visualizations/risk-comparison', methods=['GET'])
def get_risk_comparison_chart():
    """Get risk comparison chart (redirected to Plotly)"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_risk_heatmap(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating risk comparison chart: {str(e)}")
        return jsonify({'error': f'Failed to create chart: {str(e)}'}), 500


# Plotly visualization endpoints
@app.route('/plotly/3d-scatter', methods=['GET'])
def get_3d_scatter():
    """Get 3D scatter plot data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_3d_scatter_plot(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating 3D scatter plot: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/animated-timeline', methods=['GET'])
def get_animated_timeline():
    """Get animated timeline data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_animated_timeline(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating animated timeline: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/risk-heatmap', methods=['GET'])
def get_risk_heatmap():
    """Get risk heatmap data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_risk_heatmap(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating risk heatmap: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/parallel-coordinates', methods=['GET'])
def get_parallel_coordinates():
    """Get parallel coordinates data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_parallel_coordinates(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating parallel coordinates: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/sunburst', methods=['GET'])
def get_sunburst():
    """Get sunburst chart data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_sunburst_chart(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating sunburst chart: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/violin-plot', methods=['GET'])
def get_violin_plot():
    """Get violin plot data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_violin_plot(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating violin plot: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/radar-chart', methods=['GET'])
def get_radar_chart():
    """Get radar chart data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_radar_chart(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating radar chart: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/sankey', methods=['GET'])
def get_sankey():
    """Get sankey diagram data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_sankey_diagram(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating sankey diagram: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/treemap', methods=['GET'])
def get_treemap():
    """Get treemap data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_treemap(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating treemap: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/box-plot', methods=['GET'])
def get_box_plot():
    """Get box plot data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_box_plot(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating box plot: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/contour-plot', methods=['GET'])
def get_contour_plot():
    """Get contour plot data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_contour_plot(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating contour plot: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/plotly/polar-chart', methods=['GET'])
def get_polar_chart():
    """Get polar chart data"""
    try:
        start_date = request.args.get('start', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        asteroids_data = get_asteroids_data(start_date, end_date)
        asteroids = extract_asteroids(asteroids_data)
        
        result = plotly_viz.create_polar_chart(asteroids)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error creating polar chart: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Initialize ML models
    load_or_train_models()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5001)
