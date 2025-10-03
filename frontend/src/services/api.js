import axios from 'axios'

// Dynamic API URL for production/development
const getApiBaseUrl = () => {
  // If we're in development, use local backend
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  }
  // In production (Railway), we'll serve both frontend and backend from the same domain
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.')
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.')
    }
    
    throw error
  }
)

// API functions
export const asteroidAPI = {
  // Get asteroids for a date range
  getAsteroids: async (startDate, endDate) => {
    try {
      const response = await api.get('/asteroids', {
        params: { start: startDate, end: endDate }
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch asteroids: ${error.message}`)
    }
  },

  // Get detailed asteroid information
  getAsteroidDetails: async (asteroidId) => {
    try {
      const response = await api.get(`/asteroid/${asteroidId}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch asteroid details: ${error.message}`)
    }
  },

  // Predict risk for asteroid data
  predictRisk: async (asteroidData) => {
    try {
      const response = await api.post('/predict-risk', asteroidData)
      return response.data
    } catch (error) {
      throw new Error(`Failed to predict risk: ${error.message}`)
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`)
    }
  },

  // Get real-time planetary positions from NASA Horizons API
  getPlanets: async () => {
    try {
      const response = await api.get('/planets')
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch planetary data: ${error.message}`)
    }
  },

  // Enhanced Horizons API endpoints
  getAsteroidEphemeris: async (asteroidId, startTime, endTime, stepSize = '1d') => {
    try {
      const response = await api.get(`/asteroid/${asteroidId}/horizons/ephemeris`, {
        params: { start_time: startTime, end_time: endTime, step_size: stepSize }
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch ephemeris data: ${error.message}`)
    }
  },

  getAsteroidOrbitalElements: async (asteroidId) => {
    try {
      const response = await api.get(`/asteroid/${asteroidId}/horizons/orbital-elements`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch orbital elements: ${error.message}`)
    }
  },

  getAsteroidCloseApproaches: async (asteroidId, startTime, endTime) => {
    try {
      const response = await api.get(`/asteroid/${asteroidId}/horizons/close-approaches`, {
        params: { start_time: startTime, end_time: endTime }
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch close approaches: ${error.message}`)
    }
  },

  getEnhancedAnalysis: async (asteroidId) => {
    try {
      const response = await api.get(`/asteroid/${asteroidId}/enhanced-analysis`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch enhanced analysis: ${error.message}`)
    }
  },

  trainEnhancedModel: async () => {
    try {
      const response = await api.post('/ml/enhanced-model/train')
      return response.data
    } catch (error) {
      throw new Error(`Failed to train enhanced model: ${error.message}`)
    }
  }
}

export default api
