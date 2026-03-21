"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Play, Pause } from "lucide-react"
import type { MediaFile } from "../types"
import { ImageDisplay } from "./image-display"

interface SlideshowViewProps {
  mediaFile: MediaFile
  isPlaying: boolean
  onPlayPause: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  canNavigatePrev: boolean
  canNavigateNext: boolean
  windowSize: { width: number; height: number }
  zoomLevel: number
  panOffset: { x: number; y: number }
  onZoomChange: (level: number) => void
  onPanChange: (offset: { x: number; y: number }) => void
  currentIndex: number
  totalMedia: number
}

/**
 * SlideshowView component for displaying images in slideshow mode
 * Auto-advances every 3 seconds when playing
 * Validates: Requirements 6.1, 6.2, 6.5, 6.6
 */
export function SlideshowView({
  mediaFile,
  isPlaying,
  onPlayPause,
  onNavigate,
  canNavigatePrev,
  canNavigateNext,
  windowSize,
  zoomLevel,
  panOffset,
  onZoomChange,
  onPanChange,
  currentIndex,
  totalMedia,
}: SlideshowViewProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  // Auto-advance every 3 seconds when playing
  useEffect(() => {
    if (!isPlaying) {
      setElapsedTime(0)
      return
    }

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 100 // Update every 100ms for smooth progress
        if (newTime >= 3000) {
          // Advance to next image
          onNavigate('next')
          return 0
        }
        return newTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, onNavigate])

  const progressPercentage = (elapsedTime / 3000) * 100

  return (
    <div className="relative w-full h-full flex flex-col bg-black">
      {/* Image display area */}
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

      {/* Slideshow controls */}
      <div className="bg-black/80 border-t border-white/10 px-4 py-3 flex items-center justify-between">
        {/* Left side: Play/Pause button */}
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white"
          title={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <>
              <Pause size={18} />
              <span className="text-sm">Pause</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span className="text-sm">Play</span>
            </>
          )}
        </button>

        {/* Center: Progress bar and indicator */}
        <div className="flex-1 mx-6 flex flex-col gap-2">
          {/* Progress bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Slideshow indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-white/60">
            <span className={`inline-block w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-white/40'}`} />
            <span>
              {isPlaying ? 'Playing' : 'Paused'} • {currentIndex + 1} / {totalMedia}
            </span>
          </div>
        </div>

        {/* Right side: Navigation buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('prev')}
            disabled={canNavigatePrev === false}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-colors text-white text-sm"
            title="Previous image"
          >
            ← Prev
          </button>
          <button
            onClick={() => onNavigate('next')}
            disabled={canNavigateNext === false}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-colors text-white text-sm"
            title="Next image"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
