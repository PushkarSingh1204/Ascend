// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\ErrorBoundary.jsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

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
        <div className="glassmorphism p-6 rounded-2xl border border-red-500/20 bg-red-950/5 text-center flex flex-col items-center justify-center space-y-5 max-w-md mx-auto my-6">
          <div className="tv-container" aria-label="Application error">
            <div className="tv-screen !w-[240px] !h-[155px] !border-[8px]">
              <div className="static" />
              <div className="error-text !text-base">ERROR</div>
            </div>
            <div className="tv-stand !w-28 !h-2" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-foreground">Signal Interrupted</h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              We encountered a minor visual parsing issue. The rest of your dashboard is safe.
            </p>
            {this.state.error && (
              <div className="space-y-2 max-w-xs w-full">
                <span className="block text-[10px] font-mono text-red-400 bg-red-500/5 px-2.5 py-1 rounded border border-red-500/10 truncate">
                  {this.state.error.message}
                </span>
                {import.meta.env.DEV && this.state.error.stack && (
                  <details className="w-full text-left bg-black/40 border border-border p-2 rounded-xl text-[9px] font-mono text-red-400 overflow-x-auto max-h-40">
                    <summary className="cursor-pointer font-bold select-none mb-1">View Stack Trace</summary>
                    <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                  </details>
                )}
              </div>
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
