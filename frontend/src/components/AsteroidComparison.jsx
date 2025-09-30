import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, Search, Star, AlertTriangle, Shield, X, Plus, BarChart3, Activity, Zap, Target } from 'lucide-react'
import PlotlyChart from './PlotlyChart'
import { asteroidAPI } from '../services/api'
import plotlyService from '../services/plotlyService'

const AsteroidComparison = ({ asteroid }) => {
  const [similarAsteroids, setSimilarAsteroids] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAsteroids, setSelectedAsteroids] = useState([])
  const [comparisonData, setComparisonData] = useState(null)
  const [enhancedData, setEnhancedData] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('physical') // physical, orbital, risk
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (asteroid?.id) {
      loadSimilarAsteroids()
      loadEnhancedData()
    }
  }, [asteroid])

  useEffect(() => {
    if (selectedAsteroids.length > 0) {
      loadComparisonData()
    }
  }, [selectedAsteroids])

  const loadSimilarAsteroids = async () => {
    setLoading(true)
    try {
      // Get a list of asteroids for comparison
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)
      
      const data = await asteroidAPI.getAsteroids(
        today.toISOString().split('T')[0],
        nextWeek.toISOString().split('T')[0]
      )
      
      // Filter out the current asteroid and get similar ones
      const similar = data.asteroids
        .filter(a => a.id !== asteroid.id)
        .slice(0, 20) // Get 20 similar asteroids for better selection
      
      setSimilarAsteroids(similar)
    } catch (error) {
      console.error('Error loading similar asteroids:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEnhancedData = async () => {
    try {
      const data = await asteroidAPI.getEnhancedAnalysis(asteroid.id)
      setEnhancedData(prev => ({
        ...prev,
        [asteroid.id]: data
      }))
    } catch (error) {
      console.error('Error loading enhanced data:', error)
    }
  }

  const loadComparisonData = async () => {
    const allAsteroids = [asteroid, ...selectedAsteroids]
    const enhancedPromises = allAsteroids.map(async (ast) => {
      try {
        const data = await asteroidAPI.getEnhancedAnalysis(ast.id)
        return { id: ast.id, data }
      } catch (error) {
        console.error(`Error loading enhanced data for ${ast.id}:`, error)
        return { id: ast.id, data: null }
      }
    })

    const results = await Promise.all(enhancedPromises)
    const enhancedDataMap = {}
    results.forEach(({ id, data }) => {
      enhancedDataMap[id] = data
    })

    setEnhancedData(prev => ({
      ...prev,
      ...enhancedDataMap
    }))
  }

  const addToComparison = (asteroidToAdd) => {
    if (selectedAsteroids.length < 5 && !selectedAsteroids.find(a => a.id === asteroidToAdd.id)) {
      setSelectedAsteroids([...selectedAsteroids, asteroidToAdd])
    }
  }

  const removeFromComparison = (asteroidId) => {
    setSelectedAsteroids(selectedAsteroids.filter(a => a.id !== asteroidId))
  }

  const clearComparison = () => {
    setSelectedAsteroids([])
  }

  const filteredAsteroids = similarAsteroids.filter(ast => 
    ast.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ast.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const loadChartData = async () => {
      if (selectedAsteroids.length === 0) return

      try {
        let data
        switch (viewMode) {
          case 'physical':
            data = await plotlyService.getBoxPlot()
            break
          case 'orbital':
            data = await plotlyService.getParallelCoordinates()
            break
          case 'risk':
            data = await plotlyService.getRiskHeatmap()
            break
          case 'radar':
            data = await plotlyService.getRadarChart()
            break
          default:
            data = await plotlyService.getBoxPlot()
        }
        setChartData(data)
      } catch (error) {
        console.error('Error loading chart data:', error)
      }
    }

    loadChartData()
  }, [viewMode, selectedAsteroids])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Advanced Asteroid Comparison</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-space-300">
            {selectedAsteroids.length}/5 asteroids selected
          </div>
          {selectedAsteroids.length > 0 && (
            <button
              onClick={clearComparison}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Asteroids */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Selected for Comparison</h3>
        <div className="flex flex-wrap gap-4">
          {[asteroid, ...selectedAsteroids].map((ast, index) => (
            <motion.div
              key={ast.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                index === 0 ? 'bg-blue-600' : 'bg-space-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                {ast.is_potentially_hazardous ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : (
                  <Shield className="w-4 h-4 text-green-400" />
                )}
                <span className="text-white font-medium">
                  {ast.name || ast.designation}
                </span>
                {index === 0 && (
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">Primary</span>
                )}
              </div>
              {index > 0 && (
                <button
                  onClick={() => removeFromComparison(ast.id)}
                  className="text-space-400 hover:text-white p-1 rounded hover:bg-space-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Similar Asteroids</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-space-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search asteroids..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-space-800 text-white rounded-lg border border-space-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 px-3 py-2 bg-space-700 hover:bg-space-600 text-white rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAsteroids.slice(0, showAdvanced ? 12 : 8).map((ast) => (
            <motion.div
              key={ast.id}
              whileHover={{ scale: 1.02 }}
              className="bg-space-800 rounded-lg p-4 cursor-pointer hover:bg-space-700 transition-colors border border-space-700 hover:border-space-600"
              onClick={() => addToComparison(ast)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white text-sm">
                  {ast.name || ast.designation}
                </h4>
                <div className="flex items-center space-x-1">
                  {ast.is_potentially_hazardous ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  ) : (
                    <Shield className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-space-300">
                <div className="flex justify-between">
                  <span>Diameter:</span>
                  <span className="text-white">
                    {((ast.estimated_diameter?.meters?.estimated_diameter_max || 0) / 1000).toFixed(2)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Magnitude:</span>
                  <span className="text-white">
                    {ast.absolute_magnitude_h?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Risk:</span>
                  <span className={`font-medium ${
                    ast.is_potentially_hazardous ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {ast.is_potentially_hazardous ? 'High' : 'Low'}
                  </span>
                </div>
                {showAdvanced && (
                  <>
                    <div className="flex justify-between">
                      <span>Velocity:</span>
                      <span className="text-white">
                        {ast.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second?.toFixed(1) || 'N/A'} km/s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span className="text-white">
                        {ast.orbital_data?.orbital_period ? 
                          `${parseFloat(ast.orbital_data.orbital_period).toFixed(1)} days` : 'N/A'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <button className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add to Comparison</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View Mode Selector */}
      {selectedAsteroids.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Comparison Analysis</h3>
            <div className="flex space-x-2">
              {[
                { key: 'physical', label: 'Physical', icon: Target },
                { key: 'orbital', label: 'Orbital', icon: Activity },
                { key: 'risk', label: 'Risk', icon: AlertTriangle },
                { key: 'radar', label: 'Multi-D', icon: BarChart3 }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-space-700 text-space-300 hover:bg-space-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Charts */}
      {selectedAsteroids.length > 0 && (
        <div className="space-y-6">
          {chartData && (
            <div className="bg-space-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {viewMode === 'physical' && 'Physical Properties Comparison'}
                {viewMode === 'orbital' && 'Orbital Elements Comparison'}
                {viewMode === 'risk' && 'Risk Assessment Comparison'}
                {viewMode === 'radar' && 'Multi-Dimensional Comparison'}
              </h3>
              <PlotlyChart
                data={chartData.data}
                layout={chartData.layout}
                config={chartData.config}
                className="w-full h-96"
              />
            </div>
          )}

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[asteroid, ...selectedAsteroids].map((ast, index) => {
              const enhanced = enhancedData[ast.id]
              return (
                <motion.div
                  key={ast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-space-800 rounded-lg p-4 border border-space-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white text-sm">
                      {ast.name || ast.designation}
                    </h4>
                    {index === 0 && (
                      <span className="text-xs bg-blue-500 px-2 py-1 rounded">Primary</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-space-300">Diameter:</span>
                      <span className="text-white">
                        {((ast.estimated_diameter?.meters?.estimated_diameter_max || 0) / 1000).toFixed(2)} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-space-300">Magnitude:</span>
                      <span className="text-white">
                        {ast.absolute_magnitude_h?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-space-300">Semi-Major Axis:</span>
                      <span className="text-white">
                        {enhanced?.orbital_elements?.semi_major_axis?.toFixed(3) || 
                         ast.orbital_data?.semi_major_axis?.toFixed(3) || 'N/A'} AU
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-space-300">Eccentricity:</span>
                      <span className="text-white">
                        {enhanced?.orbital_elements?.eccentricity?.toFixed(3) || 
                         ast.orbital_data?.eccentricity?.toFixed(3) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-space-300">Risk Level:</span>
                      <span className={`font-medium ${
                        ast.is_potentially_hazardous ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {ast.is_potentially_hazardous ? 'High' : 'Low'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-900 bg-opacity-75 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-space-300">Loading similar asteroids...</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AsteroidComparison
