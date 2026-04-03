"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

interface SettingsErrorBoundaryProps {
  children: ReactNode
}

interface SettingsErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class SettingsErrorBoundary extends Component<SettingsErrorBoundaryProps, SettingsErrorBoundaryState> {
  constructor(props: SettingsErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): SettingsErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Settings crashed:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#202020] p-6">
          <div className="max-w-md w-full bg-[#2a2a2a] border border-red-500/30 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h2 className="text-white font-medium">Settings failed to load</h2>
            </div>
            <p className="text-sm text-white/70 mb-4">
              An error occurred inside Settings. The rest of the desktop is still running.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="text-xs text-white/60 bg-black/30 rounded p-2 overflow-auto mb-4">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="px-3 py-2 rounded bg-[#0078d4] hover:bg-[#0b84e0] text-white text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
