/**
 * File System Integration module for the Photo Viewer application
 * Handles loading media files from folders and extracting metadata
 * Validates: Requirements 1.1, 1.2, 1.3, 10.5
 */

import type { MediaFile, MediaMetadata } from './types'
import {
  isSupportedFormat,
  getMediaType,
  getNormalizedFormat,
  formatFileSize,
  formatDimensions,
  formatDate,
  generateMediaFileId,
} from './utils'
import {
  FileNotFoundError,
  PermissionDeniedError,
  CorruptedFileError,
  FolderAccessError,
  UnsupportedFormatError,
  PhotoViewerError,
} from './errors'
import { VirtualFileSystem } from './lib/virtual-file-system'
import { isProjectMediaSubfolder, getProjectMediaType, getProjectMediaFiles } from './lib/project-adapter'
import type { FileMetadata } from './lib/file-system-types'

/**
 * Loads all supported media files from a folder
 * Scans the folder and filters for supported formats (JPG, PNG, MP4, WebM)
 * For project folders, uses Project Adapter to filter media by type
 * Validates: Requirements 1.3, 10.5, 4.1, 4.2, 4.3
 *
 * @param folderPath - The path to the folder to scan
 * @returns Promise resolving to an array of MediaFile objects
 * @throws FolderAccessError if folder cannot be accessed
 * @throws PermissionDeniedError if access is denied
 */
export async function loadMediaFilesFromFolder(folderPath: string): Promise<MediaFile[]> {
  try {
    // Normalize the folder path
    const normalizedPath = folderPath.startsWith('/') ? folderPath : `/${folderPath}`

    // Check if this is a project media subfolder
    const isProjectMedia = isProjectMediaSubfolder(normalizedPath)
    const mediaType = getProjectMediaType(normalizedPath)

    // Use VirtualFileSystem to load files
    const vfs = new VirtualFileSystem()
    let fileMetadata: FileMetadata[]

    try {
      fileMetadata = await vfs.listFiles(normalizedPath)
    } catch (error) {
      throw new FolderAccessError(normalizedPath, error instanceof Error ? error : undefined)
    }

    // Filter for supported media formats and load metadata
    const mediaFiles: MediaFile[] = []

    for (const file of fileMetadata) {
      // For project media folders, filter by media type
      if (isProjectMedia && mediaType) {
        const expectedType = mediaType === 'images' ? 'image' : 'video'
        if (file.type !== expectedType) {
          continue
        }
      }

      if (isSupportedFormat(file.path)) {
        try {
          const metadata = await getMediaMetadata(file.path)
          const fileMediaType = getMediaType(file.path)
          const format = getNormalizedFormat(file.path)

          if (fileMediaType && format) {
            // Parse dimensions from metadata if available
            let dimensions: { width: number; height: number } | undefined
            if (metadata.dimensions) {
              const [width, height] = metadata.dimensions.split('x').map(Number)
              if (!isNaN(width) && !isNaN(height)) {
                dimensions = { width, height }
              }
            }

            const mediaFile: MediaFile = {
              id: generateMediaFileId(file.path),
              name: file.name,
              path: file.path,
              type: fileMediaType,
              format: format,
              size: file.size || 0,
              dimensions,
              lastModified: file.modifiedDate || new Date(),
            }

            mediaFiles.push(mediaFile)
          }
        } catch (error) {
          // Log error but continue processing other files
          if (error instanceof PhotoViewerError) {
            console.warn(`Failed to load metadata for ${file.path}:`, error.message)
          } else {
            console.warn(`Failed to load metadata for ${file.path}:`, error)
          }
        }
      }
    }

    return mediaFiles
  } catch (error) {
    if (error instanceof PhotoViewerError) {
      throw error
    }
    console.error(`Error loading media files from folder ${folderPath}:`, error)
    throw new FolderAccessError(folderPath, error instanceof Error ? error : undefined)
  }
}

/**
 * Extracts metadata from a media file
 * Reads file information including dimensions for images
 * Validates: Requirements 1.1, 1.2
 *
 * @param filePath - The path to the media file
 * @returns Promise resolving to MediaMetadata object
 * @throws FileNotFoundError if file cannot be found
 * @throws PermissionDeniedError if access is denied
 * @throws CorruptedFileError if file is corrupted
 */
export async function getMediaMetadata(filePath: string): Promise<MediaMetadata> {
  try {
    // Fetch the file to get its metadata
    const response = await fetch(filePath)

    if (response.status === 403) {
      throw new PermissionDeniedError(filePath)
    }

    if (response.status === 404) {
      throw new FileNotFoundError(filePath)
    }

    if (!response.ok) {
      throw new CorruptedFileError(filePath, `HTTP ${response.status}`)
    }

    const blob = await response.blob()

    // Validate blob size
    if (blob.size === 0) {
      throw new CorruptedFileError(filePath, 'File is empty')
    }

    const filename = filePath.split('/').pop() || 'unknown'
    const fileSize = formatFileSize(blob.size)
    const format = getNormalizedFormat(filePath) || 'unknown'

    // Extract dimensions for images
    let dimensions: string | undefined

    if (getMediaType(filePath) === 'image') {
      try {
        const img = new Image()
        const url = URL.createObjectURL(blob)

        dimensions = await new Promise<string>((resolve) => {
          const timeout = setTimeout(() => {
            URL.revokeObjectURL(url)
            resolve(undefined as any)
          }, 5000) // 5 second timeout

          img.onload = () => {
            clearTimeout(timeout)
            resolve(formatDimensions(img.width, img.height))
            URL.revokeObjectURL(url)
          }
          img.onerror = () => {
            clearTimeout(timeout)
            URL.revokeObjectURL(url)
            throw new CorruptedFileError(filePath, 'Invalid image format')
          }
          img.src = url
        })
      } catch (error) {
        if (error instanceof CorruptedFileError) {
          throw error
        }
        console.warn(`Failed to extract image dimensions for ${filePath}:`, error)
      }
    }

    // For videos, try to extract dimensions from video element
    if (getMediaType(filePath) === 'video') {
      try {
        const video = document.createElement('video')
        const url = URL.createObjectURL(blob)

        dimensions = await new Promise<string>((resolve) => {
          const timeout = setTimeout(() => {
            URL.revokeObjectURL(url)
            resolve(undefined as any)
          }, 5000) // 5 second timeout

          video.onloadedmetadata = () => {
            clearTimeout(timeout)
            resolve(formatDimensions(video.videoWidth, video.videoHeight))
            URL.revokeObjectURL(url)
          }
          video.onerror = () => {
            clearTimeout(timeout)
            URL.revokeObjectURL(url)
            throw new CorruptedFileError(filePath, 'Invalid video format')
          }
          video.src = url
        })
      } catch (error) {
        if (error instanceof CorruptedFileError) {
          throw error
        }
        console.warn(`Failed to extract video dimensions for ${filePath}:`, error)
      }
    }

    const lastModified = formatDate(new Date())

    return {
      filename,
      fileSize,
      dimensions,
      format,
      lastModified,
    }
  } catch (error) {
    if (error instanceof PhotoViewerError) {
      throw error
    }
    console.error(`Error extracting metadata for ${filePath}:`, error)
    throw new CorruptedFileError(filePath, 'Unable to extract metadata', error instanceof Error ? error : undefined)
  }
}

/**
 * Re-exports isSupportedFormat from utils for convenience
 * Validates: Requirements 1.1, 1.2
 *
 * @param filePath - The file path to validate
 * @returns true if the file format is supported, false otherwise
 */
export { isSupportedFormat }
