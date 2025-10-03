import os

# NASA API configuration
NASA_API_KEY = os.getenv('NASA_API_KEY', 'NxA3JNRY3yPiOvMOPZbd2DChPDgrguLiKrunWeR5')
NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1"

# Flask configuration
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

# Cache configuration
CACHE_DURATION = 3600  # 1 hour in seconds

# ML model configuration
MODEL_CONFIDENCE_THRESHOLD = 0.3
