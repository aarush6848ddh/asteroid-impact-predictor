import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AsteroidBrowser from './pages/AsteroidBrowser'
import AsteroidDetail from './pages/AsteroidDetail'
import AdvancedVisualizations from './pages/AdvancedVisualizations'
import DataGuide from './pages/DataGuide'
import './App.css'

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-cosmic-950 relative overflow-hidden">

        {/* Cosmic grid overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gradient-shift 30s ease infinite'
          }} />
        </div>

        <Header />
        
        <AnimatePresence mode="wait">
          <motion.main
            key={window.location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="relative z-10"
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/asteroids" element={<AsteroidBrowser />} />
              <Route path="/asteroid/:id" element={<AsteroidDetail />} />
              <Route path="/visualizations" element={<AdvancedVisualizations />} />
              <Route path="/guide" element={<DataGuide />} />
            </Routes>
          </motion.main>
        </AnimatePresence>

        {/* Cosmic glow effect */}
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-nebula-500/20 via-stellar-500/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
        <div className="fixed bottom-0 right-0 w-64 h-64 bg-gradient-radial from-stellar-500/20 via-aurora-500/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      </div>
    </Router>
  )
}

export default App
