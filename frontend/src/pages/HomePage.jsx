import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  BookOpen
} from 'lucide-react';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const journeyRef = useRef(null);
  const apisRef = useRef(null);
  const projectRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check visibility of sections
      const sections = [
        { ref: heroRef, key: 'hero' },
        { ref: featuresRef, key: 'features' },
        { ref: journeyRef, key: 'journey' },
        { ref: apisRef, key: 'apis' },
        { ref: projectRef, key: 'project' }
      ];

      sections.forEach(({ ref, key }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom > 0;
          setIsVisible(prev => ({ ...prev, [key]: isInView }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-smooth">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: 'url(/bulletcluster.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className={`inline-flex items-center space-x-2 bg-blue-500/20 rounded-full px-4 py-2 mb-8 transition-all duration-1000 delay-200 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-blue-400 font-medium">Space & AI Enthusiast</span>
            </div>
            
            <h1 className={`text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Asteroid Impact Predictor
            </h1>
            
            <p className={`text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-500 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              A passion project born from my fascination with space exploration and artificial intelligence, 
              powered by NASA's cutting-edge APIs to predict and visualize asteroid threats to Earth.
            </p>
            
            <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-700 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-4 py-2 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                <Rocket className="w-5 h-5 text-orange-400" />
                <span className="text-slate-300">Space Exploration</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-4 py-2 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                <Brain className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Machine Learning</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-4 py-2 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">NASA APIs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Story Section */}
      <div ref={journeyRef} className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ease-out ${
            isVisible.journey ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <h2 className="text-4xl font-bold mb-6 text-white">
              My Journey into Space & AI
            </h2>
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                From a young age, I've been captivated by the mysteries of space. The vastness of the cosmos, 
                the dance of celestial bodies, and the potential threats lurking in the darkness have always 
                fascinated me. This curiosity led me to explore astronomy, orbital mechanics, and the 
                incredible work being done by space agencies worldwide.
              </p>
              <p>
                As I delved deeper into space science, I discovered the power of artificial intelligence 
                in processing vast amounts of astronomical data. Machine learning algorithms could identify 
                patterns in asteroid trajectories, predict close approaches, and assess impact risks with 
                unprecedented accuracy.
              </p>
              <p>
                This intersection of space science and AI became my passion. I wanted to create something 
                that could make this complex data accessible to everyone, while showcasing the incredible 
                capabilities of modern space technology and machine learning.
              </p>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 ease-out delay-300 ${
            isVisible.journey ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-slate-700 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center group">
                  <Eye className="w-12 h-12 text-blue-400 mx-auto mb-3 group-hover:animate-bounce transition-all duration-300" />
                  <h3 className="font-bold text-white mb-2">Space Science</h3>
                  <p className="text-sm text-slate-400">Orbital mechanics, celestial dynamics, and astronomical observations</p>
                </div>
                <div className="text-center group">
                  <Brain className="w-12 h-12 text-green-400 mx-auto mb-3 group-hover:animate-bounce transition-all duration-300" />
                  <h3 className="font-bold text-white mb-2">AI & ML</h3>
                  <p className="text-sm text-slate-400">Machine learning models for risk prediction and data analysis</p>
                </div>
                <div className="text-center group">
                  <Database className="w-12 h-12 text-purple-400 mx-auto mb-3 group-hover:animate-bounce transition-all duration-300" />
                  <h3 className="font-bold text-white mb-2">Data Science</h3>
                  <p className="text-sm text-slate-400">Processing and visualizing complex astronomical datasets</p>
                </div>
                <div className="text-center group">
                  <Globe className="w-12 h-12 text-orange-400 mx-auto mb-3 group-hover:animate-bounce transition-all duration-300" />
                  <h3 className="font-bold text-white mb-2">Web Development</h3>
                  <p className="text-sm text-slate-400">Creating interactive experiences for space data exploration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NASA APIs Section */}
      <div ref={apisRef} className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible.apis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Powered by NASA's Advanced APIs
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              This project leverages NASA's cutting-edge APIs to access real-time asteroid data 
              and orbital mechanics calculations, bringing professional-grade space science to your browser.
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-1000 delay-300 ${
            isVisible.apis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* JPL NeoWS API */}
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Satellite className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">JPL NeoWS API</h3>
                  <p className="text-slate-400">Near Earth Object Web Service</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-300">
                <p>
                  The <strong className="text-blue-400">NASA JPL Near Earth Object Web Service</strong> provides 
                  comprehensive data about asteroids and comets that approach Earth. This API gives us access to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>Real-time asteroid orbital data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-red-400" />
                    <span>Close approach predictions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span>Impact risk assessments</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    <span>Physical and orbital characteristics</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* JPL Horizons API */}
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Cpu className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">JPL Horizons API</h3>
                  <p className="text-slate-400">Solar System Dynamics</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-300">
                <p>
                  The <strong className="text-purple-400">NASA JPL Horizons System</strong> is a powerful 
                  ephemeris computation service that provides precise positions and orbital mechanics data:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>High-precision orbital calculations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Rocket className="w-4 h-4 text-orange-400" />
                    <span>Ephemeris data for any celestial body</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span>Observational predictions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span>Historical and future trajectory data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Features Section */}
      <div ref={projectRef} className="max-w-7xl mx-auto px-6 py-20">
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible.project ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl font-bold mb-6 text-white">
            What This Project Delivers
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Combining NASA's authoritative data with modern web technologies and machine learning 
            to create an accessible platform for asteroid impact prediction and space science education.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
          isVisible.project ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105">
            <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Risk Assessment</h3>
            <p className="text-slate-400">
              Machine learning models analyze asteroid characteristics to predict impact probabilities 
              and assess threat levels with professional-grade accuracy.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105">
            <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Advanced Visualizations</h3>
            <p className="text-slate-400">
              Interactive 3D plots, animated timelines, and statistical charts powered by Plotly 
              to make complex space data intuitive and engaging.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-green-500/50 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105">
            <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4">
              <Database className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Data</h3>
            <p className="text-slate-400">
              Live integration with NASA APIs ensures you're always viewing the most current 
              asteroid data and orbital predictions available.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-orange-500/50 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-105">
            <div className="p-3 bg-orange-500/20 rounded-xl w-fit mb-4">
              <Globe className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Orbital Mechanics</h3>
            <p className="text-slate-400">
              Precise calculations of asteroid trajectories, close approaches, and orbital elements 
              using NASA's Horizons ephemeris system.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-pink-500/50 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-500 hover:scale-105">
            <div className="p-3 bg-pink-500/20 rounded-xl w-fit mb-4">
              <Brain className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Machine Learning</h3>
            <p className="text-slate-400">
              Advanced ML algorithms trained on historical asteroid data to identify patterns 
              and improve prediction accuracy over time.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105">
            <div className="p-3 bg-cyan-500/20 rounded-xl w-fit mb-4">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interactive Experience</h3>
            <p className="text-slate-400">
              Modern web interface with smooth animations, responsive design, and intuitive 
              controls for exploring space data.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div ref={featuresRef} className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className={`transition-all duration-1000 ease-out ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Explore the Cosmos?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Dive into the world of asteroid impact prediction and discover how modern technology 
              helps us understand and prepare for cosmic threats.
            </p>
          </div>
          
          <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-300 ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Link 
              to="/asteroids"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <span>Explore Asteroids</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/visualizations"
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-slate-500/30"
            >
              <span>View Visualizations</span>
              <BarChart3 className="w-5 h-5" />
            </Link>
            <Link 
              to="/guide"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/30"
            >
              <span>Learn About the Data</span>
              <BookOpen className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-6 py-3 mb-4">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Built by Aarush Singh</span>
              </div>
              <p className="text-slate-300 text-lg mb-2">
                A passion project combining space science, AI, and web development
              </p>
              <p className="text-slate-400 mb-4">
                Built with passion for space science and artificial intelligence
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Rocket className="w-4 h-4 text-orange-400" />
                <span>Space Science</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-green-400" />
                <span>Machine Learning</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>NASA APIs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Web Development</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-4">
              Powered by NASA JPL NeoWS API and NASA JPL Horizons API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
