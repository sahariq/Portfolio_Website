/**
 * Thumbnail Generation utilities
 * Generates and caches thumbnails for image files
 * Optimized: Progressive thumbnail generation with efficient image processing
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { detectFileType } from './file-type-detection'
import { FileSystemCache } from './file-system-cache'
import { THUMBNAIL_DIMENSIONS, DEFAULT_CACHE_TTL } from './file-system-types'
import { promises as fs } from 'fs'

// Create a singleton cache instance for thumbnails
const thumbnailCache = new FileSystemCache()

// Queue for progressive thumbnail generation
let thumbnailQueue: Array<{ filePath: string; resolve: (value: string) => void; reject: (error: Error) => void }> = []
let isProcessingQueue = false
const MAX_CONCURRENT_THUMBNAILS = 2

/**
 * Process thumbnail queue with concurrency control
 * Optimized: Limits concurrent thumbnail generation to prevent resource exhaustion
 */
async function processThumbnailQueue(): Promise<void> {
  if (isProcessingQueue || thumbnailQueue.length === 0) {
    return
  }

  isProcessingQueue = true

  while (thumbnailQueue.length > 0) {
    const batch = thumbnailQueue.splice(0, MAX_CONCURRENT_THUMBNAILS)
    const promises = batch.map(async (item) => {
      try {
        const thumbnail = await generateThumbnailInternal(item.filePath)
        item.resolve(thumbnail)
      } catch (error) {
        item.reject(error instanceof Error ? error : new Error(String(error)))
      }
    })

    await Promise.all(promises)
  }

  isProcessingQueue = false
}

/**
 * Gets a thumbnail for an image file with caching
 * Optimized: Uses queue-based progressive generation
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 *
 * @param filePath - The file path
 * @returns Promise resolving to thumbnail as base64 data URL
 * @throws Error if thumbnail cannot be generated
 */
export async function getThumbnail(filePath: string): Promise<string> {
  try {
    // Check if file is an image
    const fileType = detectFileType(filePath)
    if (fileType !== 'image') {
      throw new Error(`Cannot generate thumbnail for non-image file: ${filePath}`)
    }

    // Check cache first
    const cached = thumbnailCache.get<string>(filePath)
    if (cached) {
      return cached
    }

    // Queue for progressive generation
    return new Promise((resolve, reject) => {
      thumbnailQueue.push({ filePath, resolve, reject })
      processThumbnailQueue().catch(reject)
    })
  } catch (error) {
    throw new Error(`Failed to generate thumbnail for ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Internal function to generate thumbnail
 * Optimized: Efficient image processing with canvas optimization
 */
async function generateThumbnailInternal(filePath: string): Promise<string> {
  try {
    // Check cache again in case it was generated while waiting in queue
    const cached = thumbnailCache.get<string>(filePath)
    if (cached) {
      return cached
    }

    // Fetch the image
    const response = await fetch(filePath)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const blob = await response.blob()

    // Generate thumbnail
    const thumbnail = await generateThumbnailFromBlob(blob)

    // Cache the thumbnail with default TTL
    thumbnailCache.set(filePath, thumbnail, DEFAULT_CACHE_TTL)

    return thumbnail
  } catch (error) {
    throw new Error(`Failed to generate thumbnail for ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Generates a thumbnail for an image file
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 *
 * @param filePath - The file path
 * @returns Promise resolving to thumbnail as base64 data URL
 * @throws Error if thumbnail cannot be generated
 */
export async function generateThumbnail(filePath: string): Promise<string> {
  try {
    // Check if file is an image
    const fileType = detectFileType(filePath)
    if (fileType !== 'image') {
      throw new Error(`Cannot generate thumbnail for non-image file: ${filePath}`)
    }

    // Fetch the image
    const response = await fetch(filePath)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const blob = await response.blob()

    // Generate thumbnail
    return generateThumbnailFromBlob(blob)
  } catch (error) {
    throw new Error(`Failed to generate thumbnail for ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Generates a thumbnail from an image blob
 * Optimized: Efficient canvas rendering with quality optimization
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 *
 * @param blob - The image blob
 * @returns Promise resolving to thumbnail as base64 data URL
 */
export async function generateThumbnailFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url)
      reject(new Error('Thumbnail generation timeout'))
    }, 10000)

    img.onload = () => {
      clearTimeout(timeout)

      try {
        // Create canvas for thumbnail with optimized dimensions
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { alpha: false })

        if (!ctx) {
          throw new Error('Failed to get canvas context')
        }

        // Calculate dimensions to maintain aspect ratio
        const aspectRatio = img.width / img.height
        let thumbWidth = THUMBNAIL_DIMENSIONS.width
        let thumbHeight = THUMBNAIL_DIMENSIONS.height

        if (aspectRatio > 1) {
          // Landscape
          thumbHeight = Math.round(THUMBNAIL_DIMENSIONS.width / aspectRatio)
        } else {
          // Portrait
          thumbWidth = Math.round(THUMBNAIL_DIMENSIONS.height * aspectRatio)
        }

        canvas.width = THUMBNAIL_DIMENSIONS.width
        canvas.height = THUMBNAIL_DIMENSIONS.height

        // Fill with white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, THUMBNAIL_DIMENSIONS.width, THUMBNAIL_DIMENSIONS.height)

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Center the image
        const x = (THUMBNAIL_DIMENSIONS.width - thumbWidth) / 2
        const y = (THUMBNAIL_DIMENSIONS.height - thumbHeight) / 2

        // Draw the image
        ctx.drawImage(img, x, y, thumbWidth, thumbHeight)

        // Convert to data URL with optimized quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75)

        URL.revokeObjectURL(url)
        resolve(dataUrl)
      } catch (error) {
        URL.revokeObjectURL(url)
        reject(error)
      }
    }

    img.onerror = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for thumbnail generation'))
    }

    img.src = url
  })
}

/**
 * Generates thumbnails for multiple image files efficiently
 * Optimized: Batches thumbnail generation with concurrency control
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 *
 * @param filePaths - The file paths
 * @param concurrency - Maximum number of concurrent thumbnail generations (default: 4)
 * @returns Promise resolving to map of file paths to thumbnails
 */
export async function generateThumbnails(filePaths: string[], concurrency: number = 4): Promise<Map<string, string>> {
  const thumbnails = new Map<string, string>()
  
  // Process files in batches to avoid overwhelming the system
  for (let i = 0; i < filePaths.length; i += concurrency) {
    const batch = filePaths.slice(i, i + concurrency)
    const batchPromises = batch.map(async (filePath) => {
      try {
        const thumbnail = await generateThumbnail(filePath)
        return { filePath, thumbnail }
      } catch (error) {
        console.warn(`Failed to generate thumbnail for ${filePath}:`, error)
        return null
      }
    })

    const results = await Promise.all(batchPromises)
    
    for (const result of results) {
      if (result) {
        thumbnails.set(result.filePath, result.thumbnail)
      }
    }
  }

  return thumbnails
}
