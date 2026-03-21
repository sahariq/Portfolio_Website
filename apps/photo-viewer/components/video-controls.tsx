"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause } from "lucide-react"

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>
  onPlayPause: () => void
  isPlaying: boolean
  onVideoEnd?: () => void
}

/**
 * VideoControls component for video playback controls
 * Displays Play/Pause button and progress bar with seeking
 * Validates: Requirements 8.2, 8.3, 8.4, 8.5, 8.6
 */
export function VideoControls({
  videoRef,
  onPlayPause,
  isPlaying,
  onVideoEnd,
}: VideoControlsProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Update current time as video plays
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [videoRef, isSeeking])

  // Update duration when metadata loads
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }, [videoRef])

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      setCurrentTime(videoRef.current.duration)
    }
    onVideoEnd?.()
  }, [videoRef, onVideoEnd])

  // Handle progress bar click for seeking
  const handleProgressBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || !videoRef.current) return

      const rect = progressBarRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * duration

      // Clamp to valid range
      const clampedTime = Math.max(0, Math.min(newTime, duration))

      videoRef.current.currentTime = clampedTime
      setCurrentTime(clampedTime)
    },
    [videoRef, duration]
  )

  // Handle progress bar drag for seeking
  const handleProgressBarMouseDown = useCallback(() => {
    setIsSeeking(true)
  }, [])

  const handleProgressBarMouseUp = useCallback(() => {
    setIsSeeking(false)
  }, [])

  const handleProgressBarMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSeeking || !progressBarRef.current || !videoRef.current) return

      const rect = progressBarRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * duration

      // Clamp to valid range
      const clampedTime = Math.max(0, Math.min(newTime, duration))

      videoRef.current.currentTime = clampedTime
      setCurrentTime(clampedTime)
    },
    [isSeeking, videoRef, duration]
  )

  // Add event listeners to video element
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleVideoEnd)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleVideoEnd)
    }
  }, [videoRef, handleTimeUpdate, handleLoadedMetadata, handleVideoEnd])

  // Format time for display (MM:SS)
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="bg-black/80 border-t border-white/10 px-4 py-3 flex flex-col gap-3">
      {/* Progress bar */}
      <div
        ref={progressBarRef}
        className="w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
        onClick={handleProgressBarClick}
        onMouseDown={handleProgressBarMouseDown}
        onMouseUp={handleProgressBarMouseUp}
        onMouseMove={handleProgressBarMouseMove}
        onMouseLeave={handleProgressBarMouseUp}
      >
        <div
          className="h-full bg-white/60 transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Play/Pause button */}
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white"
          title={isPlaying ? "Pause video" : "Play video"}
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

        {/* Time display */}
        <div className="text-xs text-white/60">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  )
}
