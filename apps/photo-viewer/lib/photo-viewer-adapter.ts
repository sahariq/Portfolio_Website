/**
 * Photo Viewer Adapter
 * Bridges the VirtualFileSystem with the Photo Viewer application
 * Converts between VirtualFileSystem types and Photo Viewer types
 */

import { VirtualFileSystem } from './virtual-file-system'
import type { FileMetadata } from './file-system-types'
import type { MediaFile, MediaMetadata } from '../types'
import { generateMediaFileId, formatFileSize, formatDimensions, formatDate } from '../utils'

/**
 * Creates a singleton instance of VirtualFileSystem
 */
let fileSystemInstance: VirtualFileSystem | null = null

export function getFileSystem(): VirtualFileSystem {
  if (!fileSystemInstance) {
    fileSystemInstance = new VirtualFileSystem()
  }
  return fileSystemInstance
}

/**
 * Converts FileMetadata to MediaFile format
 * @param metadata - FileMetadata from VirtualFileSystem
 * @returns MediaFile for Photo Viewer
 */
export function convertToMediaFile(metadata: FileMetadata): MediaFile {
  const mediaTypeMap: Record<string, 'image' | 'video'> = {
    image: 'image',
    video: 'video',
  }

  const mediaType = mediaTypeMap[metadata.type] || 'image'
  const format = metadata.path.split('.').pop()?.toUpperCase() || 'UNKNOWN'

  return {
    id: generateMediaFileId(metadata.path),
    name: metadata.name,
    path: metadata.path,
    type: mediaType,
    format: format as any,
    size: metadata.size,
    dimensions: metadata.dimensions,
    lastModified: metadata.modifiedDate,
  }
}

/**
 * Converts FileMetadata to MediaMetadata format
 * @param metadata - FileMetadata from VirtualFileSystem
 * @returns MediaMetadata for Photo Viewer
 */
export function convertToMediaMetadata(metadata: FileMetadata): MediaMetadata {
  return {
    filename: metadata.name,
    fileSize: formatFileSize(metadata.size),
    dimensions: metadata.dimensions ? formatDimensions(metadata.dimensions.width, metadata.dimensions.height) : undefined,
    format: metadata.path.split('.').pop()?.toUpperCase() || 'UNKNOWN',
    lastModified: formatDate(metadata.modifiedDate),
  }
}

/**
 * Loads media files from a folder using VirtualFileSystem
 * @param folderPath - Path to the folder
 * @returns Array of MediaFile objects
 */
export async function loadMediaFilesFromFolderVFS(folderPath: string): Promise<MediaFile[]> {
  const fs = getFileSystem()

  try {
    // Navigate to the folder
    await fs.navigateTo(folderPath)

    // List files with image and video filters
    const imageFiles = await fs.listFiles(folderPath, { filter: 'images' })
    const videoFiles = await fs.listFiles(folderPath, { filter: 'videos' })

    // Combine and convert to MediaFile format
    const allFiles = [...imageFiles, ...videoFiles]
    const mediaFiles = allFiles.map(convertToMediaFile)

    // Sort by name
    return mediaFiles.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Failed to load media files from folder:', error)
    throw error
  }
}

/**
 * Gets metadata for a file using VirtualFileSystem
 * @param filePath - Path to the file
 * @returns MediaMetadata object
 */
export async function getMediaMetadataVFS(filePath: string): Promise<MediaMetadata> {
  const fs = getFileSystem()

  try {
    const metadata = await fs.getFileMetadata(filePath)
    return convertToMediaMetadata(metadata)
  } catch (error) {
    console.error('Failed to get metadata for file:', error)
    throw error
  }
}

/**
 * Gets a thumbnail for an image file using VirtualFileSystem
 * @param filePath - Path to the image file
 * @returns Thumbnail as base64 data URL
 */
export async function getThumbnailVFS(filePath: string): Promise<string> {
  const fs = getFileSystem()

  try {
    return await fs.getThumbnail(filePath)
  } catch (error) {
    console.error('Failed to get thumbnail:', error)
    throw error
  }
}

/**
 * Clears all caches in VirtualFileSystem
 */
export function clearFileSystemCache(): void {
  const fs = getFileSystem()
  fs.clearCache()
}

/**
 * Invalidates cache for a specific path
 * @param path - Path to invalidate cache for
 */
export function invalidateFileSystemCache(path: string): void {
  const fs = getFileSystem()
  fs.invalidateCache(path)
}
