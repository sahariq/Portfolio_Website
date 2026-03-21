/**
 * Virtual File System API
 * Provides a unified interface for file system operations
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */

import type { FileMetadata, FileListOptions, BreadcrumbSegment, FileSystemError } from './file-system-types'
import { FileSystemCache } from './file-system-cache'
import { listDirectory, getFileMetadata as getFileMetadataOp, normalizePath, isValidPath } from './file-system-operations'
import { sortFiles } from './file-sorting'
import { filterFiles } from './file-type-detection'
import { generateBreadcrumbs } from './path-navigation'
import { generateThumbnail } from './thumbnail-generation'

/**
 * Virtual File System API class
 * Provides methods for directory browsing, file filtering, metadata retrieval, and caching
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3, 6.4, 6.5
 */
export class VirtualFileSystem {
  private currentPath: string = '/'
  private cache: FileSystemCache = new FileSystemCache()

  /**
   * Lists files in a directory with optional filtering and sorting
   * Validates: Requirements 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5, 6.1, 6.2, 6.3, 6.4, 6.5
   *
   * @param path - The directory path to list
   * @param options - Optional filtering and sorting options
   * @returns Promise resolving to array of FileMetadata
   */
  async listFiles(path: string, options?: FileListOptions): Promise<FileMetadata[]> {
    try {
      // Validate path
      if (!isValidPath(path)) {
        throw new Error(`Invalid path: ${path}`)
      }

      const normalizedPath = normalizePath(path)

      // Check cache
      const cacheKey = `files:${normalizedPath}:${JSON.stringify(options || {})}`
      const cached = this.cache.get<FileMetadata[]>(cacheKey)
      if (cached) {
        return cached
      }

      // Read directory
      const result = await listDirectory(normalizedPath)

      // Handle error result
      if ('code' in result) {
        if (result.code === 'NOT_FOUND') {
          // Gracefully handle missing directory: return empty array
          return []
        }
        throw new Error(`${result.code}: ${result.message}`)
      }

      // Apply filter
      let filtered = result
      if (options?.filter && options.filter !== 'all') {
        filtered = filterFiles(result, options.filter)
      }

      // Apply sort
      let sorted = filtered
      if (options?.sort) {
        sorted = sortFiles(filtered, options.sort, options.reverse)
      }

      // Cache results
      this.cache.set(cacheKey, sorted)

      return sorted
    } catch (error) {
      throw new Error(`Failed to list files in ${path}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Gets metadata for a specific file
   * Validates: Requirements 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 6.3, 6.4, 6.5
   *
   * @param path - The file path
   * @returns Promise resolving to FileMetadata
   */
  async getFileMetadata(path: string): Promise<FileMetadata> {
    try {
      // Validate path
      if (!isValidPath(path)) {
        throw new Error(`Invalid path: ${path}`)
      }

      const normalizedPath = normalizePath(path)

      // Check cache
      const cacheKey = `metadata:${normalizedPath}`
      const cached = this.cache.get<FileMetadata>(cacheKey)
      if (cached) {
        return cached
      }

      // Get metadata
      const result = await getFileMetadataOp(normalizedPath)

      // Handle error result
      if ('code' in result) {
        throw new Error(`${result.code}: ${result.message}`)
      }

      // Cache result
      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      throw new Error(`Failed to get metadata for ${path}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Navigates to a different directory
   * Validates: Requirements 1.3, 5.1, 5.2, 5.3, 5.4, 5.5
   *
   * @param path - The directory path to navigate to
   */
  async navigateTo(path: string): Promise<void> {
    try {
      // Validate path
      if (!isValidPath(path)) {
        throw new Error(`Invalid path: ${path}`)
      }

      const normalizedPath = normalizePath(path)

      // Verify directory exists by trying to list it
      const result = await listDirectory(normalizedPath)

      // Handle error result
      if ('code' in result) {
        throw new Error(`${result.code}: ${result.message}`)
      }

      // Update current path
      this.currentPath = normalizedPath
    } catch (error) {
      throw new Error(`Failed to navigate to ${path}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Gets the current directory path
   * Validates: Requirements 1.4, 5.1, 5.2, 5.3, 5.4, 5.5
   *
   * @returns The current directory path
   */
  getCurrentPath(): string {
    return this.currentPath
  }

  /**
   * Gets breadcrumb segments for the current path
   * Validates: Requirements 1.4, 5.1, 5.2, 5.3, 5.4, 5.5
   *
   * @returns Array of breadcrumb segments
   */
  getBreadcrumbs(): BreadcrumbSegment[] {
    return generateBreadcrumbs(this.currentPath)
  }

  /**
   * Gets a thumbnail for an image file
   * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 6.1, 6.2, 6.3, 6.4, 6.5
   *
   * @param path - The image file path
   * @returns Promise resolving to thumbnail as base64 data URL
   */
  async getThumbnail(path: string): Promise<string> {
    try {
      // Validate path
      if (!isValidPath(path)) {
        throw new Error(`Invalid path: ${path}`)
      }

      const normalizedPath = normalizePath(path)

      // Check cache
      const cacheKey = `thumbnail:${normalizedPath}`
      const cached = this.cache.get<string>(cacheKey)
      if (cached) {
        return cached
      }

      // Generate thumbnail
      const thumbnail = await generateThumbnail(normalizedPath)

      // Cache result
      this.cache.set(cacheKey, thumbnail)

      return thumbnail
    } catch (error) {
      throw new Error(`Failed to get thumbnail for ${path}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Clears all caches
   * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Invalidates cache for a specific path
   * Validates: Requirements 6.5
   * Optimized: Uses prefix-based invalidation for efficiency
   *
   * @param path - The path to invalidate cache for
   */
  invalidateCache(path: string): void {
    const normalizedPath = normalizePath(path)

    // Invalidate all cache entries related to this path using prefix-based invalidation
    this.cache.invalidateByPrefix(`files:${normalizedPath}:`)
    this.cache.invalidateByPrefix(`metadata:${normalizedPath}`)
    this.cache.invalidateByPrefix(`thumbnail:${normalizedPath}`)

    // Also invalidate parent directory cache
    const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/'
    this.cache.invalidateByPrefix(`files:${parentPath}:`)
  }
}
