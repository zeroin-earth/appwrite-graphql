import { Component } from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  // This lifecycle method is called if an error is thrown during rendering
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error: error }
  }

  // This lifecycle method is used for logging error information
  componentDidCatch() {
    // Example: Log the error to an error reporting service
    // logErrorToMyService(error, info.componentStack);
    console.log('Error caught by ErrorBoundary')
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}

export default ErrorBoundary
