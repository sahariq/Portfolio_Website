"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { getErrorMessage, isRecoverableError } from "../errors"

interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  isRecoverable: boolean
}

/**
 * ErrorBoundary component for catching and displaying component errors
 * Displays error messages and allows recovery for recoverable errors
 * Validates: Error Handling section
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isRecoverable: false,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      isRecoverable: isRecoverableError(error),
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      isRecoverable: false,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const errorMessage = getErrorMessage(this.state.error)

      return (
        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] p-4">
          <div className="max-w-md w-full bg-[#2a2a2a] border border-red-500/30 rounded-lg p-6">
            {/* Error icon */}
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
              <h2 className="text-lg font-semibold text-white">Error</h2>
            </div>

            {/* Error message */}
            <p className="text-sm text-white/80 mb-4">
              {errorMessage}
            </p>

            {/* Error details (in development) */}
            {process.env.NODE_ENV === "development" && (
              <details className="mb-4">
                <summary className="text-xs text-white/60 cursor-pointer hover:text-white/80">
                  Error details
                </summary>
                <pre className="mt-2 text-xs bg-black/50 p-2 rounded overflow-auto max-h-32 text-white/60">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Try Again
              </button>
              {this.state.isRecoverable && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-colors"
                >
                  Reload
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
