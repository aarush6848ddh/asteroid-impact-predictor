import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Zap, AlertTriangle, Shield, ExternalLink, Brain } from 'lucide-react'
import { format } from 'date-fns'
import { asteroidAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import AdvancedOrbitalAnalysis from '../components/AdvancedOrbitalAnalysis'
import OrbitalVisualization3D from '../components/OrbitalVisualization3D'
import AsteroidEphemerisChart from '../components/AsteroidEphemerisChart'
import RiskAnalysisDashboard from '../components/RiskAnalysisDashboard'
import AsteroidComparison from '../components/AsteroidComparison'
import VisualizationErrorBoundary from '../components/VisualizationErrorBoundary'

const AsteroidDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [asteroid, setAsteroid] = useState(null)
  const [riskPrediction, setRiskPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      loadAsteroidDetails()
    }
  }, [id])

  const loadAsteroidDetails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await asteroidAPI.getAsteroidDetails(id)
      setAsteroid(data.asteroid)
      setRiskPrediction(data.risk_prediction)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner message="Loading asteroid details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadAsteroidDetails} />
      </div>
    )
  }

  if (!asteroid) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <ErrorMessage message="Asteroid not found" />
      </div>
    )
  }

  const {
    name,
    estimated_diameter,
    is_potentially_hazardous,
    close_approach_data,
    absolute_magnitude_h,
    nasa_jpl_url,
    orbital_data
  } = asteroid

  // Calculate diameter in meters
  const diameter = estimated_diameter?.meters?.estimated_diameter_max || 0
  const diameterKm = (diameter / 1000).toFixed(2)
  const diameterMin = estimated_diameter?.meters?.estimated_diameter_min || 0
  const diameterMinKm = (diameterMin / 1000).toFixed(2)
  
  // Get closest approach data
  const closestApproach = close_approach_data?.[0] || {}
  const approachDate = closestApproach.close_approach_date
  const approachDateFormatted = approachDate ? format(new Date(approachDate), 'MMM dd, yyyy') : 'Unknown'
  const approachDateFull = closestApproach.close_approach_date_full || 'Unknown'
  
  // Format velocity
  const velocity = parseFloat(closestApproach.relative_velocity?.kilometers_per_second || 0).toFixed(2)
  
  // Format miss distance
  const missDistance = parseFloat(closestApproach.miss_distance?.kilometers || 0)
  const missDistanceKm = missDistance.toFixed(0)
  
  // Risk level
  const riskLevel = riskPrediction?.risk_level || (is_potentially_hazardous ? 'High' : 'Low')
  const riskColor = is_potentially_hazardous ? 'asteroid-high' : 'asteroid-low'

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-space-400 hover:text-space-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browser</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                {name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className={`risk-badge ${riskColor} inline-flex items-center space-x-2`}>
                  {is_potentially_hazardous ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                  <span className="text-lg">{riskLevel} Risk</span>
                </div>
                {nasa_jpl_url && (
                  <a
                    href={nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-space-400 hover:text-space-300 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>NASA JPL</span>
                  </a>
                )}
              </div>
            </div>
            
          </div>
        </motion.div>

        {/* AI Risk Prediction */}
        {riskPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-8 h-8 text-space-400" />
              <h2 className="text-2xl font-bold text-white">AI Risk Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`risk-badge ${riskColor} text-lg mb-3`}>
                  {riskPrediction.risk_level}
                </div>
                <p className="text-space-300">Predicted Risk Level</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-3">
                  {(riskPrediction.confidence * 100).toFixed(1)}%
                </div>
                <p className="text-space-300">Confidence Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-3">
                  {riskPrediction.cluster_group}
                </div>
                <p className="text-space-300">Cluster Group</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Physical Properties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Physical Properties</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-space-700">
                <span className="text-space-300">Diameter Range</span>
                <span className="text-white font-medium">
                  {diameterMinKm} - {diameterKm} km
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-space-700">
                <span className="text-space-300">Maximum Diameter</span>
                <span className="text-white font-medium">{diameterKm} km</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-space-700">
                <span className="text-space-300">Absolute Magnitude</span>
                <span className="text-white font-medium">
                  H = {absolute_magnitude_h?.toFixed(1) || 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-space-300">Potentially Hazardous</span>
                <span className={`font-medium ${is_potentially_hazardous ? 'text-asteroid-high' : 'text-asteroid-low'}`}>
                  {is_potentially_hazardous ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Orbital Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Orbital Data</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-space-700">
                <span className="text-space-300">Closest Approach Date</span>
                <span className="text-white font-medium">{approachDateFormatted}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-space-700">
                <span className="text-space-300">Full Date</span>
                <span className="text-white font-medium">{approachDateFull}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-space-700">
                <span className="text-space-300">Relative Velocity</span>
                <span className="text-white font-medium">{velocity} km/s</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-space-700">
                <span className="text-space-300">Miss Distance</span>
                <span className="text-white font-medium">
                  {missDistanceKm.toLocaleString()} km
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-space-300">Orbiting Body</span>
                <span className="text-white font-medium">
                  {closestApproach.orbiting_body || 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Orbital Parameters */}
        {orbital_data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass rounded-2xl p-8 mt-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Orbital Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orbital_data.orbital_period && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {parseFloat(orbital_data.orbital_period).toFixed(2)}
                  </div>
                  <p className="text-space-300">Orbital Period (days)</p>
                </div>
              )}
              
              {orbital_data.aphelion_distance && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {parseFloat(orbital_data.aphelion_distance).toFixed(2)}
                  </div>
                  <p className="text-space-300">Aphelion Distance (AU)</p>
                </div>
              )}
              
              {orbital_data.perihelion_distance && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {parseFloat(orbital_data.perihelion_distance).toFixed(2)}
                  </div>
                  <p className="text-space-300">Perihelion Distance (AU)</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 3D Orbital Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <VisualizationErrorBoundary>
            <OrbitalVisualization3D asteroid={asteroid} />
          </VisualizationErrorBoundary>
        </motion.div>

        {/* Ephemeris Data Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <VisualizationErrorBoundary>
            <AsteroidEphemerisChart asteroid={asteroid} />
          </VisualizationErrorBoundary>
        </motion.div>

        {/* Risk Analysis Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <VisualizationErrorBoundary>
            <RiskAnalysisDashboard asteroid={asteroid} riskPrediction={riskPrediction} />
          </VisualizationErrorBoundary>
        </motion.div>

        {/* Asteroid Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8"
        >
          <VisualizationErrorBoundary>
            <AsteroidComparison asteroid={asteroid} />
          </VisualizationErrorBoundary>
        </motion.div>

        {/* Advanced Orbital Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8"
        >
          <AdvancedOrbitalAnalysis asteroid={asteroid} />
        </motion.div>

      </div>
    </div>
  )
}

export default AsteroidDetail
