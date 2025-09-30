import React, { useState, useEffect } from 'react'
import PlotlyChart from './PlotlyChart'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Zap, Target } from 'lucide-react'
import { asteroidAPI } from '../services/api'
import plotlyService from '../services/plotlyService'

const AsteroidEphemerisChart = ({ asteroid }) => {
  const [ephemerisData, setEphemerisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chartType, setChartType] = useState('position')
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    if (asteroid?.designation) {
      loadEphemerisData()
    }
  }, [asteroid, timeRange])

  const loadEphemerisData = async () => {
    setLoading(true)
    try {
      const startDate = new Date()
      const endDate = new Date()
      
      const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
      endDate.setDate(endDate.getDate() + days)
      
      const data = await asteroidAPI.getAsteroidEphemeris(
        asteroid.designation,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        '1d'
      )
      console.log('Ephemeris data received:', data)
      setEphemerisData(data.ephemeris_data || [])
    } catch (error) {
      console.error('Error loading ephemeris data:', error)
    } finally {
      setLoading(false)
    }
  }

  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const loadChartData = async () => {
      if (!ephemerisData) return

      try {
        let data
        switch (chartType) {
          case 'position':
            data = await plotlyService.getAnimatedTimeline()
            break
          case 'velocity':
            data = await plotlyService.getViolinPlot()
            break
          case 'distance':
            data = await plotlyService.getContourPlot()
            break
          case '3d':
            data = await plotlyService.get3DScatterPlot()
            break
          default:
            data = await plotlyService.getAnimatedTimeline()
        }
        setChartData(data)
      } catch (error) {
        console.error('Error loading chart data:', error)
      }
    }

    loadChartData()
  }, [chartType, ephemerisData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Ephemeris Data Analysis</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-4 py-2 bg-space-800 border border-space-700 rounded-lg text-white"
          >
            <option value="position">Position</option>
            <option value="velocity">Velocity</option>
            <option value="distance">Distance</option>
            <option value="3d">3D Orbit</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-space-800 border border-space-700 rounded-lg text-white"
          >
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="365d">1 Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      {ephemerisData && ephemerisData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-space-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-space-300">Data Points</span>
            </div>
            <div className="text-2xl font-bold text-white">{ephemerisData.length}</div>
          </div>
          
          <div className="bg-space-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm text-space-300">Avg Distance</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {(ephemerisData.reduce((sum, point) => sum + Math.sqrt(point.x**2 + point.y**2 + point.z**2), 0) / ephemerisData.length).toFixed(3)} AU
            </div>
          </div>
          
          <div className="bg-space-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-space-300">Avg Velocity</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {(ephemerisData.reduce((sum, point) => sum + Math.sqrt(point.vx**2 + point.vy**2 + point.vz**2), 0) / ephemerisData.length).toFixed(3)} AU/day
            </div>
          </div>
          
          <div className="bg-space-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-space-300">Orbital Period</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {asteroid.orbital_data?.orbital_period ? 
                `${parseFloat(asteroid.orbital_data.orbital_period).toFixed(0)} days` : 
                'N/A'
              }
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-96 bg-space-900 rounded-lg overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-space-300">Loading ephemeris data...</p>
            </div>
          </div>
        ) : chartData ? (
          <PlotlyChart
            data={chartData.data}
            layout={chartData.layout}
            config={chartData.config}
            className="w-full h-full"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-space-300">No chart data available</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AsteroidEphemerisChart
