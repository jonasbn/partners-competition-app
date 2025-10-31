import React from 'react';
import { withTranslation } from 'react-i18next';
import Logger from '../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to Logtail
    Logger.error('React Error Boundary caught an error', error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'Unknown'
    });
  }

  render() {
    const { t } = this.props;
    
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">{t('errorBoundary.title')}</h4>
          <p>
            {t('errorBoundary.message')}
          </p>
          <hr />
          <p className="mb-0">
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              {t('errorBoundary.tryAgain')}
            </button>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
