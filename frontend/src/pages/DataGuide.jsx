import React, { useState } from 'react';
import { 
  BookOpen, 
  Globe, 
  Cpu, 
  Database, 
  Target, 
  Eye, 
  Rocket, 
  Brain, 
  BarChart3,
  Clock,
  Ruler,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Layers,
  CheckCircle,
  Sparkles,
  Shield,
  ArrowRight,
  Star,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DataGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'units', title: 'Units & Measurements', icon: Ruler },
    { id: 'apis', title: 'NASA APIs', icon: Globe },
    { id: 'ai-ml', title: 'AI/ML Backend', icon: Brain },
    { id: 'data-reading', title: 'Reading Data', icon: Eye },
    { id: 'risk-assessment', title: 'Risk Assessment', icon: AlertTriangle }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Data Guide</h1>
            </div>
            <Link 
              to="/" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-400" />
                  Navigation
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Overview Section */}
            <section id="overview" className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
                Understanding Your Asteroid Data
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                This guide will help you understand all the data, units, and measurements used in our asteroid impact prediction system. 
                By the end, you'll be able to read and interpret asteroid data like a pro!
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    What You'll Learn
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Space measurement units</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />How NASA APIs work</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />AI prediction system</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Reading orbital data</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Risk assessment scales</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    Why This Matters
                  </h3>
                  <p className="text-slate-300">
                    Understanding this data helps you make informed decisions about asteroid threats and appreciate 
                    the incredible technology behind space monitoring and prediction systems.
                  </p>
                </div>
              </div>
            </section>

            {/* Units & Measurements Section */}
            <section id="units" className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Ruler className="w-8 h-8 mr-3 text-green-400" />
                Units & Measurements Explained
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Space is vast, and so are the numbers used to describe it. Here's what every unit means and how to interpret them.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Compass className="w-6 h-6 text-blue-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Astronomical Unit (AU)</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    The average distance from Earth to the Sun. This is the standard unit for measuring distances in our solar system.
                  </p>
                  <div className="bg-slate-600/50 rounded p-3">
                    <p className="text-sm text-slate-300"><strong>1 AU = 149.6 million km</strong></p>
                    <p className="text-sm text-slate-400">= 93 million miles</p>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p><strong>Example:</strong> If an asteroid is 0.5 AU away, it's halfway between Earth and the Sun.</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Rocket className="w-6 h-6 text-orange-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Velocity (km/s)</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    The speed at which an asteroid is traveling through space, measured in kilometers per second.
                  </p>
                  <div className="bg-slate-600/50 rounded p-3">
                    <p className="text-sm text-slate-300"><strong>Typical range: 15-30 km/s</strong></p>
                    <p className="text-sm text-slate-400">Earth's orbital speed: ~30 km/s</p>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p><strong>Example:</strong> 30 km/s = 67,000 mph (very fast!)</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Star className="w-6 h-6 text-yellow-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Absolute Magnitude (H)</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    A measure of an asteroid's intrinsic brightness. Lower numbers mean brighter (and usually larger) objects.
                  </p>
                  <div className="bg-slate-600/50 rounded p-3">
                    <p className="text-sm text-slate-300"><strong>Scale: Logarithmic</strong></p>
                    <p className="text-sm text-slate-400">Sun = -26.7 magnitude</p>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p><strong>Example:</strong> H = 22 means ~100-200m diameter asteroid</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-red-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Miss Distance</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    How close an asteroid will come to Earth during its closest approach. Usually measured in kilometers or lunar distances.
                  </p>
                  <div className="bg-slate-600/50 rounded p-3">
                    <p className="text-sm text-slate-300"><strong>1 Lunar Distance = 384,400 km</strong></p>
                    <p className="text-sm text-slate-400">= Distance from Earth to Moon</p>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p><strong>Example:</strong> 0.5 LD = half the distance to the Moon (very close!)</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Ruler className="w-6 h-6 text-purple-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Diameter</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    The estimated size of the asteroid, usually given in meters or kilometers. This is crucial for impact assessment.
                  </p>
                  <div className="bg-slate-600/50 rounded p-3">
                    <p className="text-sm text-slate-300"><strong>Size Categories:</strong></p>
                    <p className="text-sm text-slate-400">Small: &lt;50m | Medium: 50m-1km | Large: &gt;1km</p>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p><strong>Example:</strong> 100m asteroid could destroy a city</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-cyan-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Orbital Period</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    How long it takes for the asteroid to complete one orbit around the Sun, measured in Earth years.
                  </p>
                  <div className="bg-slate-600/50 rounded p-3">
                    <p className="text-sm text-slate-300"><strong>Earth = 1 year</strong></p>
                    <p className="text-sm text-slate-400">Mars = 1.88 years</p>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p><strong>Example:</strong> 2.5 years = asteroid orbits Sun every 2.5 Earth years</p>
                  </div>
                </div>
              </div>
            </section>

            {/* NASA APIs Section */}
            <section id="apis" className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Globe className="w-8 h-8 mr-3 text-purple-400" />
                NASA APIs Explained
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Our system uses two powerful NASA APIs to get real-time asteroid data and precise calculations.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Database className="w-6 h-6 text-blue-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">JPL NeoWS API</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    <strong>Near-Earth Object Web Service</strong> - Provides real-time data about asteroids and comets that come close to Earth.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-600/50 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">What it provides:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Asteroid names and identification numbers</li>
                        <li>• Size estimates (diameter in meters)</li>
                        <li>• Close approach dates and times</li>
                        <li>• Miss distances (how close they get)</li>
                        <li>• Velocity data (how fast they're moving)</li>
                        <li>• Hazardous classification (yes/no)</li>
                      </ul>
                    </div>
                    <div className="bg-slate-600/50 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">Update frequency:</h4>
                      <p className="text-sm text-slate-300">Data is updated daily with new discoveries and refined calculations.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Cpu className="w-6 h-6 text-purple-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">JPL Horizons API</h3>
                  </div>
                  <p className="text-slate-300 mb-4">
                    <strong>Ephemeris System</strong> - Calculates precise positions and movements of celestial bodies. Think of it as a super-accurate space calculator.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-600/50 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">What it provides:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Precise 3D coordinates in space</li>
                        <li>• Velocity vectors (speed + direction)</li>
                        <li>• Orbital elements (eccentricity, inclination, etc.)</li>
                        <li>• Future trajectory predictions</li>
                        <li>• Historical position data</li>
                        <li>• Solar system body positions</li>
                      </ul>
                    </div>
                    <div className="bg-slate-600/50 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">Accuracy:</h4>
                      <p className="text-sm text-slate-300">Calculations are accurate to within meters over decades of prediction.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* AI/ML Backend Section */}
            <section id="ai-ml" className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Brain className="w-8 h-8 mr-3 text-orange-400" />
                AI/ML Backend - The Prediction Engine
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Our AI system analyzes asteroid data to predict impact risk using machine learning algorithms trained on historical data.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    What the AI Analyzes
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-600/50 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">Physical Characteristics:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Asteroid size and estimated mass</li>
                        <li>• Composition (rocky, metallic, icy)</li>
                        <li>• Shape and rotation rate</li>
                        <li>• Surface properties</li>
                      </ul>
                    </div>
                    <div className="bg-slate-600/50 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">Orbital Dynamics:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Orbital velocity and trajectory</li>
                        <li>• Close approach distances</li>
                        <li>• Orbital stability over time</li>
                        <li>• Gravitational perturbations</li>
                      </ul>
                    </div>
                    <div className="bg-slate-600/50 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">Historical Patterns:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Similar asteroid behaviors</li>
                        <li>• Past close approaches</li>
                        <li>• Orbital evolution trends</li>
                        <li>• Impact probability patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-orange-400" />
                    Risk Categories
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-600/20 rounded-lg border border-green-600/30">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-white">Low Risk</h4>
                        <p className="text-sm text-slate-300">Very safe, no immediate concern. Monitor casually.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-white">Medium Risk</h4>
                        <p className="text-sm text-slate-300">Monitor closely. Some uncertainty in trajectory.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-600/20 rounded-lg border border-orange-600/30">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-white">Moderate Risk</h4>
                        <p className="text-sm text-slate-300">Requires attention. Higher probability of close approach.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-600/20 rounded-lg border border-red-600/30">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-white">High Risk</h4>
                        <p className="text-sm text-slate-300">Immediate concern. Significant impact probability.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Reading Section */}
            <section id="data-reading" className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Eye className="w-8 h-8 mr-3 text-pink-400" />
                How to Read the Data
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Let's break down a real asteroid data entry so you can understand what each field means and how to interpret it.
              </p>

              <div className="bg-slate-700/50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Sample Asteroid Data Card</h3>
                <div className="bg-slate-600/50 rounded p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300"><strong>Name:</strong> 2023 DW</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300"><strong>Close Approach:</strong> March 4, 2023</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Ruler className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300"><strong>Diameter:</strong> 50 meters</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Rocket className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-300"><strong>Velocity:</strong> 25.4 km/s</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300"><strong>Magnitude:</strong> 24.2</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300"><strong>Miss Distance:</strong> 0.3 AU</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-slate-300"><strong>Hazardous:</strong> Yes</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">What This Tells Us:</h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li>• <strong>Size:</strong> 50m = small asteroid (city-block size)</li>
                    <li>• <strong>Speed:</strong> 25.4 km/s = very fast (57,000 mph)</li>
                    <li>• <strong>Distance:</strong> 0.3 AU = closer than Mars to Earth</li>
                    <li>• <strong>Brightness:</strong> H=24.2 = very dim, hard to see</li>
                    <li>• <strong>Hazardous:</strong> Yes = meets size/speed criteria</li>
                  </ul>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">Risk Assessment:</h4>
                  <div className="space-y-2 text-slate-300 text-sm">
                    <p><strong>Size Risk:</strong> Medium - could cause significant local damage</p>
                    <p><strong>Speed Risk:</strong> High - very fast approach</p>
                    <p><strong>Distance Risk:</strong> High - very close approach</p>
                    <p><strong>Detection Risk:</strong> High - small and dim, hard to track</p>
                    <p><strong>Overall:</strong> This asteroid requires close monitoring</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Assessment Section */}
            <section id="risk-assessment" className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 mr-3 text-red-400" />
                Understanding Risk Assessment
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Learn how scientists assess asteroid threats and what the different risk levels mean for you and your community.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-400" />
                    What Makes an Asteroid Dangerous?
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Size Matters Most:</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>&lt; 50m: Local damage only (city block)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>50m-1km: Regional impact (county/state)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>1-10km: Continental effects</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>&gt; 10km: Global catastrophe</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Other Risk Factors:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• <strong>Speed:</strong> Faster = more energy on impact</li>
                        <li>• <strong>Composition:</strong> Metallic = more damage</li>
                        <li>• <strong>Angle:</strong> Steep angle = more focused damage</li>
                        <li>• <strong>Location:</strong> Ocean vs land impact</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-400" />
                    The Torino Scale
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm">
                    Scientists use the Torino Scale to categorize asteroid impact hazards from 0 (no hazard) to 10 (certain collision).
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-green-600/20 rounded">
                      <div className="w-8 h-6 bg-green-500 rounded text-center text-xs font-bold text-white flex items-center justify-center">0</div>
                      <span className="text-sm text-slate-300">No hazard - normal background</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-yellow-600/20 rounded">
                      <div className="w-8 h-6 bg-yellow-500 rounded text-center text-xs font-bold text-white flex items-center justify-center">1-2</div>
                      <span className="text-sm text-slate-300">Merits attention - routine monitoring</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-orange-600/20 rounded">
                      <div className="w-8 h-6 bg-orange-500 rounded text-center text-xs font-bold text-white flex items-center justify-center">3-4</div>
                      <span className="text-sm text-slate-300">Merits concern - close monitoring</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-red-600/20 rounded">
                      <div className="w-8 h-6 bg-red-500 rounded text-center text-xs font-bold text-white flex items-center justify-center">5-6</div>
                      <span className="text-sm text-slate-300">Threatening - emergency planning</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-red-800/20 rounded">
                      <div className="w-8 h-6 bg-red-800 rounded text-center text-xs font-bold text-white flex items-center justify-center">7-10</div>
                      <span className="text-sm text-slate-300">Certain collision - evacuation</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span className="text-blue-400 font-medium text-lg">Ready to Explore?</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Start Your Asteroid Journey
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Now that you understand the data, explore our interactive visualizations and real-time asteroid tracking.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    to="/asteroids"
                    className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center space-x-2"
                  >
                    <span>Browse Asteroids</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/visualizations"
                    className="group bg-slate-800/50 hover:bg-slate-700/50 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-slate-600/50 hover:border-slate-500/50 flex items-center space-x-2"
                  >
                    <span>View Visualizations</span>
                    <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGuide;
