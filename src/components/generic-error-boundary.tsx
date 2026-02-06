import * as React from 'react'

export class GenericErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true}
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    try {
      const log = {
        event: 'error_boundary.catch',
        component: 'GenericErrorBoundary',
        error_name: error.name,
        error_message: error.message,
        component_stack: info.componentStack ?? undefined,
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
            component: 'GenericErrorBoundary',
            error_name: error.name,
            error_message: error.message,
          },
        })
      }
    } catch {
      // swallow
    }
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // @ts-ignore
      return <div></div>
    }

    // @ts-ignore
    return this.props.children
  }
}
