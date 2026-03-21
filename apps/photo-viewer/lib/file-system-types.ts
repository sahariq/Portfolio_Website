/**
 * File System Integration - Core Types
 * Defines TypeScript interfaces and constants for the virtual file system API
 */

/**
 * Metadata information about a file
 */
export interface FileMetadata {
  name: string
  path: string
  size: number
  type: 'image' | 'document' | 'video' | 'other'
  modifiedDate: Date
  dimensions?: { width: number; height: number }
}

/**
 * Sort type for file listings
 */
export type SortType = 'name' | 'size' | 'date' | 'type'

/**
 * Options for listing files
 */
export interface FileListOptions {
  filter?: 'images' | 'documents' | 'videos' | 'all'
  sort?: SortType
  reverse?: boolean
}

/**
 * Error information for file system operations
 */
export interface FileSystemError {
  code: 'NOT_FOUND' | 'PERMISSION_DENIED' | 'INVALID_PATH' | 'UNKNOWN'
  message: string
  path?: string
}

/**
 * A segment in a breadcrumb trail
 */
export interface BreadcrumbSegment {
  name: string
  path: string
}

/**
 * Cache entry with TTL support
 */
export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * File type detection constants
 */
export const FILE_TYPE_EXTENSIONS = {
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
  documents: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'],
  videos: ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv'],
} as const

/**
 * Default cache TTL in milliseconds (5 minutes)
 */
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000

/**
 * Thumbnail dimensions
 */
export const THUMBNAIL_DIMENSIONS = {
  width: 200,
  height: 200,
} as const
