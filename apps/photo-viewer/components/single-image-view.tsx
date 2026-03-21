"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { MediaFile } from "../types"
import { ImageDisplay } from "./image-display"
import { VideoControls } from "./video-controls"
import { MetadataDisplay } from "./metadata-display"

interface SingleImageViewProps {
  mediaFile: MediaFile
  zoomLevel: number
  panOffset: { x: number; y: number }
  onZoomChange: (level: number) => void
  onPanChange: (offset: { x: number; y: number }) => void
  onNavigate: (direction: 'prev' | 'next') => void
  canNavigatePrev: boolean
  canNavigateNext: boolean
  windowSize: { width: number; height: number }
}

/**
 * SingleImageView component for displaying a single image with navigation
 * Shows Previous/Next buttons and metadata
 * Validates: Requirements 2.1, 2.3, 5.1, 5.2, 5.5, 5.6, 8.2, 8.3, 8.4, 8.5, 8.6
 */
export function SingleImageView({
  mediaFile,
  zoomLevel,
  panOffset,
  onZoomChange,
  onPanChange,
  onNavigate,
  canNavigatePrev,
  canNavigateNext,
  windowSize,
}: SingleImageViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const handleVideoPlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }, [isVideoPlaying])

  const handleVideoEnd = useCallback(() => {
    setIsVideoPlaying(false)
  }, [])

  return (
    <div className="flex flex-col h-full w-full bg-black">
      {/* Metadata header */}
      <MetadataDisplay mediaFile={mediaFile} zoomLevel={zoomLevel} />

      {/* Image/Video display area */}
      <div className="flex-1 overflow-hidden relative">
        <ImageDisplay
          mediaFile={mediaFile}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          onZoomChange={onZoomChange}
          onPanChange={onPanChange}
          windowSize={windowSize}
          videoRef={mediaFile.type === 'video' ? videoRef : undefined}
        />

        {/* Navigation buttons */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex gap-2">
          <button
            onClick={() => onNavigate('prev')}
            disabled={!canNavigatePrev}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-colors text-white"
            title="Previous image (Left arrow)"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
          <button
            onClick={() => onNavigate('next')}
            disabled={!canNavigateNext}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-colors text-white"
            title="Next image (Right arrow)"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Video controls for videos */}
      {mediaFile.type === 'video' && (
        <VideoControls
          videoRef={videoRef}
          onPlayPause={handleVideoPlayPause}
          isPlaying={isVideoPlaying}
          onVideoEnd={handleVideoEnd}
        />
      )}
    </div>
  )
}
