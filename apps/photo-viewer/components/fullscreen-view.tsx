"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import { X } from "lucide-react"
import type { MediaFile } from "../types"
import { ImageDisplay } from "./image-display"

interface FullScreenViewProps {
  mediaFile: MediaFile
  onExitFullScreen: () => void
  windowSize: { width: number; height: number }
  zoomLevel: number
  panOffset: { x: number; y: number }
  onZoomChange: (level: number) => void
  onPanChange: (offset: { x: number; y: number }) => void
  onNavigate: (direction: 'prev' | 'next') => void
  canNavigatePrev: boolean
  canNavigateNext: boolean
}

/**
 * FullScreenView component for displaying images/videos in full-screen mode
 * Hides window controls and UI chrome
 * Maintains zoom, pan, and navigation functionality
 * Validates: Requirements 7.1, 7.2, 7.4
 */
export function FullScreenView({
  mediaFile,
  onExitFullScreen,
  windowSize,
  zoomLevel,
  panOffset,
  onZoomChange,
  onPanChange,
  onNavigate,
  canNavigatePrev,
  canNavigateNext,
}: FullScreenViewProps) {
  // Handle Escape key to exit full-screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExitFullScreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onExitFullScreen])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Full-screen image display */}
      <div className="flex-1 overflow-hidden">
        <ImageDisplay
          mediaFile={mediaFile}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          onZoomChange={onZoomChange}
          onPanChange={onPanChange}
          windowSize={windowSize}
        />
      </div>

      {/* Minimal controls - only visible on hover */}
      <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={onExitFullScreen}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white"
          title="Exit full-screen (Esc)"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation controls - visible on hover */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={() => onNavigate('prev')}
          disabled={!canNavigatePrev}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-colors text-white"
          title="Previous image"
        >
          ← Prev
        </button>
        <button
          onClick={() => onNavigate('next')}
          disabled={!canNavigateNext}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-colors text-white"
          title="Next image"
        >
          Next →
        </button>
      </div>

      {/* Zoom level indicator - visible on hover */}
      <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity bg-black/70 px-3 py-2 rounded text-white text-sm">
        {Math.round(zoomLevel * 100)}%
      </div>

      {/* Keyboard shortcuts hint - visible on hover */}
      <div className="absolute top-4 left-4 opacity-0 hover:opacity-100 transition-opacity bg-black/70 px-3 py-2 rounded text-white text-xs space-y-1">
        <div>Esc: Exit</div>
        <div>←/→: Navigate</div>
        <div>Scroll: Zoom</div>
      </div>
    </div>
  )
}
