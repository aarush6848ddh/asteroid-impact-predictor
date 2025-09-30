import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'
import Plot from 'react-plotly.js'
import { asteroidAPI } from '../services/api'

const RiskAnalysisDashboard = ({ asteroid, riskPrediction }) => {
  const [enhancedAnalysis, setEnhancedAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('risk')

  useEffect(() => {
    if (asteroid?.id) {
      loadEnhancedAnalysis()
    }
  }, [asteroid])

  const loadEnhancedAnalysis = async () => {
    setLoading(true)
    try {
      const data = await asteroidAPI.getEnhancedAnalysis(asteroid.id)
      setEnhancedAnalysis(data)
    } catch (error) {
      console.error('Error loading enhanced analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return '#EF4444'
      case 'medium': return '#F59E0B'
      case 'moderate': return '#F59E0B'
      case 'low': return '#10B981'
      default: return '#6B7280'
    }
  }

  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-6 h-6" />
      case 'medium': return <AlertTriangle className="w-6 h-6" />
      case 'moderate': return <AlertTriangle className="w-6 h-6" />
      case 'low': return <Shield className="w-6 h-6" />
      default: return <Shield className="w-6 h-6" />
    }
  }

  const getRiskGaugeData = () => {
    const riskLevel = riskPrediction?.risk_level || 'Low'
    const confidence = riskPrediction?.confidence || 0.5
    
    const riskValues = { 'Low': 0.2, 'Moderate': 0.4, 'Medium': 0.6, 'High': 0.8 }
    const value = riskValues[riskLevel] || 0.2

    return {
      data: [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: value * 100,
          domain: { x: [0, 1], y: [0, 1] },
          title: { text: "Risk Level", font: { size: 20, color: "#E5E7EB" } },
          delta: { reference: 20 },
          gauge: {
            axis: { range: [null, 100] },
            bar: { color: getRiskColor(riskLevel) },
            steps: [
              { range: [0, 25], color: "#10B981" },
              { range: [25, 50], color: "#F59E0B" },
              { range: [50, 75], color: "#F59E0B" },
              { range: [75, 100], color: "#EF4444" }
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 90
            }
          }
        }
      ],
      layout: {
        width: 300,
        height: 300,
        margin: { t: 0, b: 0, l: 0, r: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#E5E7EB' }
      }
    }
  }

  const getOrbitalStabilityChart = () => {
    if (!enhancedAnalysis?.enhanced_features) return { data: [], layout: {} }

    const features = enhancedAnalysis.enhanced_features
    const metrics = [
      { name: 'Eccentricity', value: features.eccentricity || 0, max: 1 },
      { name: 'Inclination', value: features.inclination || 0, max: 180 },
      { name: 'Semi-major Axis', value: features.semi_major_axis || 0, max: 5 },
      { name: 'Orbital Stability', value: features.orbital_stability || 0, max: 1 }
    ]

    return {
      data: [
        {
          x: metrics.map(m => m.name),
          y: metrics.map(m => (m.value / m.max) * 100),
          type: 'bar',
          marker: {
            color: metrics.map(m => {
              const ratio = m.value / m.max
              if (ratio < 0.3) return '#10B981'
              if (ratio < 0.6) return '#F59E0B'
              return '#EF4444'
            })
          }
        }
      ],
      layout: {
        title: 'Orbital Stability Metrics',
        xaxis: { title: 'Metric' },
        yaxis: { title: 'Normalized Value (%)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#E5E7EB' }
      }
    }
  }

  const getConfidenceChart = () => {
    if (!riskPrediction) return { data: [], layout: {} }

    const confidence = riskPrediction.confidence * 100
    const uncertainty = 100 - confidence

    return {
      data: [
        {
          values: [confidence, uncertainty],
          labels: ['Confidence', 'Uncertainty'],
          type: 'pie',
          marker: {
            colors: ['#10B981', '#6B7280']
          },
          textinfo: 'label+percent',
          textposition: 'outside'
        }
      ],
      layout: {
        title: 'Prediction Confidence',
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#E5E7EB' },
        showlegend: true
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Risk Analysis Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 bg-space-800 border border-space-700 rounded-lg text-white"
          >
            <option value="risk">Risk Assessment</option>
            <option value="orbital">Orbital Stability</option>
            <option value="confidence">Prediction Confidence</option>
          </select>
        </div>
      </div>

      {/* Risk Level Card */}
      {riskPrediction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-space-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div style={{ color: getRiskColor(riskPrediction.risk_level) }}>
                {getRiskIcon(riskPrediction.risk_level)}
              </div>
              <h3 className="text-xl font-bold text-white">Risk Level</h3>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: getRiskColor(riskPrediction.risk_level) }}>
              {riskPrediction.risk_level}
            </div>
            <div className="text-space-300">
              Confidence: {(riskPrediction.confidence * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-space-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Cluster Group</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {riskPrediction.cluster_group}
            </div>
            <div className="text-space-300">
              ML Classification Group
            </div>
          </div>

          <div className="bg-space-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Hazard Status</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {asteroid.is_potentially_hazardous ? 'Hazardous' : 'Safe'}
            </div>
            <div className="text-space-300">
              NASA Classification
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Gauge */}
        {selectedMetric === 'risk' && riskPrediction && (
          <div className="bg-space-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Risk Assessment Gauge</h3>
            <div className="flex justify-center">
              <Plot
                data={getRiskGaugeData().data}
                layout={getRiskGaugeData().layout}
                config={{ displayModeBar: false }}
                style={{ width: '100%', height: '300px' }}
              />
            </div>
          </div>
        )}

        {/* Orbital Stability Chart */}
        {selectedMetric === 'orbital' && (
          <div className="bg-space-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Orbital Stability Analysis</h3>
            <Plot
              data={getOrbitalStabilityChart().data}
              layout={getOrbitalStabilityChart().layout}
              config={{ displayModeBar: false }}
              style={{ width: '100%', height: '300px' }}
            />
          </div>
        )}

        {/* Confidence Chart */}
        {selectedMetric === 'confidence' && riskPrediction && (
          <div className="bg-space-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Prediction Confidence</h3>
            <Plot
              data={getConfidenceChart().data}
              layout={getConfidenceChart().layout}
              config={{ displayModeBar: false }}
              style={{ width: '100%', height: '300px' }}
            />
          </div>
        )}

        {/* Enhanced Features Table */}
        {enhancedAnalysis?.enhanced_features && (
          <div className="bg-space-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Enhanced Features</h3>
            <div className="space-y-3">
              {Object.entries(enhancedAnalysis.enhanced_features).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-space-700">
                  <span className="text-space-300 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-white font-medium">
                    {typeof value === 'number' ? value.toFixed(4) : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-900 bg-opacity-75 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-space-300">Loading enhanced analysis...</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default RiskAnalysisDashboard
