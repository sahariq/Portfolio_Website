/**
 * Core TypeScript interfaces for File System Integration
 * Defines data models for file metadata, filtering, navigation, and error handling
 */

/**
 * Metadata information about a file in the file system
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
export interface FileMetadata {
  name: string
  path: string
  size: number // bytes
  type: 'image' | 'document' | 'video' | 'other'
  modifiedDate: Date
  dimensions?: { width: number; height: number }
}

/**
 * Options for listing files in a directory
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5
 */
export interface FileListOptions {
  filter?: 'images' | 'documents' | 'videos' | 'all'
  sort?: 'name' | 'size' | 'date' | 'type'
  reverse?: boolean
}

/**
 * Error information for file system operations
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */
export interface FileSystemError {
  code: 'NOT_FOUND' | 'PERMISSION_DENIED' | 'INVALID_PATH' | 'UNKNOWN'
  message: string
  path?: string
}

/**
 * A segment in a breadcrumb trail representing a directory in the path
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */
export interface BreadcrumbSegment {
  name: string
  path: string
}

/**
 * Cache entry with TTL (Time-To-Live) support
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */
export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}
