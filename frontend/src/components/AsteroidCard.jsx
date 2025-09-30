import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Zap, AlertTriangle, Shield, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

const AsteroidCard = ({ asteroid }) => {
  
  const {
    id,
    name,
    estimated_diameter,
    is_potentially_hazardous,
    close_approach_date,
    relative_velocity,
    miss_distance,
    absolute_magnitude_h,
    nasa_jpl_url
  } = asteroid

  // Calculate diameter in meters
  const diameter = estimated_diameter?.meters?.estimated_diameter_max || 0
  const diameterKm = (diameter / 1000).toFixed(2)
  
  // Format velocity
  const velocity = parseFloat(relative_velocity?.kilometers_per_second || 0).toFixed(2)
  
  // Format miss distance
  const missDistance = parseFloat(miss_distance?.kilometers || 0)
  const missDistanceKm = missDistance.toFixed(0)
  
  // Format date
  const approachDate = close_approach_date ? format(new Date(close_approach_date), 'MMM dd, yyyy') : 'Unknown'

  // Risk level from ML prediction or fallback to potentially hazardous status
  const mlRiskLevel = asteroid.risk_prediction?.risk_level
  const riskLevel = mlRiskLevel || (is_potentially_hazardous ? 'High' : 'Low')
  
  // Determine risk color based on risk level
  let riskColor = 'risk-low'
  switch (riskLevel) {
    case 'High':
      riskColor = 'risk-high'
      break
    case 'Moderate':
      riskColor = 'risk-moderate'
      break
    case 'Medium':
      riskColor = 'risk-medium'
      break
    case 'Low':
    default:
      riskColor = 'risk-low'
      break
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="asteroid-card group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-space-300 transition-colors">
            {name}
          </h3>
          <div className={`risk-badge ${riskColor} inline-flex items-center space-x-1`}>
            {is_potentially_hazardous ? (
              <AlertTriangle className="w-3 h-3" />
            ) : (
              <Shield className="w-3 h-3" />
            )}
            <span>{riskLevel} Risk</span>
          </div>
        </div>
            <div className="flex items-center space-x-2">
              {nasa_jpl_url && (
                <a
                  href={nasa_jpl_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 group-hover:opacity-100 transition-all duration-300 px-3 py-1.5 text-xs font-medium bg-space-700 hover:bg-space-600 text-white hover:text-white rounded-md border border-space-600 hover:border-space-500 shadow-sm hover:shadow-md transform hover:scale-105"
                  title="View on NASA JPL"
                >
                  <ExternalLink className="w-3 h-3 inline mr-1" />
                  NASA JPL
                </a>
              )}
            </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-space-400">Approach Date</span>
          <span className="text-sm text-white font-medium">{approachDate}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-space-400">Diameter</span>
          <span className="text-sm text-white font-medium">
            {diameterKm} km
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-space-400">Velocity</span>
          <span className="text-sm text-white font-medium">
            {velocity} km/s
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-space-400">Miss Distance</span>
          <span className="text-sm text-white font-medium">
            {missDistanceKm.toLocaleString()} km
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-space-400">Magnitude</span>
          <span className="text-sm text-white font-medium">
            H = {absolute_magnitude_h?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        to={`/asteroid/${id}`}
        className="block w-full"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-space-600 hover:bg-space-500 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>View Details & Analysis</span>
        </motion.button>
      </Link>

    </motion.div>
  )
}

export default AsteroidCard
