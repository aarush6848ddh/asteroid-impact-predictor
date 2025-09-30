import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class VisualizationErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Visualization Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Visualization Error
              </h3>
              <p className="text-space-300 mb-4">
                There was an error loading this visualization. This might be due to WebGL issues or data loading problems.
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex items-center space-x-2 px-4 py-2 bg-space-800 hover:bg-space-700 rounded-lg transition-colors mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default VisualizationErrorBoundary
