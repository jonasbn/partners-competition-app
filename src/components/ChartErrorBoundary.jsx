import React from 'react';
import { useTranslation } from 'react-i18next';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart Error:', error, errorInfo);
    
    // Log the error details for debugging
    if (typeof window !== 'undefined' && window.Logger) {
      window.Logger.error('Chart rendering error', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        chartName: this.props.chartName || 'Unknown Chart'
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">
            <h2>⚠️ Chart Error</h2>
          </div>
          <div className="card-body">
            <div className="alert alert-warning">
              <h4>Chart temporarily unavailable</h4>
              <p>
                The {this.props.chartName || 'chart'} component encountered an error and could not be displayed.
              </p>
              <details className="mt-3">
                <summary>Error Details (for debugging)</summary>
                <pre className="mt-2 text-muted small">
                  {this.state.error?.message || 'Unknown error'}
                </pre>
              </details>
              <div className="mt-3">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => this.setState({ hasError: false, error: null })}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper for functional components with translation
export const withChartErrorBoundary = (WrappedComponent, chartName) => {
  return function ChartWithErrorBoundary(props) {
    return (
      <ChartErrorBoundary chartName={chartName}>
        <WrappedComponent {...props} />
      </ChartErrorBoundary>
    );
  };
};

export default ChartErrorBoundary;