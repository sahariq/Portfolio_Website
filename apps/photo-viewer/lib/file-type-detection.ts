/**
 * File Type Detection Module
 * Provides functions to detect file types by extension
 */

import { FILE_TYPE_EXTENSIONS } from './file-system-types'

/**
 * Detects the file type based on the file extension
 * @param filename - The filename or path to detect the type for
 * @returns The file type: 'image' | 'document' | 'video' | 'other'
 */
export function detectFileType(
  filename: string
): 'image' | 'document' | 'video' | 'other' {
  const extension = getFileExtension(filename)

  if (FILE_TYPE_EXTENSIONS.images.includes(extension)) {
    return 'image'
  }

  if (FILE_TYPE_EXTENSIONS.documents.includes(extension)) {
    return 'document'
  }

  if (FILE_TYPE_EXTENSIONS.videos.includes(extension)) {
    return 'video'
  }

  return 'other'
}

/**
 * Extracts the file extension from a filename
 * Handles case-insensitive extensions
 * @param filename - The filename or path to extract the extension from
 * @returns The file extension in lowercase, or empty string if no extension
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return ''
  }

  return filename.substring(lastDotIndex + 1).toLowerCase()
}

/**
 * Checks if a file is an image based on its extension
 * @param filename - The filename or path to check
 * @returns True if the file is an image, false otherwise
 */
export function isImage(filename: string): boolean {
  return detectFileType(filename) === 'image'
}

/**
 * Checks if a file is a document based on its extension
 * @param filename - The filename or path to check
 * @returns True if the file is a document, false otherwise
 */
export function isDocument(filename: string): boolean {
  return detectFileType(filename) === 'document'
}

/**
 * Checks if a file is a video based on its extension
 * @param filename - The filename or path to check
 * @returns True if the file is a video, false otherwise
 */
export function isVideo(filename: string): boolean {
  return detectFileType(filename) === 'video'
}

/**
 * Filters files by type
 * @param files - Array of FileMetadata objects to filter
 * @param filterType - The filter type: 'images', 'documents', 'videos', or 'all'
 * @returns Filtered array of files matching the specified type
 */
export function filterFiles<T extends { type: 'image' | 'document' | 'video' | 'other' }>(
  files: T[],
  filterType: 'images' | 'documents' | 'videos' | 'all'
): T[] {
  if (filterType === 'all') {
    return files
  }

  const typeMap: Record<string, 'image' | 'document' | 'video'> = {
    images: 'image',
    documents: 'document',
    videos: 'video',
  }

  const targetType = typeMap[filterType]
  return files.filter((file) => file.type === targetType)
}
