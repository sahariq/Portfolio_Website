"use client"

import type React from "react"
import type { MediaFile, MediaMetadata } from "../types"
import { getMediaMetadata } from "../file-system-integration"
import { useState, useEffect } from "react"

interface MetadataDisplayProps {
  mediaFile: MediaFile
  zoomLevel: number
}

/**
 * MetadataDisplay component for showing file information
 * Displays filename in header and zoom level as percentage
 * Validates: Requirements 2.3, 4.5
 */
export function MetadataDisplay({
  mediaFile,
  zoomLevel,
}: MetadataDisplayProps) {
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadMetadata = async () => {
      try {
        const meta = await getMediaMetadata(mediaFile.path)
        if (isMounted) {
          setMetadata(meta)
          setIsLoading(false)
        }
      } catch (error) {
        console.error(`Failed to load metadata for ${mediaFile.name}:`, error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMetadata()

    return () => {
      isMounted = false
    }
  }, [mediaFile])

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1a1a1a]">
      {/* Filename */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white truncate" title={mediaFile.name}>
          {mediaFile.name}
        </h3>
        {metadata && !isLoading && (
          <div className="text-xs text-white/60 mt-1 space-y-1">
            {metadata.dimensions && (
              <p>{metadata.dimensions}</p>
            )}
            <p>{metadata.fileSize}</p>
          </div>
        )}
      </div>

      {/* Zoom level */}
      <div className="ml-4 text-right">
        <div className="text-sm font-medium text-white">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>
    </div>
  )
}
