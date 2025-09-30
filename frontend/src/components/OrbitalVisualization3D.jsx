import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Sphere, Line, Text, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, Maximize2 } from 'lucide-react'
import * as THREE from 'three'
import { asteroidAPI } from '../services/api'

const OrbitalVisualization3D = ({ asteroid }) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [showOrbit, setShowOrbit] = useState(true)
  const [showPlanets, setShowPlanets] = useState(true)
  const [ephemerisData, setEphemerisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (asteroid?.designation) {
      loadEphemerisData()
    }
  }, [asteroid])

  const loadEphemerisData = async () => {
    setLoading(true)
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 365) // 1 year of data
      
      const data = await asteroidAPI.getAsteroidEphemeris(
        asteroid.designation,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        '7d' // Weekly data points
      )
      console.log('3D Ephemeris data received:', data)
      setEphemerisData(data.ephemeris_data || [])
    } catch (error) {
      console.error('Error loading ephemeris data:', error)
    } finally {
      setLoading(false)
    }
  }

  const orbitPath = useMemo(() => {
    if (!ephemerisData || !Array.isArray(ephemerisData) || ephemerisData.length === 0) return []
    
    return ephemerisData.map(point => [
      point.x * 0.1, // Scale down for visualization
      point.y * 0.1,
      point.z * 0.1
    ])
  }, [ephemerisData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Maximize2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">3D Orbital Visualization</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 px-4 py-2 bg-space-800 hover:bg-space-700 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <button
            onClick={() => setCurrentTime(0)}
            className="flex items-center space-x-2 px-4 py-2 bg-space-800 hover:bg-space-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-space-300 mb-2">
              Animation Speed
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-space-400 mt-1">{speed}x</div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOrbit}
                onChange={(e) => setShowOrbit(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-space-300">Show Orbit Path</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPlanets}
                onChange={(e) => setShowPlanets(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-space-300">Show Planets</span>
            </label>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="lg:col-span-3">
          <div className="h-96 bg-space-900 rounded-lg overflow-hidden relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-space-900 bg-opacity-75 rounded-lg z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-space-300">Loading orbital data...</p>
                </div>
              </div>
            ) : ephemerisData && ephemerisData.length > 0 ? (
              <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                
                {/* Sun */}
                <Sphere position={[0, 0, 0]} args={[0.1, 32, 32]}>
                  <meshBasicMaterial color="#FFD700" />
                </Sphere>
                
                {/* Planets */}
                {showPlanets && (
                  <>
                    <Planet position={[1, 0, 0]} size={0.03} color="#4A90E2" name="Earth" />
                    <Planet position={[0.7, 0, 0]} size={0.025} color="#FF6B6B" name="Venus" />
                    <Planet position={[1.5, 0, 0]} size={0.02} color="#FFA500" name="Mars" />
                  </>
                )}
                
                {/* Asteroid Orbit Path */}
                {showOrbit && orbitPath.length > 0 && (
                  <Line
                    points={orbitPath}
                    color="#00FF88"
                    lineWidth={2}
                  />
                )}
                
                {/* Asteroid */}
                <Asteroid3D 
                  data={ephemerisData} 
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                  speed={speed}
                />
                
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-space-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌌</span>
                  </div>
                  <p className="text-space-300">3D visualization will appear here</p>
                  <p className="text-sm text-space-400 mt-2">Loading orbital data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Planet = ({ position, size, color, name }) => {
  return (
    <group position={position}>
      <Sphere args={[size, 16, 16]}>
        <meshBasicMaterial color={color} />
      </Sphere>
      <Html distanceFactor={10}>
        <div className="text-xs text-white bg-space-800 px-2 py-1 rounded">
          {name}
        </div>
      </Html>
    </group>
  )
}

const Asteroid3D = ({ data, currentTime, isPlaying, speed }) => {
  const meshRef = useRef()
  const [position, setPosition] = useState([0, 0, 0])

  useFrame((state, delta) => {
    if (isPlaying && data && Array.isArray(data) && data.length > 0) {
      const time = (state.clock.elapsedTime * speed) % data.length
      const index = Math.floor(time) % data.length
      const nextIndex = (index + 1) % data.length
      const t = time - Math.floor(time)
      
      const current = data[index]
      const next = data[nextIndex]
      
      if (current && next && current.x !== undefined && current.y !== undefined && current.z !== undefined) {
        const x = (current.x + (next.x - current.x) * t) * 0.1
        const y = (current.y + (next.y - current.y) * t) * 0.1
        const z = (current.z + (next.z - current.z) * t) * 0.1
        
        setPosition([x, y, z])
        
        if (meshRef.current) {
          meshRef.current.position.set(x, y, z)
        }
      }
    }
  })

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.01, 8, 8]}>
        <meshBasicMaterial color="#FF4444" />
      </Sphere>
      <Html distanceFactor={10}>
        <div className="text-xs text-white bg-red-600 px-2 py-1 rounded">
          Asteroid
        </div>
      </Html>
    </group>
  )
}

export default OrbitalVisualization3D
