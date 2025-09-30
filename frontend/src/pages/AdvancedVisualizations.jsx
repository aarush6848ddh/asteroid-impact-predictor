import React, { useState, useEffect } from 'react';
import { 
  Database, 
  BarChart3, 
  PieChart, 
  ScatterChart, 
  Activity, 
  TrendingUp, 
  Globe, 
  Zap,
  Target,
  Layers,
  Gauge,
  Radar,
  TreePine,
  Box,
  Waves
} from 'lucide-react';
import PlotlyChart from '../components/PlotlyChart';
import plotlyService from '../services/plotlyService';

const AdvancedVisualizations = () => {
  const [selectedCategory, setSelectedCategory] = useState('3D Visualizations');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visualizationCategories = [
    {
      id: '3D Visualizations',
      name: '3D Visualizations',
      icon: Globe,
      description: 'Immersive 3D asteroid data exploration'
    },
    {
      id: 'Animated Charts',
      name: 'Animated Charts',
      icon: Activity,
      description: 'Dynamic time-based visualizations'
    },
    {
      id: 'Statistical Analysis',
      name: 'Statistical Analysis',
      icon: BarChart3,
      description: 'Advanced statistical distributions'
    },
    {
      id: 'Risk Assessment',
      name: 'Risk Assessment',
      icon: Target,
      description: 'Comprehensive risk analysis tools'
    },
    {
      id: 'Multi-Dimensional',
      name: 'Multi-Dimensional',
      icon: Layers,
      description: 'Complex multi-attribute analysis'
    },
    {
      id: 'Specialized Charts',
      name: 'Specialized Charts',
      icon: Zap,
      description: 'Unique and specialized visualizations'
    }
  ];

  const visualizationsByCategory = {
    '3D Visualizations': [
      {
        id: '3d-scatter',
        name: '3D Asteroid Positions',
        description: 'Interactive 3D scatter plot showing asteroid positions in space',
        icon: ScatterChart,
        fetchFunction: plotlyService.get3DScatterPlot
      },
      {
        id: 'contour-plot',
        name: 'Density Contour Map',
        description: '3D contour plot showing asteroid density distribution',
        icon: Waves,
        fetchFunction: plotlyService.getContourPlot
      },
      {
        id: 'polar-chart',
        name: 'Polar Coordinate System',
        description: 'Circular representation of asteroid orbital data',
        icon: Radar,
        fetchFunction: plotlyService.getPolarChart
      }
    ],
    'Animated Charts': [
      {
        id: 'animated-timeline',
        name: 'Animated Timeline',
        description: 'Dynamic timeline showing asteroid movements over time',
        icon: Activity,
        fetchFunction: plotlyService.getAnimatedTimeline
      },
      {
        id: 'treemap',
        name: 'Animated Treemap',
        description: 'Size-based categorization with smooth transitions',
        icon: TreePine,
        fetchFunction: plotlyService.getTreemap
      }
    ],
    'Statistical Analysis': [
      {
        id: 'violin-plot',
        name: 'Violin Plot',
        description: 'Distribution analysis of asteroid properties',
        icon: TrendingUp,
        fetchFunction: plotlyService.getViolinPlot
      },
      {
        id: 'box-plot',
        name: 'Box Plot Analysis',
        description: 'Statistical summary of asteroid characteristics',
        icon: Box,
        fetchFunction: plotlyService.getBoxPlot
      }
    ],
    'Risk Assessment': [
      {
        id: 'risk-heatmap',
        name: 'Risk Assessment Heatmap',
        description: 'Comprehensive risk analysis heatmap',
        icon: Target,
        fetchFunction: plotlyService.getRiskHeatmap
      },
      {
        id: 'sunburst',
        name: 'Hierarchical Risk Analysis',
        description: 'Sunburst chart showing risk categorization',
        icon: PieChart,
        fetchFunction: plotlyService.getSunburstChart
      }
    ],
    'Multi-Dimensional': [
      {
        id: 'parallel-coordinates',
        name: 'Parallel Coordinates',
        description: 'Multi-dimensional asteroid data analysis',
        icon: Layers,
        fetchFunction: plotlyService.getParallelCoordinates
      },
      {
        id: 'radar-chart',
        name: 'Radar Chart',
        description: 'Multi-attribute comparison radar chart',
        icon: Radar,
        fetchFunction: plotlyService.getRadarChart
      }
    ],
    'Specialized Charts': [
      {
        id: 'sankey',
        name: 'Sankey Diagram',
        description: 'Flow diagram of asteroid data relationships',
        icon: Activity,
        fetchFunction: plotlyService.getSankeyDiagram
      }
    ]
  };

  const loadChartData = async (chartId, fetchFunction) => {
    if (chartData[chartId]) return; // Already loaded

    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchFunction();
      setChartData(prev => ({ ...prev, [chartId]: data }));
    } catch (err) {
      console.error(`Error loading ${chartId}:`, err);
      setError(`Failed to load ${chartId}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const ChartCard = ({ visualization, isActive }) => {
    const Icon = visualization.icon;
    const chartId = visualization.id;
    const data = chartData[chartId];
    
    // Find the category for this visualization
    const category = Object.entries(visualizationsByCategory).find(([_, viz]) => 
      viz.some(v => v.id === chartId)
    )?.[0];

    return (
      <div 
        className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
          isActive ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''
        }`}
        onClick={() => loadChartData(chartId, visualization.fetchFunction)}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Icon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-2xl font-bold text-white">{visualization.name}</h3>
                {showAll && category && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                    {category}
                  </span>
                )}
              </div>
              <p className="text-lg text-slate-400">{visualization.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 mb-2">Click to load</div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="h-96 bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden shadow-inner">
          {data ? (
            <PlotlyChart 
              data={data.data} 
              layout={data.layout} 
              config={data.config}
              style={{ height: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <Icon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold">Click to load visualization</p>
                <p className="text-lg mt-2 opacity-75">Interactive Plotly chart</p>
                <div className="mt-4 px-4 py-2 bg-blue-500/20 rounded-lg inline-block">
                  <span className="text-blue-400 font-medium">Click anywhere on this card</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentVisualizations = showAll 
    ? Object.values(visualizationsByCategory).flat() 
    : visualizationsByCategory[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Data Visualization Gallery</h1>
              <p className="text-slate-300 mt-2 text-lg">
                Explore asteroid data with stunning interactive visualizations powered by Plotly
              </p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Visualizations</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-white">6</p>
                </div>
                <Layers className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">3D Charts</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Animated</p>
                  <p className="text-2xl font-bold text-white">2</p>
                </div>
                <Activity className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Visualization Categories</h2>
              <div className="space-y-2">
                {visualizationCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs opacity-75">{category.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Range Selector */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Data Range</h3>
              <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
              <div className="mt-4 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Asteroids loaded:</span>
                  <span className="text-green-400 font-semibold">116</span>
                </div>
                <div className="flex justify-between">
                  <span>Data points:</span>
                  <span className="text-blue-400 font-semibold">1,392</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {showAll ? 'All Visualizations' : selectedCategory}
                </h2>
                <p className="text-slate-400">
                  {showAll ? '12' : currentVisualizations.length} visualization{showAll ? 's' : (currentVisualizations.length !== 1 ? 's' : '')} available
                </p>
              </div>
              <button
                onClick={() => setShowAll(!showAll)}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                  showAll 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {showAll ? 'Show by Category' : 'View All'}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-slate-400">Loading visualization...</span>
              </div>
            )}

            <div className={`grid gap-8 ${showAll ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
              {currentVisualizations.map((visualization) => (
                <ChartCard 
                  key={visualization.id} 
                  visualization={visualization}
                  isActive={chartData[visualization.id]}
                />
              ))}
            </div>

            {currentVisualizations.length === 0 && (
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">No visualizations available</h3>
                <p className="text-slate-500">Select a different category to view visualizations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedVisualizations;