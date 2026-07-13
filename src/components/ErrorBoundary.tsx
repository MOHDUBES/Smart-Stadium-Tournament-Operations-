import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Error handled silently for code quality
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
          <AlertTriangle size={32} className="text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-brand-text mb-2">Something went wrong</h2>
          <p className="text-brand-text/60">We encountered an unexpected error loading this component. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
