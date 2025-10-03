import json
import numpy as np
from datetime import datetime, timedelta
import random

class PlotlyVisualizations:
    def __init__(self):
        self.colors = {
            'primary': '#3B82F6',
            'secondary': '#10B981', 
            'accent': '#F59E0B',
            'danger': '#EF4444',
            'purple': '#8B5CF6',
            'pink': '#EC4899',
            'cyan': '#06B6D4'
        }
        
        self.risk_colors = {
            'Low': '#10B981',
            'Medium': '#F59E0B', 
            'High': '#EF4444',
            'Critical': '#DC2626'
        }

    def create_3d_scatter_plot(self, asteroids):
        """Create a stunning 3D scatter plot of asteroid positions"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Extract data
        x_data = []
        y_data = []
        z_data = []
        sizes = []
        colors = []
        names = []
        magnitudes = []
        hazardous = []
        
        for asteroid in asteroids:
            # Generate 3D coordinates (simplified orbital simulation)
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            is_hazardous = asteroid.get('is_potentially_hazardous', False)
            
            # Create orbital-like coordinates
            angle = random.uniform(0, 2 * np.pi)
            distance = random.uniform(0.5, 3.0)  # AU
            height = random.uniform(-0.5, 0.5)
            
            x = distance * np.cos(angle)
            y = distance * np.sin(angle)
            z = height
            
            x_data.append(x)
            y_data.append(y)
            z_data.append(z)
            
            # Size based on diameter
            size = max(5, min(50, diameter * 1000))
            sizes.append(size)
            
            # Color based on hazard status
            color = self.risk_colors['High'] if is_hazardous else self.risk_colors['Low']
            colors.append(color)
            
            names.append(asteroid.get('name', 'Unknown'))
            magnitudes.append(magnitude)
            hazardous.append('Yes' if is_hazardous else 'No')
        
        data = [{
            'x': x_data,
            'y': y_data,
            'z': z_data,
            'mode': 'markers',
            'type': 'scatter3d',
            'marker': {
                'size': sizes,
                'color': colors,
                'opacity': 0.8,
                'line': {
                    'color': 'white',
                    'width': 1
                }
            },
            'text': [f"{name}<br>Magnitude: {mag:.1f}<br>Hazardous: {haz}" 
                    for name, mag, haz in zip(names, magnitudes, hazardous)],
            'hovertemplate': '<b>%{text}</b><br>' +
                           'X: %{x:.2f} AU<br>' +
                           'Y: %{y:.2f} AU<br>' +
                           'Z: %{z:.2f} AU<br>' +
                           '<extra></extra>',
            'name': 'Asteroids'
        }]
        
        layout = {
            'title': {
                'text': '3D Asteroid Positions in Space',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'scene': {
                'xaxis': {
                    'title': 'X (AU)',
                    'titlefont': {'color': 'white'},
                    'tickfont': {'color': 'white'},
                    'gridcolor': 'rgba(255,255,255,0.1)',
                    'backgroundcolor': 'rgba(0,0,0,0)'
                },
                'yaxis': {
                    'title': 'Y (AU)', 
                    'titlefont': {'color': 'white'},
                    'tickfont': {'color': 'white'},
                    'gridcolor': 'rgba(255,255,255,0.1)',
                    'backgroundcolor': 'rgba(0,0,0,0)'
                },
                'zaxis': {
                    'title': 'Z (AU)',
                    'titlefont': {'color': 'white'},
                    'tickfont': {'color': 'white'},
                    'gridcolor': 'rgba(255,255,255,0.1)',
                    'backgroundcolor': 'rgba(0,0,0,0)'
                },
                'bgcolor': 'rgba(0,0,0,0)',
                'camera': {
                    'eye': {'x': 1.5, 'y': 1.5, 'z': 1.5}
                }
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 0, 'r': 0, 't': 60, 'b': 0}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False,
            'modeBarButtonsToRemove': ['pan2d', 'lasso2d', 'select2d']
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_animated_timeline(self, asteroids):
        """Create an animated timeline showing asteroid movements"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Generate time series data
        dates = []
        magnitudes = []
        sizes = []
        colors = []
        names = []
        
        for i, asteroid in enumerate(asteroids[:20]):  # Limit for performance
            name = asteroid.get('name', f'Asteroid {i+1}')
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            is_hazardous = asteroid.get('is_potentially_hazardous', False)
            
            # Generate time series
            base_date = datetime.now()
            for day in range(30):
                date = base_date + timedelta(days=day)
                dates.append(date.strftime('%Y-%m-%d'))
                magnitudes.append(magnitude + random.uniform(-0.5, 0.5))
                sizes.append(max(5, min(30, diameter * 1000)))
                colors.append(self.risk_colors['High'] if is_hazardous else self.risk_colors['Low'])
                names.append(name)
        
        data = [{
            'x': dates,
            'y': magnitudes,
            'mode': 'markers+lines',
            'type': 'scatter',
            'marker': {
                'size': sizes,
                'color': colors,
                'opacity': 0.8
            },
            'line': {
                'color': self.colors['primary'],
                'width': 2
            },
            'text': names,
            'hovertemplate': '<b>%{text}</b><br>' +
                           'Date: %{x}<br>' +
                           'Magnitude: %{y:.2f}<br>' +
                           '<extra></extra>',
            'name': 'Asteroid Timeline'
        }]
        
        layout = {
            'title': {
                'text': 'Animated Asteroid Timeline',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'xaxis': {
                'title': 'Date',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'},
                'gridcolor': 'rgba(255,255,255,0.1)'
            },
            'yaxis': {
                'title': 'Absolute Magnitude',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'},
                'gridcolor': 'rgba(255,255,255,0.1)'
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 60, 'r': 20, 't': 60, 'b': 60}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_risk_heatmap(self, asteroids):
        """Create a risk assessment heatmap"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Create risk matrix
        risk_levels = ['Low', 'Medium', 'High', 'Critical']
        size_categories = ['Small', 'Medium', 'Large', 'Very Large']
        
        # Generate risk matrix data
        matrix_data = []
        for i, risk in enumerate(risk_levels):
            row = []
            for j, size in enumerate(size_categories):
                # Simulate risk distribution
                count = random.randint(0, 20)
                row.append(count)
            matrix_data.append(row)
        
        data = [{
            'z': matrix_data,
            'x': size_categories,
            'y': risk_levels,
            'type': 'heatmap',
            'colorscale': [
                [0, '#10B981'],
                [0.3, '#F59E0B'], 
                [0.6, '#EF4444'],
                [1, '#DC2626']
            ],
            'showscale': True,
            'colorbar': {
                'title': 'Count',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'}
            },
            'hovertemplate': 'Risk: %{y}<br>Size: %{x}<br>Count: %{z}<extra></extra>'
        }]
        
        layout = {
            'title': {
                'text': 'Asteroid Risk Assessment Heatmap',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'xaxis': {
                'title': 'Size Category',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'}
            },
            'yaxis': {
                'title': 'Risk Level',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'}
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 80, 'r': 20, 't': 60, 'b': 80}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_parallel_coordinates(self, asteroids):
        """Create parallel coordinates plot for multi-dimensional analysis"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Extract dimensions
        dimensions = []
        data_points = []
        
        for asteroid in asteroids[:50]:  # Limit for performance
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            velocity = 0
            miss_distance = 0
            
            if asteroid.get('close_approach_data'):
                velocity_data = asteroid.get('close_approach_data', [{}])[0].get('relative_velocity', {}).get('kilometers_per_second', 0)
                miss_distance_data = asteroid.get('close_approach_data', [{}])[0].get('miss_distance', {}).get('kilometers', 0)
                
                # Ensure numeric values
                try:
                    velocity = float(velocity_data) if velocity_data else 0
                    miss_distance = float(miss_distance_data) if miss_distance_data else 0
                except (ValueError, TypeError):
                    velocity = 0
                    miss_distance = 0
            
            data_points.append({
                'Magnitude': float(magnitude),
                'Diameter': float(diameter),
                'Velocity': float(velocity),
                'Miss Distance': float(miss_distance / 1000000) if miss_distance > 0 else 0,  # Convert to millions of km
                'Hazardous': 1 if asteroid.get('is_potentially_hazardous', False) else 0
            })
        
        # Create dimensions
        dimensions = [
            {'label': 'Magnitude', 'values': [d['Magnitude'] for d in data_points]},
            {'label': 'Diameter (km)', 'values': [d['Diameter'] for d in data_points]},
            {'label': 'Velocity (km/s)', 'values': [d['Velocity'] for d in data_points]},
            {'label': 'Miss Distance (M km)', 'values': [d['Miss Distance'] for d in data_points]},
            {'label': 'Hazardous', 'values': [d['Hazardous'] for d in data_points]}
        ]
        
        data = [{
            'type': 'parcoords',
            'dimensions': dimensions,
            'line': {
                'color': [d['Hazardous'] for d in data_points],
                'colorscale': [[0, self.colors['primary']], [1, self.colors['danger']]],
                'showscale': True,
                'colorbar': {
                    'title': 'Hazardous',
                    'titlefont': {'color': 'white'},
                    'tickfont': {'color': 'white'}
                }
            }
        }]
        
        layout = {
            'title': {
                'text': 'Multi-Dimensional Asteroid Analysis',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 60, 'r': 20, 't': 60, 'b': 60}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_sunburst_chart(self, asteroids):
        """Create sunburst chart for hierarchical risk analysis"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Categorize asteroids
        categories = {
            'Low Risk': {'Small': 0, 'Medium': 0, 'Large': 0},
            'Medium Risk': {'Small': 0, 'Medium': 0, 'Large': 0},
            'High Risk': {'Small': 0, 'Medium': 0, 'Large': 0}
        }
        
        for asteroid in asteroids:
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            is_hazardous = asteroid.get('is_potentially_hazardous', False)
            
            # Determine risk level
            if is_hazardous or magnitude < 20:
                risk_level = 'High Risk'
            elif magnitude < 22:
                risk_level = 'Medium Risk'
            else:
                risk_level = 'Low Risk'
            
            # Determine size category
            if diameter < 0.1:
                size_category = 'Small'
            elif diameter < 0.5:
                size_category = 'Medium'
            else:
                size_category = 'Large'
            
            categories[risk_level][size_category] += 1
        
        # Create sunburst data
        ids = []
        labels = []
        parents = []
        values = []
        colors = []
        
        # Add root
        ids.append('root')
        labels.append('Asteroids')
        parents.append('')
        values.append(sum(sum(cat.values()) for cat in categories.values()))
        colors.append(self.colors['primary'])
        
        # Add risk levels
        for risk_level, sizes in categories.items():
            risk_id = risk_level.lower().replace(' ', '_')
            ids.append(risk_id)
            labels.append(risk_level)
            parents.append('root')
            values.append(sum(sizes.values()))
            
            if 'High' in risk_level:
                colors.append(self.colors['danger'])
            elif 'Medium' in risk_level:
                colors.append(self.colors['accent'])
            else:
                colors.append(self.colors['secondary'])
        
        # Add size categories
        for risk_level, sizes in categories.items():
            risk_id = risk_level.lower().replace(' ', '_')
            for size_category, count in sizes.items():
                if count > 0:
                    size_id = f"{risk_id}_{size_category.lower()}"
                    ids.append(size_id)
                    labels.append(size_category)
                    parents.append(risk_id)
                    values.append(count)
                    colors.append(self.colors['purple'])
        
        data = [{
            'type': 'sunburst',
            'ids': ids,
            'labels': labels,
            'parents': parents,
            'values': values,
            'marker': {
                'colors': colors
            },
            'hovertemplate': '<b>%{label}</b><br>Count: %{value}<extra></extra>'
        }]
        
        layout = {
            'title': {
                'text': 'Hierarchical Risk Analysis',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 0, 'r': 0, 't': 60, 'b': 0}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_violin_plot(self, asteroids):
        """Create violin plot for distribution analysis"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Extract data
        magnitudes = []
        diameters = []
        velocities = []
        
        for asteroid in asteroids:
            try:
                magnitude = float(asteroid.get('absolute_magnitude_h', 20))
                diameter = float(asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1))
                
                velocity = 0
                if asteroid.get('close_approach_data'):
                    vel_data = asteroid.get('close_approach_data', [{}])[0].get('relative_velocity', {}).get('kilometers_per_second', 0)
                    try:
                        velocity = float(vel_data) if vel_data else 0
                    except (ValueError, TypeError):
                        velocity = 0
                
                magnitudes.append(magnitude)
                diameters.append(diameter)
                velocities.append(velocity)
            except (ValueError, TypeError):
                magnitudes.append(20.0)
                diameters.append(0.1)
                velocities.append(0.0)
        
        data = [
            {
                'type': 'violin',
                'y': magnitudes,
                'name': 'Magnitude',
                'box': {'visible': True},
                'meanline': {'visible': True},
                'fillcolor': self.colors['primary'],
                'line': {'color': 'white'}
            },
            {
                'type': 'violin',
                'y': diameters,
                'name': 'Diameter (km)',
                'box': {'visible': True},
                'meanline': {'visible': True},
                'fillcolor': self.colors['secondary'],
                'line': {'color': 'white'}
            },
            {
                'type': 'violin',
                'y': velocities,
                'name': 'Velocity (km/s)',
                'box': {'visible': True},
                'meanline': {'visible': True},
                'fillcolor': self.colors['accent'],
                'line': {'color': 'white'}
            }
        ]
        
        layout = {
            'title': {
                'text': 'Distribution Analysis of Asteroid Properties',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'yaxis': {
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'},
                'gridcolor': 'rgba(255,255,255,0.1)'
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 60, 'r': 20, 't': 60, 'b': 60}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_radar_chart(self, asteroids):
        """Create radar chart for multi-attribute comparison"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Calculate average values for different categories
        hazardous_asteroids = [a for a in asteroids if a.get('is_potentially_hazardous', False)]
        safe_asteroids = [a for a in asteroids if not a.get('is_potentially_hazardous', False)]
        
        def calculate_metrics(asteroid_list):
            if not asteroid_list:
                return [0, 0, 0, 0, 0]
            
            magnitudes = []
            diameters = []
            velocities = []
            miss_distances = []
            
            for a in asteroid_list:
                # Ensure numeric values
                try:
                    mag = float(a.get('absolute_magnitude_h', 20))
                    diam = float(a.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1))
                    magnitudes.append(mag)
                    diameters.append(diam)
                    
                    if a.get('close_approach_data'):
                        vel_data = a.get('close_approach_data', [{}])[0].get('relative_velocity', {}).get('kilometers_per_second', 0)
                        miss_data = a.get('close_approach_data', [{}])[0].get('miss_distance', {}).get('kilometers', 0)
                        
                        try:
                            velocities.append(float(vel_data) if vel_data else 0)
                            miss_distances.append(float(miss_data) if miss_data else 0)
                        except (ValueError, TypeError):
                            velocities.append(0)
                            miss_distances.append(0)
                    else:
                        velocities.append(0)
                        miss_distances.append(0)
                except (ValueError, TypeError):
                    magnitudes.append(20)
                    diameters.append(0.1)
                    velocities.append(0)
                    miss_distances.append(0)
            
            return [
                float(np.mean(magnitudes)) if magnitudes else 0,
                float(np.mean(diameters)) if diameters else 0,
                float(np.mean(velocities)) if velocities else 0,
                float(np.mean(miss_distances) / 1000000) if miss_distances else 0,  # Convert to millions of km
                float(len(asteroid_list) / len(asteroids) * 100) if asteroids else 0  # Percentage
            ]
        
        hazardous_metrics = calculate_metrics(hazardous_asteroids)
        safe_metrics = calculate_metrics(safe_asteroids)
        
        categories = ['Magnitude', 'Diameter (km)', 'Velocity (km/s)', 'Miss Distance (M km)', 'Percentage']
        
        data = [
            {
                'type': 'scatterpolar',
                'r': hazardous_metrics,
                'theta': categories,
                'fill': 'toself',
                'name': 'Hazardous Asteroids',
                'line': {'color': self.colors['danger']},
                'fillcolor': self.colors['danger'],
                'opacity': 0.6
            },
            {
                'type': 'scatterpolar',
                'r': safe_metrics,
                'theta': categories,
                'fill': 'toself',
                'name': 'Safe Asteroids',
                'line': {'color': self.colors['secondary']},
                'fillcolor': self.colors['secondary'],
                'opacity': 0.6
            }
        ]
        
        layout = {
            'title': {
                'text': 'Multi-Attribute Comparison Radar Chart',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'polar': {
                'radialaxis': {
                    'visible': True,
                    'range': [0, 100],
                    'tickfont': {'color': 'white'},
                    'gridcolor': 'rgba(255,255,255,0.1)'
                },
                'angularaxis': {
                    'tickfont': {'color': 'white'},
                    'gridcolor': 'rgba(255,255,255,0.1)'
                },
                'bgcolor': 'rgba(0,0,0,0)'
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 60, 'r': 60, 't': 60, 'b': 60}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_sankey_diagram(self, asteroids):
        """Create Sankey diagram for data flow"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Categorize asteroids
        risk_categories = {'Low': 0, 'Medium': 0, 'High': 0}
        size_categories = {'Small': 0, 'Medium': 0, 'Large': 0}
        
        for asteroid in asteroids:
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            is_hazardous = asteroid.get('is_potentially_hazardous', False)
            
            # Risk categorization
            if is_hazardous or magnitude < 20:
                risk_categories['High'] += 1
            elif magnitude < 22:
                risk_categories['Medium'] += 1
            else:
                risk_categories['Low'] += 1
            
            # Size categorization
            if diameter < 0.1:
                size_categories['Small'] += 1
            elif diameter < 0.5:
                size_categories['Medium'] += 1
            else:
                size_categories['Large'] += 1
        
        # Create Sankey data
        nodes = [
            {'label': 'Total Asteroids', 'color': self.colors['primary']},
            {'label': 'Low Risk', 'color': self.colors['secondary']},
            {'label': 'Medium Risk', 'color': self.colors['accent']},
            {'label': 'High Risk', 'color': self.colors['danger']},
            {'label': 'Small Size', 'color': self.colors['purple']},
            {'label': 'Medium Size', 'color': self.colors['pink']},
            {'label': 'Large Size', 'color': self.colors['cyan']}
        ]
        
        links = [
            {'source': 0, 'target': 1, 'value': risk_categories['Low']},
            {'source': 0, 'target': 2, 'value': risk_categories['Medium']},
            {'source': 0, 'target': 3, 'value': risk_categories['High']},
            {'source': 0, 'target': 4, 'value': size_categories['Small']},
            {'source': 0, 'target': 5, 'value': size_categories['Medium']},
            {'source': 0, 'target': 6, 'value': size_categories['Large']}
        ]
        
        data = [{
            'type': 'sankey',
            'node': {
                'label': [node['label'] for node in nodes],
                'color': [node['color'] for node in nodes]
            },
            'link': {
                'source': [link['source'] for link in links],
                'target': [link['target'] for link in links],
                'value': [link['value'] for link in links]
            }
        }]
        
        layout = {
            'title': {
                'text': 'Asteroid Data Flow Diagram',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 0, 'r': 0, 't': 60, 'b': 0}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_treemap(self, asteroids):
        """Create treemap for size-based categorization"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Categorize asteroids by size and risk
        categories = {}
        
        for asteroid in asteroids:
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            is_hazardous = asteroid.get('is_potentially_hazardous', False)
            
            # Determine size category
            if diameter < 0.1:
                size_cat = 'Small'
            elif diameter < 0.5:
                size_cat = 'Medium'
            else:
                size_cat = 'Large'
            
            # Determine risk level
            if is_hazardous or magnitude < 20:
                risk_cat = 'High Risk'
            elif magnitude < 22:
                risk_cat = 'Medium Risk'
            else:
                risk_cat = 'Low Risk'
            
            category = f"{size_cat} - {risk_cat}"
            categories[category] = categories.get(category, 0) + 1
        
        # Create treemap data
        labels = []
        parents = []
        values = []
        colors = []
        
        # Add root
        labels.append('Asteroids')
        parents.append('')
        values.append(sum(categories.values()))
        colors.append(self.colors['primary'])
        
        # Add categories
        for category, count in categories.items():
            labels.append(category)
            parents.append('Asteroids')
            values.append(count)
            
            if 'High Risk' in category:
                colors.append(self.colors['danger'])
            elif 'Medium Risk' in category:
                colors.append(self.colors['accent'])
            else:
                colors.append(self.colors['secondary'])
        
        data = [{
            'type': 'treemap',
            'labels': labels,
            'parents': parents,
            'values': values,
            'marker': {
                'colors': colors
            },
            'hovertemplate': '<b>%{label}</b><br>Count: %{value}<extra></extra>'
        }]
        
        layout = {
            'title': {
                'text': 'Asteroid Size and Risk Categorization',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 0, 'r': 0, 't': 60, 'b': 0}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_box_plot(self, asteroids):
        """Create box plot for statistical analysis"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Extract data by risk level
        low_risk = []
        medium_risk = []
        high_risk = []
        
        for asteroid in asteroids:
            try:
                magnitude = float(asteroid.get('absolute_magnitude_h', 20))
                is_hazardous = asteroid.get('is_potentially_hazardous', False)
                
                if is_hazardous or magnitude < 20:
                    high_risk.append(magnitude)
                elif magnitude < 22:
                    medium_risk.append(magnitude)
                else:
                    low_risk.append(magnitude)
            except (ValueError, TypeError):
                # Default to low risk for invalid data
                low_risk.append(20.0)
        
        data = [
            {
                'type': 'box',
                'y': low_risk,
                'name': 'Low Risk',
                'marker': {'color': self.colors['secondary']},
                'boxpoints': 'outliers'
            },
            {
                'type': 'box',
                'y': medium_risk,
                'name': 'Medium Risk',
                'marker': {'color': self.colors['accent']},
                'boxpoints': 'outliers'
            },
            {
                'type': 'box',
                'y': high_risk,
                'name': 'High Risk',
                'marker': {'color': self.colors['danger']},
                'boxpoints': 'outliers'
            }
        ]
        
        layout = {
            'title': {
                'text': 'Statistical Analysis by Risk Level',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'yaxis': {
                'title': 'Absolute Magnitude',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'},
                'gridcolor': 'rgba(255,255,255,0.1)'
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 60, 'r': 20, 't': 60, 'b': 60}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_contour_plot(self, asteroids):
        """Create contour plot for density visualization"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Generate density data
        x = np.linspace(0, 10, 50)
        y = np.linspace(0, 10, 50)
        X, Y = np.meshgrid(x, y)
        
        # Create density function based on asteroid data
        Z = np.zeros_like(X)
        for asteroid in asteroids:
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            
            # Create density peaks
            center_x = random.uniform(2, 8)
            center_y = random.uniform(2, 8)
            intensity = 1 / (1 + magnitude / 10) * diameter * 100
            
            for i in range(len(x)):
                for j in range(len(y)):
                    distance = np.sqrt((x[i] - center_x)**2 + (y[j] - center_y)**2)
                    Z[j, i] += intensity * np.exp(-distance**2 / 2)
        
        # Convert numpy arrays to lists for JSON serialization
        data = [{
            'type': 'contour',
            'x': x.tolist(),
            'y': y.tolist(),
            'z': Z.tolist(),
            'colorscale': 'Viridis',
            'showscale': True,
            'colorbar': {
                'title': 'Density',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'}
            }
        }]
        
        layout = {
            'title': {
                'text': 'Asteroid Density Distribution',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'xaxis': {
                'title': 'X Position',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'},
                'gridcolor': 'rgba(255,255,255,0.1)'
            },
            'yaxis': {
                'title': 'Y Position',
                'titlefont': {'color': 'white'},
                'tickfont': {'color': 'white'},
                'gridcolor': 'rgba(255,255,255,0.1)'
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 60, 'r': 20, 't': 60, 'b': 60}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def create_polar_chart(self, asteroids):
        """Create polar chart for circular data representation"""
        if not asteroids:
            return self._create_empty_plot("No Asteroid Data Available")
        
        # Categorize by orbital characteristics
        categories = ['Near Earth', 'Main Belt', 'Trojan', 'Kuiper Belt', 'Oort Cloud']
        values = [0, 0, 0, 0, 0]
        
        for asteroid in asteroids:
            magnitude = asteroid.get('absolute_magnitude_h', 20)
            diameter = asteroid.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
            
            # Simple categorization based on magnitude and diameter
            if magnitude < 20:
                values[0] += 1  # Near Earth
            elif magnitude < 22:
                values[1] += 1  # Main Belt
            elif magnitude < 24:
                values[2] += 1  # Trojan
            elif magnitude < 26:
                values[3] += 1  # Kuiper Belt
            else:
                values[4] += 1  # Oort Cloud
        
        data = [{
            'type': 'barpolar',
            'r': values,
            'theta': categories,
            'marker': {
                'colorscale': 'Viridis',
                'colorbar': {
                    'title': 'Count',
                    'titlefont': {'color': 'white'},
                    'tickfont': {'color': 'white'}
                }
            },
            'hovertemplate': '<b>%{theta}</b><br>Count: %{r}<extra></extra>'
        }]
        
        layout = {
            'title': {
                'text': 'Asteroid Distribution by Orbital Region',
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'polar': {
                'radialaxis': {
                    'visible': True,
                    'tickfont': {'color': 'white'},
                    'gridcolor': 'rgba(255,255,255,0.1)'
                },
                'angularaxis': {
                    'tickfont': {'color': 'white'},
                    'gridcolor': 'rgba(255,255,255,0.1)'
                },
                'bgcolor': 'rgba(0,0,0,0)'
            },
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 60, 'r': 60, 't': 60, 'b': 60}
        }
        
        config = {
            'displayModeBar': True,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}

    def _create_empty_plot(self, message):
        """Create an empty plot with a message"""
        data = [{
            'x': [0],
            'y': [0],
            'mode': 'markers',
            'marker': {'size': 0},
            'showlegend': False
        }]
        
        layout = {
            'title': {
                'text': message,
                'font': {'size': 20, 'color': 'white'},
                'x': 0.5
            },
            'xaxis': {'visible': False},
            'yaxis': {'visible': False},
            'paper_bgcolor': 'rgba(0,0,0,0)',
            'plot_bgcolor': 'rgba(0,0,0,0)',
            'font': {'color': 'white'},
            'margin': {'l': 0, 'r': 0, 't': 60, 'b': 0}
        }
        
        config = {
            'displayModeBar': False,
            'displaylogo': False
        }
        
        return {'data': data, 'layout': layout, 'config': config}
