import * as React from 'react'
import {trackAIDevEssentials} from '@/utils/analytics/ai-dev-essentials'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface AIDevEssentialsErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{error?: Error; retry: () => void}>
}

export class AIDevEssentialsErrorBoundary extends React.Component<
  AIDevEssentialsErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: AIDevEssentialsErrorBoundaryProps) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    try {
      const log = {
        event: 'error_boundary.catch',
        component: 'AIDevEssentialsErrorBoundary',
        error_name: error.name,
        error_message: error.message,
        component_stack: errorInfo.componentStack ?? undefined,
      }
      console.error(JSON.stringify(log))
    } catch {
      // logging must never crash the error boundary
    }

    try {
      if (typeof window !== 'undefined' && (window as any).__DEBUG_LOG) {
        ;(window as any).__DEBUG_LOG.push({
          ts: Date.now(),
          event: 'error_boundary.catch',
          data: {
            component: 'AIDevEssentialsErrorBoundary',
            error_name: error.name,
            error_message: error.message,
          },
        })
      }
    } catch {
      // swallow
    }

    // Track error in analytics
    try {
      trackAIDevEssentials('page_view', {
        source: 'error_boundary',
      })
    } catch (analyticsError) {
      console.error(
        '[AI Dev Essentials] Failed to track error:',
        analyticsError,
      )
    }

    this.setState({
      error,
      errorInfo,
    })
  }

  retry = () => {
    this.setState({hasError: false, error: undefined, errorInfo: undefined})
  }

  render() {
    if (this.state.hasError) {
      const {fallback: Fallback} = this.props

      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.retry} />
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an error while loading the AI Dev Essentials
              content. This has been logged and we're looking into it.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.retry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
              <a
                href="mailto:support@egghead.io?subject=AI Dev Essentials Error"
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Contact support
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error details (development only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
