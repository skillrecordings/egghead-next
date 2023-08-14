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

  componentDidCatch(error: any, info: any) {
    console.error(error, info.componentStack)
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
