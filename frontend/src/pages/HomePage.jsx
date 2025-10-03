import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Eye, 
  Database, 
  Zap, 
  Globe, 
  Target, 
  BarChart3,
  ArrowRight,
  Star,
  Satellite,
  Cpu,
  Sparkles,
  BookOpen,
  Layers,
  Shield,
  TrendingUp,
  Activity,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const journeyRef = useRef(null);
  const apisRef = useRef(null);
  const projectRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Intersection Observer for animations
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const journeyInView = useInView(journeyRef, { once: true, margin: "-100px" });
  const apisInView = useInView(apisRef, { once: true, margin: "-100px" });
  const projectInView = useInView(projectRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y }}
      >
        {/* Animated Background - Bullet Cluster */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Bullet Cluster Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/bulletcluster.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0001})`
            }}
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Multiple Gradient Overlays for Depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-950/70 via-cosmic-900/40 to-cosmic-950/70" />
          <div className="absolute inset-0 bg-gradient-radial from-nebula-500/15 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/80 via-transparent to-transparent" />
          
          {/* Cosmic Grid Overlay */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              animation: 'gradient-shift 25s ease infinite'
            }} />
          </div>
          
          {/* Pulsing cosmic effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-stellar-400/5 via-transparent to-transparent"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>


        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            {/* Status Badge */}
            <motion.div 
              className="inline-flex items-center space-x-3 glass-neon rounded-full px-6 py-3 mb-8"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(56, 189, 248, 0.3)',
                  '0 0 30px rgba(56, 189, 248, 0.5)',
                  '0 0 20px rgba(56, 189, 248, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-nebula-400 animate-pulse" />
              <span className="text-nebula-300 font-medium">Space & AI Enthusiast</span>
              <div className="w-2 h-2 bg-aurora-400 rounded-full animate-pulse" />
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              className="text-7xl md:text-8xl font-bold mb-8 gradient-text leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Asteroid Impact
              <br />
              <span className="gradient-text-stellar">Predictor</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-cosmic-200 max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A cutting-edge platform combining NASA's authoritative space data with advanced 
              machine learning to predict and visualize asteroid threats to Earth.
            </motion.p>
            
            {/* Feature Tags */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: Rocket, label: 'Space Exploration', color: 'orange' },
                { icon: Brain, label: 'Machine Learning', color: 'green' },
                { icon: Database, label: 'NASA APIs', color: 'blue' },
                { icon: Shield, label: 'Risk Assessment', color: 'purple' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`flex items-center space-x-2 glass rounded-xl px-4 py-3 hover:scale-105 transition-all duration-300 cursor-pointer`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                  <span className="text-cosmic-200 font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/asteroids"
                  className="btn-primary flex items-center space-x-3 px-8 py-4 text-lg font-semibold"
                >
                  <Target className="w-6 h-6" />
                  <span>Explore Asteroids</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/visualizations"
                  className="btn-secondary flex items-center space-x-3 px-8 py-4 text-lg font-semibold"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>View Visualizations</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center space-y-2 text-cosmic-400"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        className="py-32 relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
              Advanced Features
            </h2>
            <p className="text-xl text-cosmic-300 max-w-3xl mx-auto">
              Cutting-edge technology meets space science to deliver unparalleled asteroid monitoring capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'AI Risk Assessment',
                description: 'Machine learning models analyze asteroid characteristics to predict impact probabilities with professional-grade accuracy.',
                color: 'nebula',
                gradient: 'from-nebula-500/20 to-nebula-600/20'
              },
              {
                icon: BarChart3,
                title: 'Advanced Visualizations',
                description: 'Interactive 3D plots, animated timelines, and statistical charts powered by Plotly for intuitive data exploration.',
                color: 'stellar',
                gradient: 'from-stellar-500/20 to-stellar-600/20'
              },
              {
                icon: Database,
                title: 'Real-Time Data',
                description: 'Live integration with NASA APIs ensures you\'re always viewing the most current asteroid data available.',
                color: 'aurora',
                gradient: 'from-aurora-500/20 to-aurora-600/20'
              },
              {
                icon: Globe,
                title: 'Orbital Mechanics',
                description: 'Precise calculations of asteroid trajectories and orbital elements using NASA\'s Horizons ephemeris system.',
                color: 'orange',
                gradient: 'from-orange-500/20 to-orange-600/20'
              },
              {
                icon: Brain,
                title: 'Machine Learning',
                description: 'Advanced ML algorithms trained on historical data to identify patterns and improve prediction accuracy.',
                color: 'green',
                gradient: 'from-green-500/20 to-green-600/20'
              },
              {
                icon: Zap,
                title: 'Interactive Experience',
                description: 'Modern web interface with smooth animations, responsive design, and intuitive controls.',
                color: 'purple',
                gradient: 'from-purple-500/20 to-purple-600/20'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="cosmic-card group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-400`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-nebula-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-cosmic-300 leading-relaxed group-hover:text-cosmic-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-nebula-500/5 to-stellar-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* NASA APIs Section */}
      <motion.section 
        ref={apisRef}
        className="py-32 relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-nebula-900/20 via-stellar-900/10 to-aurora-900/20" />
        <div className="absolute inset-0 bg-gradient-radial from-nebula-500/5 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={apisInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
              Powered by NASA's Advanced APIs
            </h2>
            <p className="text-xl text-cosmic-300 max-w-4xl mx-auto">
              Leveraging NASA's cutting-edge APIs to access real-time asteroid data and orbital mechanics calculations, 
              bringing professional-grade space science to your browser.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* JPL NeoWS API */}
            <motion.div
              className="stellar-card group"
              initial={{ opacity: 0, x: -50 }}
              animate={apisInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <motion.div 
                  className="p-4 bg-gradient-to-br from-nebula-500/20 to-nebula-600/20 rounded-2xl"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Satellite className="w-10 h-10 text-nebula-400" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">JPL NeoWS API</h3>
                  <p className="text-cosmic-400 text-lg">Near Earth Object Web Service</p>
                </div>
              </div>
              
              <div className="space-y-6 text-cosmic-300">
                <p className="text-lg leading-relaxed">
                  The <span className="text-nebula-400 font-semibold">NASA JPL Near Earth Object Web Service</span> provides 
                  comprehensive data about asteroids and comets that approach Earth.
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white mb-4">Key Capabilities:</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Star, text: 'Real-time asteroid orbital data', color: 'yellow' },
                      { icon: Target, text: 'Close approach predictions', color: 'red' },
                      { icon: Zap, text: 'Impact risk assessments', color: 'orange' },
                      { icon: BarChart3, text: 'Physical and orbital characteristics', color: 'green' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.text}
                        className="flex items-center space-x-3 p-3 glass rounded-xl hover:bg-white/5 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={apisInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* JPL Horizons API */}
            <motion.div
              className="stellar-card group"
              initial={{ opacity: 0, x: 50 }}
              animate={apisInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <motion.div 
                  className="p-4 bg-gradient-to-br from-stellar-500/20 to-stellar-600/20 rounded-2xl"
                  whileHover={{ rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Cpu className="w-10 h-10 text-stellar-400" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">JPL Horizons API</h3>
                  <p className="text-cosmic-400 text-lg">Solar System Dynamics</p>
                </div>
              </div>
              
              <div className="space-y-6 text-cosmic-300">
                <p className="text-lg leading-relaxed">
                  The <span className="text-stellar-400 font-semibold">NASA JPL Horizons System</span> is a powerful 
                  ephemeris computation service providing precise positions and orbital mechanics data.
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white mb-4">Key Capabilities:</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Globe, text: 'High-precision orbital calculations', color: 'blue' },
                      { icon: Rocket, text: 'Ephemeris data for any celestial body', color: 'orange' },
                      { icon: Eye, text: 'Observational predictions', color: 'green' },
                      { icon: Database, text: 'Historical and future trajectory data', color: 'purple' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.text}
                        className="flex items-center space-x-3 p-3 glass rounded-xl hover:bg-white/5 transition-all duration-300"
                        initial={{ opacity: 0, x: 20 }}
                        animate={apisInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        whileHover={{ x: -5 }}
                      >
                        <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    ))}
              </div>
            </div>
          </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section 
        ref={ctaRef}
        className="py-32 relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-900/50 via-nebula-900/30 to-stellar-900/50" />
        <div className="absolute inset-0 bg-gradient-radial from-aurora-500/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-6xl md:text-7xl font-bold mb-8 gradient-text">
              Ready to Explore the Cosmos?
            </h2>
              <p className="text-2xl text-cosmic-300 max-w-4xl mx-auto leading-relaxed">
              Dive into the world of asteroid impact prediction and discover how modern technology 
              helps us understand and prepare for cosmic threats.
            </p>
          </div>
          
            <motion.div 
              className="flex flex-wrap justify-center gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {[
                {
                  to: '/asteroids',
                  label: 'Explore Asteroids',
                  icon: Target,
                  variant: 'primary',
                  description: 'Browse and analyze asteroid data'
                },
                {
                  to: '/visualizations',
                  label: 'View Visualizations',
                  icon: BarChart3,
                  variant: 'secondary',
                  description: 'Interactive charts and graphs'
                },
                {
                  to: '/guide',
                  label: 'Learn About the Data',
                  icon: BookOpen,
                  variant: 'neon',
                  description: 'Understanding the science'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
            <Link 
                    to={item.to}
                    className={`group flex flex-col items-center space-y-4 px-8 py-8 rounded-3xl transition-all duration-500 ${
                      item.variant === 'primary' 
                        ? 'btn-primary' 
                        : item.variant === 'secondary' 
                        ? 'btn-secondary' 
                        : 'btn-neon'
                    }`}
                  >
                    <div className="p-4 glass rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">{item.label}</h3>
                      <p className="text-sm opacity-80">{item.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-950/80 via-cosmic-900/60 to-cosmic-950/80" />
        <div className="relative z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <motion.div 
                  className="inline-flex items-center space-x-3 glass-neon rounded-full px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(56, 189, 248, 0.3)',
                      '0 0 30px rgba(56, 189, 248, 0.5)',
                      '0 0 20px rgba(56, 189, 248, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-nebula-400 animate-pulse" />
                  <span className="text-nebula-300 font-semibold text-lg">Built by Aarush Singh</span>
                </motion.div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  A Passion Project
                </h3>
                <p className="text-xl text-cosmic-300 max-w-3xl mx-auto leading-relaxed">
                  Combining space science, artificial intelligence, and modern web development 
                  to create an accessible platform for asteroid impact prediction and space science education.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap justify-center items-center gap-8 text-cosmic-400"
              >
                {[
                  { icon: Rocket, label: 'Space Science', color: 'orange' },
                  { icon: Brain, label: 'Machine Learning', color: 'green' },
                  { icon: Database, label: 'NASA APIs', color: 'blue' },
                  { icon: Globe, label: 'Web Development', color: 'purple' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center space-x-3 glass rounded-xl px-4 py-3 hover:bg-white/5 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="pt-8 border-t border-white/10"
              >
                <p className="text-cosmic-500 text-sm">
                  Powered by NASA JPL NeoWS API and NASA JPL Horizons API
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;
