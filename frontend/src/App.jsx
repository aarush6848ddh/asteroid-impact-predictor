import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      <div className="min-h-screen bg-space-950">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/asteroids" element={<AsteroidBrowser />} />
                <Route path="/asteroid/:id" element={<AsteroidDetail />} />
                <Route path="/visualizations" element={<AdvancedVisualizations />} />
                <Route path="/guide" element={<DataGuide />} />
              </Routes>
        </motion.main>
      </div>
    </Router>
  )
}

export default App
