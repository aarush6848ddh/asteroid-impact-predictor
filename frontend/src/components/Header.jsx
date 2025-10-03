import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  Database, 
  BookOpen, 
  Target, 
  Zap, 
  Menu, 
  X,
  Sparkles,
  Satellite,
  Brain,
  Globe
} from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/asteroids', label: 'Browse Asteroids', icon: Database },
    { path: '/visualizations', label: 'Visualizations', icon: BarChart3 },
    { path: '/guide', label: 'Data Guide', icon: BookOpen },
  ]

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-intense backdrop-blur-2xl border-b border-white/20' 
          : 'glass backdrop-blur-xl border-b border-white/10'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-4"
          >
            <Link
              to="/"
              className="flex items-center space-x-4 text-white group"
            >
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-nebula-500 via-stellar-500 to-aurora-500 rounded-2xl flex items-center justify-center shadow-cosmic group-hover:shadow-neon-lg transition-all duration-500"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Target className="w-7 h-7 text-white" />
                </motion.div>
                
                {/* Animated orbit rings */}
                <motion.div
                  className="absolute inset-0 border-2 border-nebula-400/30 rounded-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 border border-stellar-400/20 rounded-2xl"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Status indicator */}
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-aurora-400 to-nebula-400 rounded-full flex items-center justify-center shadow-neon"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="w-2 h-2 text-white" />
                </motion.div>
              </div>
              
              <div className="flex flex-col">
                <motion.span 
                  className="text-xl font-bold gradient-text"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Asteroid Impact Predictor
                </motion.span>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-nebula-400 animate-pulse" />
                  <span className="text-xs text-cosmic-300 font-medium">
                    AI-Powered Space Monitoring
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`nav-link px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/10 text-white shadow-glass' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-nebula-500/20 to-stellar-500/20 rounded-xl"
                        layoutId="activeTab"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>
          
          {/* Status Badge */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div 
              className="flex items-center space-x-2 px-4 py-2 glass-neon rounded-xl"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(56, 189, 248, 0.3)',
                  '0 0 20px rgba(56, 189, 248, 0.5)',
                  '0 0 10px rgba(56, 189, 248, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Satellite className="w-4 h-4 text-nebula-400 animate-rotate-slow" />
              <span className="text-sm font-medium text-cosmic-200">
                NASA API Connected
              </span>
              <div className="w-2 h-2 bg-aurora-400 rounded-full animate-pulse" />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 glass rounded-xl text-white hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-dark border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/10 text-white' 
                          : 'text-cosmic-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-white/10"
              >
                <div className="flex items-center space-x-3 px-4 py-3">
                  <Brain className="w-5 h-5 text-stellar-400" />
                  <span className="text-sm text-cosmic-300">
                    Powered by NASA API & AI
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
