/**
 * File type detection constants
 * Defines file extensions for each file type category
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

export const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'bmp',
  'svg',
])

export const DOCUMENT_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'txt',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
])

export const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'avi',
  'mov',
  'mkv',
  'flv',
])

/**
 * Detects file type based on extension
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */
export function detectFileType(
  filename: string
): 'image' | 'document' | 'video' | 'other' {
  const extension = filename.split('.').pop()?.toLowerCase() || ''

  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image'
  }

  if (DOCUMENT_EXTENSIONS.has(extension)) {
    return 'document'
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return 'video'
  }

  return 'other'
}
