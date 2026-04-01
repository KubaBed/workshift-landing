import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center p-8 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm">
          Nie udało się załadować elementu interaktywnego.
        </div>
      );
    }

    return this.props.children;
  }
}
