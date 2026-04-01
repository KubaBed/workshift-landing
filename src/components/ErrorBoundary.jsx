import React from 'react';

/**
 * A standard React Error Boundary to catch rendering errors in 3D/complex components
 * and prevent the entire application from crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return the provided fallback UI or nothing
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
