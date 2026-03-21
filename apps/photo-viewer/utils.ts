/**
 * Utility functions for the Photo Viewer application
 * Includes file format validation and helper functions
 */

import type { MediaFile } from './types'

// Supported file formats
const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png']
const SUPPORTED_VIDEO_FORMATS = ['mp4', 'webm']
const SUPPORTED_FORMATS = [...SUPPORTED_IMAGE_FORMATS, ...SUPPORTED_VIDEO_FORMATS]

/**
 * Validates if a file format is supported by the Photo Viewer
 * Validates: Requirements 1.1, 1.2
 *
 * @param filePath - The file path to validate
 * @returns true if the file format is supported, false otherwise
 */
export function isSupportedFormat(filePath: string): boolean {
  const extension = getFileExtension(filePath).toLowerCase()
  return SUPPORTED_FORMATS.includes(extension)
}

/**
 * Gets the file extension from a file path
 *
 * @param filePath - The file path
 * @returns The file extension without the dot
 */
export function getFileExtension(filePath: string): string {
  const lastDot = filePath.lastIndexOf('.')
  if (lastDot === -1) return ''
  return filePath.substring(lastDot + 1)
}

/**
 * Determines if a file is an image based on its extension
 * Validates: Requirements 1.1
 *
 * @param filePath - The file path
 * @returns true if the file is an image format, false otherwise
 */
export function isImageFormat(filePath: string): boolean {
  const extension = getFileExtension(filePath).toLowerCase()
  return SUPPORTED_IMAGE_FORMATS.includes(extension)
}

/**
 * Determines if a file is a video based on its extension
 * Validates: Requirements 1.2
 *
 * @param filePath - The file path
 * @returns true if the file is a video format, false otherwise
 */
export function isVideoFormat(filePath: string): boolean {
  const extension = getFileExtension(filePath).toLowerCase()
  return SUPPORTED_VIDEO_FORMATS.includes(extension)
}

/**
 * Gets the media type (image or video) for a file
 *
 * @param filePath - The file path
 * @returns 'image' or 'video', or null if unsupported
 */
export function getMediaType(filePath: string): 'image' | 'video' | null {
  if (isImageFormat(filePath)) return 'image'
  if (isVideoFormat(filePath)) return 'video'
  return null
}

/**
 * Gets the normalized format string for a file
 *
 * @param filePath - The file path
 * @returns The normalized format string (jpg, png, mp4, webm)
 */
export function getNormalizedFormat(filePath: string): 'jpg' | 'png' | 'mp4' | 'webm' | null {
  const extension = getFileExtension(filePath).toLowerCase()
  
  if (extension === 'jpeg') return 'jpg'
  if (extension === 'jpg') return 'jpg'
  if (extension === 'png') return 'png'
  if (extension === 'mp4') return 'mp4'
  if (extension === 'webm') return 'webm'
  
  return null
}

/**
 * Formats file size in bytes to a human-readable string
 *
 * @param bytes - The file size in bytes
 * @returns Formatted file size string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i]
}

/**
 * Formats image dimensions to a human-readable string
 *
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns Formatted dimensions string (e.g., "1920x1080")
 */
export function formatDimensions(width: number, height: number): string {
  return `${width}x${height}`
}

/**
 * Formats a date to a human-readable string
 *
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Generates a unique ID for a media file
 *
 * @param filePath - The file path
 * @returns A unique ID string
 */
export function generateMediaFileId(filePath: string): string {
  return `${filePath}-${Date.now()}`
}

/**
 * Clamps a zoom level to the valid range [1.0, 4.0]
 * Validates: Requirements 4.2
 *
 * @param zoomLevel - The zoom level to clamp
 * @returns The clamped zoom level
 */
export function clampZoomLevel(zoomLevel: number): number {
  return Math.max(1.0, Math.min(4.0, zoomLevel))
}

/**
 * Calculates the next zoom level after a zoom in operation
 * Validates: Requirements 4.1, 9.6
 *
 * @param currentZoom - The current zoom level
 * @returns The new zoom level (increased by 10%)
 */
export function zoomIn(currentZoom: number): number {
  return clampZoomLevel(currentZoom * 1.1)
}

/**
 * Calculates the next zoom level after a zoom out operation
 * Validates: Requirements 4.1, 9.7
 *
 * @param currentZoom - The current zoom level
 * @returns The new zoom level (decreased by 10%)
 */
export function zoomOut(currentZoom: number): number {
  return clampZoomLevel(currentZoom / 1.1)
}

/**
 * Calculates the aspect ratio of an image
 *
 * @param width - Image width
 * @param height - Image height
 * @returns The aspect ratio (width / height)
 */
export function calculateAspectRatio(width: number, height: number): number {
  if (height === 0) return 1
  return width / height
}

/**
 * Calculates the fit-to-window dimensions for an image
 * Maintains aspect ratio while fitting within the window
 *
 * @param imageWidth - Original image width
 * @param imageHeight - Original image height
 * @param windowWidth - Window width
 * @param windowHeight - Window height
 * @returns Object with calculated width and height
 */
export function calculateFitToWindowDimensions(
  imageWidth: number,
  imageHeight: number,
  windowWidth: number,
  windowHeight: number
): { width: number; height: number } {
  const imageAspect = calculateAspectRatio(imageWidth, imageHeight)
  const windowAspect = calculateAspectRatio(windowWidth, windowHeight)
  
  if (imageAspect > windowAspect) {
    // Image is wider, fit to window width
    return {
      width: windowWidth,
      height: Math.round(windowWidth / imageAspect),
    }
  } else {
    // Image is taller, fit to window height
    return {
      width: Math.round(windowHeight * imageAspect),
      height: windowHeight,
    }
  }
}
