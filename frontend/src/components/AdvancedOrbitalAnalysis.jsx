import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Orbit, 
  Clock, 
  Target, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  BarChart3
} from 'lucide-react'
import { 
  getAsteroidEphemeris, 
  getAsteroidOrbitalElements, 
  getObserverEphemeris,
  calculateOrbitalPeriod
} from '../services/horizonsApi'

const AdvancedOrbitalAnalysis = ({ asteroid }) => {
  const [activeTab, setActiveTab] = useState('ephemeris')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState({})
  const [timeRange, setTimeRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const tabs = [
    { id: 'ephemeris', label: 'Real-time Position', icon: Target },
    { id: 'elements', label: 'Orbital Elements', icon: Orbit },
    { id: 'observer', label: 'Observer View', icon: Eye },
    { id: 'predictions', label: 'Trajectory Predictions', icon: TrendingUp }
  ]

  useEffect(() => {
    if (asteroid) {
      loadData()
    }
  }, [asteroid, activeTab, timeRange])

  const loadData = async () => {
    if (!asteroid) return

    setLoading(true)
    setError(null)

    try {
      const asteroidId = asteroid.designation || asteroid.name || asteroid.id
      
      switch (activeTab) {
        case 'ephemeris':
          const ephemerisData = await getAsteroidEphemeris(
            asteroidId, 
            timeRange.start, 
            timeRange.end, 
            '1d'
          )
          setData({ ephemeris: ephemerisData })
          break

        case 'elements':
          const elementsData = await getAsteroidOrbitalElements(asteroidId)
          setData({ elements: elementsData })
          break

        case 'observer':
          const observerData = await getObserverEphemeris(
            asteroidId, 
            timeRange.start, 
            timeRange.end
          )
          setData({ observer: observerData })
          break

        case 'predictions':
          // Generate trajectory predictions
          const predictionData = await generateTrajectoryPredictions(asteroidId)
          setData({ predictions: predictionData })
          break

        default:
          break
      }
    } catch (err) {
      setError(err.message)
      console.error('Error loading orbital data:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateTrajectoryPredictions = async (asteroidId) => {
    // Generate predictions for the next year
    const startDate = new Date()
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    
    const ephemerisData = await getAsteroidEphemeris(
      asteroidId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      '7d' // Weekly predictions
    )
    
    return ephemerisData
  }

  const formatDistance = (distance) => {
    if (distance < 0.01) {
      return `${(distance * 149597870.7).toFixed(0)} km`
    }
    return `${distance.toFixed(3)} AU`
  }

  const formatVelocity = (velocity) => {
    return `${velocity.toFixed(2)} km/s`
  }

  const formatAngle = (angle) => {
    return `${angle.toFixed(2)}°`
  }

  const renderEphemerisData = () => {
    if (!data.ephemeris || data.ephemeris.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.ephemeris.slice(0, 10).map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-space-800 rounded-lg p-4 border border-space-700"
            >
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-space-300">{point.time}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-space-400">Position:</span>
                  <span className="text-white">
                    ({point.x.toFixed(3)}, {point.y.toFixed(3)}, {point.z.toFixed(3)}) AU
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-space-400">Velocity:</span>
                  <span className="text-white">
                    {formatVelocity(Math.sqrt(point.vx**2 + point.vy**2 + point.vz**2))}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderOrbitalElements = () => {
    if (!data.elements) return null

    const elements = data.elements
    const period = calculateOrbitalPeriod(elements.semi_major_axis)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Keplerian Elements</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Semi-major Axis</span>
              <span className="text-white font-mono">{elements.semi_major_axis?.toFixed(6)} AU</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Eccentricity</span>
              <span className="text-white font-mono">{elements.eccentricity?.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Inclination</span>
              <span className="text-white font-mono">{formatAngle(elements.inclination)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Longitude of Ascending Node</span>
              <span className="text-white font-mono">{formatAngle(elements.longitude_of_ascending_node)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Argument of Perihelion</span>
              <span className="text-white font-mono">{formatAngle(elements.argument_of_perihelion)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Mean Anomaly</span>
              <span className="text-white font-mono">{formatAngle(elements.mean_anomaly)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Derived Properties</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Orbital Period</span>
              <span className="text-white font-mono">{period.toFixed(1)} days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Perihelion Distance</span>
              <span className="text-white font-mono">
                {(elements.semi_major_axis * (1 - elements.eccentricity)).toFixed(6)} AU
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Aphelion Distance</span>
              <span className="text-white font-mono">
                {(elements.semi_major_axis * (1 + elements.eccentricity)).toFixed(6)} AU
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-space-800 rounded-lg">
              <span className="text-space-400">Epoch</span>
              <span className="text-white font-mono">{elements.epoch}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }


  const renderObserverData = () => {
    if (!data.observer || data.observer.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.observer.slice(0, 12).map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-space-800 rounded-lg p-4 border border-space-700"
            >
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-4 h-4 text-green-400" />
                <span className="text-sm text-space-300">{point.time}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-space-400">RA:</span>
                  <span className="text-white">{formatAngle(point.ra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-space-400">Dec:</span>
                  <span className="text-white">{formatAngle(point.dec)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-space-400">Distance:</span>
                  <span className="text-white">{formatDistance(point.distance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-space-400">Magnitude:</span>
                  <span className="text-white">{point.magnitude?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-space-400">Elongation:</span>
                  <span className="text-white">{formatAngle(point.elongation)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderPredictions = () => {
    if (!data.predictions || data.predictions.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="bg-space-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Trajectory Predictions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.predictions.slice(0, 8).map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-space-700 rounded-lg p-4"
              >
                <div className="text-sm text-space-300 mb-2">{point.time}</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-space-400">Position:</span>
                    <span className="text-white">
                      ({point.x.toFixed(2)}, {point.y.toFixed(2)}, {point.z.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-space-400">Speed:</span>
                    <span className="text-white">
                      {formatVelocity(Math.sqrt(point.vx**2 + point.vy**2 + point.vz**2))}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!asteroid) return null

  return (
    <div className="bg-space-900 rounded-xl p-6 border border-space-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Orbit className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Advanced Orbital Analysis</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-space-800 hover:bg-space-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 bg-space-800 hover:bg-space-700 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 p-4 bg-space-800 rounded-lg">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm text-space-400 mb-1">Start Date</label>
            <input
              type="date"
              value={timeRange.start}
              onChange={(e) => setTimeRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-space-700 border border-space-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-space-400 mb-1">End Date</label>
            <input
              type="date"
              value={timeRange.end}
              onChange={(e) => setTimeRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-space-700 border border-space-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-space-800 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-space-400 hover:text-white hover:bg-space-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
              <span className="text-white">Loading orbital data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-2">Error loading data</p>
              <p className="text-space-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'ephemeris' && renderEphemerisData()}
            {activeTab === 'elements' && renderOrbitalElements()}
            {activeTab === 'observer' && renderObserverData()}
            {activeTab === 'predictions' && renderPredictions()}
          </>
        )}
      </div>
    </div>
  )
}

export default AdvancedOrbitalAnalysis
