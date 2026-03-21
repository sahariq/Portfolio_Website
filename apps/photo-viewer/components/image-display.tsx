"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import type { MediaFile } from "../types"

interface ImageDisplayProps {
  mediaFile: MediaFile
  zoomLevel: number
  panOffset: { x: number; y: number }
  onZoomChange: (level: number) => void
  onPanChange: (offset: { x: number; y: number }) => void
  windowSize: { width: number; height: number }
  videoRef?: React.RefObject<HTMLVideoElement>
}

/**
 * ImageDisplay component for rendering images and videos with zoom and pan support
 * Validates: Requirements 2.1, 2.2, 2.4, 4.1, 4.3
 */
export function ImageDisplay({
  mediaFile,
  zoomLevel,
  panOffset,
  onZoomChange,
  onPanChange,
  windowSize,
  videoRef,
}: ImageDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mediaDimensions, setMediaDimensions] = useState<{ width: number; height: number } | null>(
    null
  )

  // Calculate display dimensions (fit to window or native resolution, whichever is smaller)
  const displayDimensions = useCallback(() => {
    if (!mediaDimensions) return { width: windowSize.width, height: windowSize.height }

    const { width: imgWidth, height: imgHeight } = mediaDimensions
    const { width: winWidth, height: winHeight } = windowSize

    // Calculate aspect ratio
    const imgAspect = imgWidth / imgHeight
    const winAspect = winWidth / winHeight

    // Fit to window while maintaining aspect ratio
    let displayWidth = winWidth
    let displayHeight = winHeight

    if (imgAspect > winAspect) {
      // Image is wider, fit to window width
      displayHeight = Math.round(winWidth / imgAspect)
    } else {
      // Image is taller, fit to window height
      displayWidth = Math.round(winHeight * imgAspect)
    }

    // Use native resolution if smaller than fit-to-window
    if (imgWidth < displayWidth && imgHeight < displayHeight) {
      return { width: imgWidth, height: imgHeight }
    }

    return { width: displayWidth, height: displayHeight }
  }, [mediaDimensions, windowSize])

  const currentDisplayDimensions = displayDimensions()

  // Handle media load to get dimensions
  const handleMediaLoad = useCallback(() => {
    if (mediaRef.current) {
      if (mediaRef.current instanceof HTMLImageElement) {
        setMediaDimensions({
          width: mediaRef.current.naturalWidth,
          height: mediaRef.current.naturalHeight,
        })
      } else if (mediaRef.current instanceof HTMLVideoElement) {
        setMediaDimensions({
          width: mediaRef.current.videoWidth,
          height: mediaRef.current.videoHeight,
        })
      }
    }
  }, [])

  // Calculate max pan offset to keep image within viewport
  const calculateMaxPanOffset = useCallback(() => {
    const zoomedWidth = currentDisplayDimensions.width * zoomLevel
    const zoomedHeight = currentDisplayDimensions.height * zoomLevel

    const maxPanX = Math.max(0, (zoomedWidth - windowSize.width) / 2)
    const maxPanY = Math.max(0, (zoomedHeight - windowSize.height) / 2)

    return { maxPanX, maxPanY }
  }, [currentDisplayDimensions, zoomLevel, windowSize])

  // Clamp pan offset to valid range
  const clampPanOffset = useCallback(
    (offset: { x: number; y: number }) => {
      const { maxPanX, maxPanY } = calculateMaxPanOffset()

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, offset.x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, offset.y)),
      }
    },
    [calculateMaxPanOffset]
  )

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()

      // Calculate zoom delta (positive = zoom in, negative = zoom out)
      const wheelDelta = e.deltaY > 0 ? -1 : 1
      const ZOOM_INCREMENT = 0.1

      // Calculate new zoom level
      let newZoom = zoomLevel + wheelDelta * ZOOM_INCREMENT

      // Clamp to [1.0, 4.0]
      newZoom = Math.max(1.0, Math.min(4.0, newZoom))

      // If zoom changed, update it
      if (newZoom !== zoomLevel) {
        onZoomChange(newZoom)

        // Reset pan when zooming back to 100%
        if (newZoom === 1.0) {
          onPanChange({ x: 0, y: 0 })
        }
      }
    },
    [zoomLevel, onZoomChange, onPanChange]
  )

  // Handle mouse down for pan
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only pan if zoomed in
    if (zoomLevel > 1.0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }, [zoomLevel])

  // Handle mouse move for pan
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      // Calculate new pan offset
      const newPanOffset = {
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      }

      // Clamp to valid range
      const clampedOffset = clampPanOffset(newPanOffset)

      onPanChange(clampedOffset)

      // Update drag start for next move
      setDragStart({ x: e.clientX, y: e.clientY })
    },
    [isDragging, dragStart, panOffset, clampPanOffset, onPanChange]
  )

  // Handle mouse up for pan
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel])

  // Add mouse event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      container.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseUp])

  // Calculate transform
  const transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Media container with transform */}
      <div
        style={{
          transform,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {mediaFile.type === "image" ? (
          <img
            ref={mediaRef as React.Ref<HTMLImageElement>}
            src={mediaFile.path}
            alt={mediaFile.name}
            onLoad={handleMediaLoad}
            style={{
              width: currentDisplayDimensions.width,
              height: currentDisplayDimensions.height,
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        ) : (
          <video
            ref={videoRef || mediaRef as React.Ref<HTMLVideoElement>}
            onLoadedMetadata={handleMediaLoad}
            style={{
              width: currentDisplayDimensions.width,
              height: currentDisplayDimensions.height,
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
            controls={false}
          >
            <source src={mediaFile.path} type={`video/${mediaFile.format}`} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 rounded text-white text-sm">
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  )
}
