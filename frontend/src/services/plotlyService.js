import api from './api';

// Plotly visualization service
export const plotlyService = {
  // 3D Scatter Plot - Asteroid positions in 3D space
  async get3DScatterPlot() {
    try {
      const response = await api.get('/plotly/3d-scatter');
      return response.data;
    } catch (error) {
      console.error('Error fetching 3D scatter plot:', error);
      throw error;
    }
  },

  // Animated Timeline - Asteroid trajectories over time
  async getAnimatedTimeline() {
    try {
      const response = await api.get('/plotly/animated-timeline');
      return response.data;
    } catch (error) {
      console.error('Error fetching animated timeline:', error);
      throw error;
    }
  },

  // Heatmap - Risk assessment heatmap
  async getRiskHeatmap() {
    try {
      const response = await api.get('/plotly/risk-heatmap');
      return response.data;
    } catch (error) {
      console.error('Error fetching risk heatmap:', error);
      throw error;
    }
  },

  // Parallel Coordinates - Multi-dimensional analysis
  async getParallelCoordinates() {
    try {
      const response = await api.get('/plotly/parallel-coordinates');
      return response.data;
    } catch (error) {
      console.error('Error fetching parallel coordinates:', error);
      throw error;
    }
  },

  // Sunburst Chart - Hierarchical risk analysis
  async getSunburstChart() {
    try {
      const response = await api.get('/plotly/sunburst');
      return response.data;
    } catch (error) {
      console.error('Error fetching sunburst chart:', error);
      throw error;
    }
  },

  // Violin Plot - Distribution analysis
  async getViolinPlot() {
    try {
      const response = await api.get('/plotly/violin-plot');
      return response.data;
    } catch (error) {
      console.error('Error fetching violin plot:', error);
      throw error;
    }
  },

  // Radar Chart - Multi-attribute comparison
  async getRadarChart() {
    try {
      const response = await api.get('/plotly/radar-chart');
      return response.data;
    } catch (error) {
      console.error('Error fetching radar chart:', error);
      throw error;
    }
  },

  // Sankey Diagram - Flow of asteroid data
  async getSankeyDiagram() {
    try {
      const response = await api.get('/plotly/sankey');
      return response.data;
    } catch (error) {
      console.error('Error fetching sankey diagram:', error);
      throw error;
    }
  },

  // Treemap - Size-based asteroid categorization
  async getTreemap() {
    try {
      const response = await api.get('/plotly/treemap');
      return response.data;
    } catch (error) {
      console.error('Error fetching treemap:', error);
      throw error;
    }
  },

  // Box Plot - Statistical analysis
  async getBoxPlot() {
    try {
      const response = await api.get('/plotly/box-plot');
      return response.data;
    } catch (error) {
      console.error('Error fetching box plot:', error);
      throw error;
    }
  },

  // Contour Plot - Density visualization
  async getContourPlot() {
    try {
      const response = await api.get('/plotly/contour-plot');
      return response.data;
    } catch (error) {
      console.error('Error fetching contour plot:', error);
      throw error;
    }
  },

  // Polar Chart - Circular data representation
  async getPolarChart() {
    try {
      const response = await api.get('/plotly/polar-chart');
      return response.data;
    } catch (error) {
      console.error('Error fetching polar chart:', error);
      throw error;
    }
  }
};

export default plotlyService;
