import React from 'react'
import { Link } from 'react-router-dom'
import { Home, BarChart3, Database, BookOpen, Target, Zap } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-space-900 border-b border-space-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-3 text-white hover:text-space-300 transition-colors"
            >
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Target className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse">
                  <Zap className="w-2 h-2 text-white m-0.5" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Asteroid Impact Predictor
                </span>
                <span className="text-xs text-space-400 -mt-1">AI-Powered Space Monitoring</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 text-space-400 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/asteroids"
                className="flex items-center space-x-1 text-space-400 hover:text-white transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>Browse Asteroids</span>
              </Link>
              <Link
                to="/visualizations"
                className="flex items-center space-x-1 text-space-400 hover:text-white transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Visualizations</span>
              </Link>
              <Link
                to="/guide"
                className="flex items-center space-x-1 text-space-400 hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Data Guide</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-space-400">
              Powered by NASA API & AI
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
