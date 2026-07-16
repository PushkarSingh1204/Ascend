// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glassmorphism p-6 rounded-2xl border border-red-500/20 bg-red-950/5 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-6">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-foreground">Component Load Interrupted</h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              We encountered a minor visual parsing issue. The rest of your dashboard is safe.
            </p>
            {this.state.error && (
              <span className="block text-[10px] font-mono text-red-400 bg-red-500/5 px-2.5 py-1 rounded border border-red-500/10 truncate max-w-xs">
                {this.state.error.message}
              </span>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-secondary border border-border hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} className="animate-spin-reverse" />
            Reload Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
