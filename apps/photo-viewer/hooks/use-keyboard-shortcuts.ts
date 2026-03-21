/**
 * Hook for handling keyboard shortcuts in the Photo Viewer
 * Maps keyboard events to actions
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */

import { useEffect } from "react"

interface KeyboardShortcutHandlers {
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onSpace?: () => void
  onF?: () => void
  onEscape?: () => void
  onPlus?: () => void
  onMinus?: () => void
}

/**
 * Hook for handling keyboard shortcuts
 * Listens for keyboard events and triggers appropriate handlers
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 *
 * @param handlers - Object containing handler functions for each shortcut
 * @param enabled - Whether the shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(
  handlers: KeyboardShortcutHandlers,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          handlers.onArrowLeft?.()
          break

        case "ArrowRight":
          e.preventDefault()
          handlers.onArrowRight?.()
          break

        case " ":
          e.preventDefault()
          handlers.onSpace?.()
          break

        case "f":
        case "F":
          e.preventDefault()
          handlers.onF?.()
          break

        case "Escape":
          e.preventDefault()
          handlers.onEscape?.()
          break

        case "+":
        case "=":
          e.preventDefault()
          handlers.onPlus?.()
          break

        case "-":
        case "_":
          e.preventDefault()
          handlers.onMinus?.()
          break

        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handlers, enabled])
}
