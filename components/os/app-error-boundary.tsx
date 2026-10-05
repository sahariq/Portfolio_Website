"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  appTitle: string
  onClose: () => void
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Wraps the contents of every window. If an app throws while rendering, only that
 * window shows an error. The desktop, taskbar and other windows keep working.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.appTitle}] crashed:`, error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white/80">
        <p className="text-base font-medium">{this.props.appTitle} ran into a problem</p>
        <p className="max-w-sm break-words text-xs text-white/40">{error.message}</p>
        <div className="mt-1 flex gap-2">
          <button
            onClick={() => this.setState({ error: null })}
            className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Try again
          </button>
          <button
            onClick={this.props.onClose}
            className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    )
  }
}
