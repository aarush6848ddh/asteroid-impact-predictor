import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, subDays, addDays } from 'date-fns'
import { Search, Calendar, AlertTriangle, Shield, Clock, Zap } from 'lucide-react'
import { asteroidAPI } from '../services/api'
import AsteroidCard from '../components/AsteroidCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const AsteroidBrowser = () => {
  const [asteroids, setAsteroids] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [riskFilter, setRiskFilter] = useState('all')

  // Load asteroids on component mount and date change
  useEffect(() => {
    loadAsteroids()
  }, [selectedDate])

  const loadAsteroids = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const endDate = format(addDays(new Date(selectedDate), 6), 'yyyy-MM-dd')
      const data = await asteroidAPI.getAsteroids(selectedDate, endDate)
      setAsteroids(data.asteroids || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter asteroids based on search term and risk level
  const filteredAsteroids = asteroids.filter(asteroid => {
    const matchesSearch = asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
    const asteroidRiskLevel = asteroid.risk_prediction?.risk_level || (asteroid.is_potentially_hazardous ? 'High' : 'Low')
    
    const matchesRisk = riskFilter === 'all' || 
      (riskFilter === 'hazardous' && asteroid.is_potentially_hazardous) ||
      (riskFilter === 'safe' && !asteroid.is_potentially_hazardous) ||
      (riskFilter === 'moderate' && asteroidRiskLevel === 'Moderate') ||
      (riskFilter === 'medium' && asteroidRiskLevel === 'Medium') ||
      (riskFilter === 'high' && asteroidRiskLevel === 'High') ||
      (riskFilter === 'low' && asteroidRiskLevel === 'Low')
    
    return matchesSearch && matchesRisk
  })

  const riskStats = {
    total: asteroids.length,
    hazardous: asteroids.filter(a => a.is_potentially_hazardous).length,
    high: asteroids.filter(a => (a.risk_prediction?.risk_level || (a.is_potentially_hazardous ? 'High' : 'Low')) === 'High').length,
    moderate: asteroids.filter(a => (a.risk_prediction?.risk_level || (a.is_potentially_hazardous ? 'High' : 'Low')) === 'Moderate').length,
    medium: asteroids.filter(a => (a.risk_prediction?.risk_level || (a.is_potentially_hazardous ? 'High' : 'Low')) === 'Medium').length,
    low: asteroids.filter(a => (a.risk_prediction?.risk_level || (a.is_potentially_hazardous ? 'High' : 'Low')) === 'Low').length,
    uncertain: asteroids.filter(a => (a.risk_prediction?.risk_level || (a.is_potentially_hazardous ? 'High' : 'Low')) === 'Uncertain').length
  }

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Asteroid Impact Predictor
          </h1>
          <p className="text-xl text-space-300 max-w-3xl mx-auto">
            Monitor near-Earth asteroids with AI-powered risk analysis and real-time tracking
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-space-300">
                <Calendar className="w-4 h-4" />
                <span>Start Date</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 bg-space-800/50 border border-space-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-space-500 focus:border-transparent"
              />
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-space-300">
                <Search className="w-4 h-4" />
                <span>Search Asteroids</span>
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-space-800/50 border border-space-600 rounded-lg text-white placeholder-space-400 focus:outline-none focus:ring-2 focus:ring-space-500 focus:border-transparent"
              />
            </div>

            {/* Risk Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-space-300">
                <Shield className="w-4 h-4" />
                <span>Risk Filter</span>
              </label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-4 py-3 bg-space-800/50 border border-space-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-space-500 focus:border-transparent"
              >
                <option value="all">All Asteroids</option>
                <option value="hazardous">Potentially Hazardous</option>
                <option value="high">High Risk</option>
                <option value="moderate">Moderate Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
                <option value="safe">Safe</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-space-400" />
              <span className="text-xl font-bold text-white">{riskStats.total}</span>
            </div>
            <p className="text-xs text-space-300">Total</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-asteroid-high" />
              <span className="text-xl font-bold text-asteroid-high">{riskStats.high}</span>
            </div>
            <p className="text-xs text-space-300">High Risk</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-asteroid-moderate" />
              <span className="text-xl font-bold text-asteroid-moderate">{riskStats.moderate}</span>
            </div>
            <p className="text-xs text-space-300">Moderate</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-asteroid-medium" />
              <span className="text-xl font-bold text-asteroid-medium">{riskStats.medium}</span>
            </div>
            <p className="text-xs text-space-300">Medium</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-asteroid-low" />
              <span className="text-xl font-bold text-asteroid-low">{riskStats.low}</span>
            </div>
            <p className="text-xs text-space-300">Low Risk</p>
          </div>
          
          <div className="glass rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-asteroid-uncertain" />
              <span className="text-xl font-bold text-asteroid-uncertain">{riskStats.uncertain}</span>
            </div>
            <p className="text-xs text-space-300">Uncertain</p>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={loadAsteroids} />}

        {/* Asteroids Grid */}
        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredAsteroids.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-space-800 rounded-full flex items-center justify-center">
                    <Search className="w-12 h-12 text-space-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-space-300 mb-2">No Asteroids Found</h3>
                  <p className="text-space-400">
                    Try adjusting your search criteria or date range
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAsteroids.map((asteroid, index) => (
                    <motion.div
                      key={asteroid.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <AsteroidCard asteroid={asteroid} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AsteroidBrowser
