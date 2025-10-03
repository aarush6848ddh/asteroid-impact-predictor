import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Zap, AlertTriangle, Shield, ExternalLink, Target, Activity, TrendingUp } from 'lucide-react'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className="cosmic-card group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <motion.h3 
            className="text-xl font-bold text-white mb-3 group-hover:text-nebula-300 transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            {name}
          </motion.h3>
          <motion.div 
            className={`risk-badge ${riskColor} inline-flex items-center space-x-2`}
            whileHover={{ scale: 1.05 }}
          >
            {is_potentially_hazardous ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            <span className="font-semibold">{riskLevel} Risk</span>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-2">
          {nasa_jpl_url && (
            <motion.a
              href={nasa_jpl_url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-neon px-4 py-2 text-sm font-medium text-nebula-300 hover:text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
              title="View on NASA JPL"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>NASA JPL</span>
            </motion.a>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { 
            icon: Calendar, 
            label: 'Approach Date', 
            value: approachDate, 
            color: 'nebula' 
          },
          { 
            icon: Target, 
            label: 'Diameter', 
            value: `${diameterKm} km`, 
            color: 'stellar' 
          },
          { 
            icon: Zap, 
            label: 'Velocity', 
            value: `${velocity} km/s`, 
            color: 'aurora' 
          },
          { 
            icon: Activity, 
            label: 'Miss Distance', 
            value: `${missDistanceKm.toLocaleString()} km`, 
            color: 'orange' 
          }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="glass rounded-xl p-4 group-hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 rounded-lg`}>
                <item.icon className={`w-4 h-4 text-${item.color}-400`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cosmic-400 font-medium truncate">{item.label}</p>
                <p className="text-sm text-white font-semibold truncate">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Magnitude */}
      <motion.div 
        className="glass rounded-xl p-4 mb-6"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-cosmic-400 font-medium">Absolute Magnitude</p>
            <p className="text-sm text-white font-semibold">
              H = {absolute_magnitude_h?.toFixed(1) || 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <Link
        to={`/asteroid/${id}`}
        className="block w-full"
      >
        <motion.button
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
          }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full py-4 px-6 text-lg font-semibold flex items-center justify-center space-x-3 group"
        >
          <Target className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>View Details & Analysis</span>
          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        </motion.button>
      </Link>

    </motion.div>
  )
}

export default AsteroidCard
