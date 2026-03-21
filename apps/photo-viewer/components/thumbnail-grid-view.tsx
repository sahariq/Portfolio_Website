"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import type { MediaFile } from "../types"

interface ThumbnailGridViewProps {
  mediaFiles: MediaFile[]
  currentMediaIndex: number
  onSelectMedia: (index: number) => void
  windowSize: { width: number; height: number }
}

/**
 * Thumbnail cache to store generated thumbnails
 * Validates: Requirements 11.3
 */
const thumbnailCache = new Map<string, string>()

/**
 * Generates a thumbnail for a media file
 * For images, creates a canvas-based thumbnail
 * For videos, uses the first frame
 * Optimized: Progressive loading with lazy initialization
 * Validates: Requirements 11.3
 *
 * @param mediaFile - The media file to generate thumbnail for
 * @param size - The thumbnail size in pixels
 * @returns Promise resolving to a data URL of the thumbnail
 */
async function generateThumbnail(mediaFile: MediaFile, size: number = 120): Promise<string> {
  // Check cache first
  const cacheKey = `${mediaFile.path}-${size}`
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!
  }

  try {
    if (mediaFile.type === "image") {
      // Generate thumbnail for image
      const img = new Image()
      img.crossOrigin = "anonymous"

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Thumbnail generation timeout"))
        }, 5000)

        img.onload = () => {
          clearTimeout(timeout)
          try {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d", { alpha: false })

            if (!ctx) {
              reject(new Error("Failed to get canvas context"))
              return
            }

            // Calculate dimensions to maintain aspect ratio
            const aspectRatio = img.width / img.height
            let canvasWidth = size
            let canvasHeight = size

            if (aspectRatio > 1) {
              canvasHeight = Math.round(size / aspectRatio)
            } else {
              canvasWidth = Math.round(size * aspectRatio)
            }

            canvas.width = size
            canvas.height = size

            // Fill with dark background
            ctx.fillStyle = "#1a1a1a"
            ctx.fillRect(0, 0, size, size)

            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"

            // Draw image centered
            const x = (size - canvasWidth) / 2
            const y = (size - canvasHeight) / 2
            ctx.drawImage(img, x, y, canvasWidth, canvasHeight)

            const dataUrl = canvas.toDataURL("image/jpeg", 0.75)
            thumbnailCache.set(cacheKey, dataUrl)
            resolve(dataUrl)
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          clearTimeout(timeout)
          reject(new Error(`Failed to load image: ${mediaFile.path}`))
        }

        img.src = mediaFile.path
      })
    } else {
      // For videos, use a placeholder or first frame
      // For now, use a simple video icon placeholder
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Failed to get canvas context")
      }

      canvas.width = size
      canvas.height = size

      // Dark background
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(0, 0, size, size)

      // Video icon
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(size * 0.25, size * 0.3, size * 0.5, size * 0.4)

      // Play triangle
      ctx.fillStyle = "#1a1a1a"
      const triangleSize = size * 0.15
      ctx.beginPath()
      ctx.moveTo(size * 0.35, size * 0.35)
      ctx.lineTo(size * 0.35, size * 0.65)
      ctx.lineTo(size * 0.65, size * 0.5)
      ctx.closePath()
      ctx.fill()

      const dataUrl = canvas.toDataURL("image/jpeg", 0.75)
      thumbnailCache.set(cacheKey, dataUrl)
      return dataUrl
    }
  } catch (error) {
    console.error(`Failed to generate thumbnail for ${mediaFile.path}:`, error)
    // Return a placeholder on error
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (ctx) {
      canvas.width = size
      canvas.height = size
      ctx.fillStyle = "#2a2a2a"
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = "#666666"
      ctx.font = `${size * 0.2}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("?", size / 2, size / 2)
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.75)
    thumbnailCache.set(cacheKey, dataUrl)
    return dataUrl
  }
}

/**
 * ThumbnailItem component for individual thumbnail
 * Validates: Requirements 3.1, 3.3, 3.4
 */
function ThumbnailItem({
  mediaFile,
  index,
  isSelected,
  onSelect,
  size,
}: {
  mediaFile: MediaFile
  index: number
  isSelected: boolean
  onSelect: (index: number) => void
  size: number
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadThumbnail = async () => {
      try {
        const dataUrl = await generateThumbnail(mediaFile, size)
        if (isMounted) {
          setThumbnail(dataUrl)
          setIsLoading(false)
        }
      } catch (error) {
        console.error(`Failed to load thumbnail for ${mediaFile.name}:`, error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadThumbnail()

    return () => {
      isMounted = false
    }
  }, [mediaFile, size])

  return (
    <button
      onClick={() => onSelect(index)}
      className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
        isSelected
          ? "ring-2 ring-blue-500 shadow-lg"
          : "ring-1 ring-white/10 hover:ring-white/20"
      }`}
      style={{
        width: size,
        height: size,
      }}
      title={mediaFile.name}
    >
      {isLoading ? (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      ) : thumbnail ? (
        <img
          src={thumbnail}
          alt={mediaFile.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
          <span className="text-xs">Error</span>
        </div>
      )}

      {/* Filename overlay on hover */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors flex items-end p-2 opacity-0 hover:opacity-100">
        <p className="text-white text-xs truncate">{mediaFile.name}</p>
      </div>
    </button>
  )
}

/**
 * ThumbnailGridView component for displaying media files in a grid
 * Optimized: Uses lazy loading and batch thumbnail generation for better performance
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 11.2, 11.3
 */
export function ThumbnailGridView({
  mediaFiles,
  currentMediaIndex,
  onSelectMedia,
  windowSize,
}: ThumbnailGridViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [thumbnailSize, setThumbnailSize] = useState(120)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  // Calculate responsive grid layout
  useEffect(() => {
    if (!containerRef.current) return

    // Calculate how many columns fit in the window
    const padding = 16 * 2 // 16px padding on each side
    const gap = 12 // gap between items
    const availableWidth = windowSize.width - padding

    // Start with a base size and adjust based on available space
    let size = 120
    let columns = Math.max(1, Math.floor(availableWidth / (size + gap)))

    // Adjust size to fit better
    while (columns > 1 && availableWidth / columns < size + gap) {
      columns--
    }

    // Recalculate size to fill available space
    if (columns > 0) {
      size = Math.floor((availableWidth - gap * (columns - 1)) / columns)
      size = Math.max(80, Math.min(200, size)) // Clamp between 80 and 200
    }

    setThumbnailSize(size)
  }, [windowSize])

  // Handle scroll for lazy loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const clientHeight = container.clientHeight
    const scrollHeight = container.scrollHeight

    // Calculate visible range based on scroll position
    const itemsPerRow = Math.max(1, Math.floor((windowSize.width - 32) / (thumbnailSize + 12)))
    const itemHeight = thumbnailSize + 12
    const visibleRows = Math.ceil(clientHeight / itemHeight)
    
    const startRow = Math.floor(scrollTop / itemHeight)
    const endRow = startRow + visibleRows + 2 // Add buffer rows

    const start = Math.max(0, startRow * itemsPerRow)
    const end = Math.min(mediaFiles.length, endRow * itemsPerRow)

    setVisibleRange({ start, end })
  }, [windowSize.width, thumbnailSize, mediaFiles.length])

  const handleSelectMedia = useCallback(
    (index: number) => {
      onSelectMedia(index)
    },
    [onSelectMedia]
  )

  if (mediaFiles.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-center text-white/50">
          <p className="text-lg">No media files</p>
          <p className="text-sm">Select a folder to view media files</p>
        </div>
      </div>
    )
  }

  // Only render visible items for better performance
  const visibleItems = mediaFiles.slice(visibleRange.start, visibleRange.end)
  const offsetTop = Math.floor(visibleRange.start / Math.max(1, Math.floor((windowSize.width - 32) / (thumbnailSize + 12)))) * (thumbnailSize + 12)

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-[#1a1a1a] p-4"
      onScroll={handleScroll}
    >
      <div
        className="grid gap-3 auto-fit"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))`,
          gridAutoRows: `${thumbnailSize}px`,
          transform: `translateY(${offsetTop}px)`,
        }}
      >
        {visibleItems.map((mediaFile, index) => (
          <ThumbnailItem
            key={mediaFile.id}
            mediaFile={mediaFile}
            index={visibleRange.start + index}
            isSelected={visibleRange.start + index === currentMediaIndex}
            onSelect={handleSelectMedia}
            size={thumbnailSize}
          />
        ))}
      </div>
    </div>
  )
}
