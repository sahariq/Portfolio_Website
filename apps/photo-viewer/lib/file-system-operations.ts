/**
 * File System Operations
 * Handles reading directory contents and file metadata
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import type { FileMetadata, BreadcrumbSegment, FileSystemError } from './file-system-types'
import { detectFileType } from './file-type-detection'


/**
 * Module-level variable to track the current directory
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */
let currentPath: string = '/'

/**
 * Creates a FileSystemError object with the specified code, message, and optional path
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 *
 * @param code - The error code: 'NOT_FOUND', 'PERMISSION_DENIED', 'INVALID_PATH', or 'UNKNOWN'
 * @param message - A descriptive error message
 * @param path - Optional path associated with the error
 * @returns A FileSystemError object
 */
export function createFileSystemError(
  code: 'NOT_FOUND' | 'PERMISSION_DENIED' | 'INVALID_PATH' | 'UNKNOWN',
  message: string,
  path?: string
): FileSystemError {
	return {
		code,
		message,
		path,
	};
}


/**
 * Reads directory contents from the file system
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
 *
 * @param dirPath - The directory path to read
 * @returns Promise resolving to an array of file paths or a FileSystemError
 */
export async function readDirectory(dirPath: string): Promise<string[] | FileSystemError> {
  try {
    // Validate the path
    if (!isValidPath(dirPath)) {
      return createFileSystemError('INVALID_PATH', `Invalid path format: ${dirPath}`, dirPath)
    }

    // Normalize the path
    const normalizedPath = normalizePath(dirPath)

    // Fetch directory contents from API
    const response = await fetch(`/api/files${normalizedPath}`)

    if (response.status === 404) {
      return createFileSystemError('NOT_FOUND', `Directory not found: ${dirPath}`, dirPath)
    }

    if (response.status === 403) {
      return createFileSystemError('PERMISSION_DENIED', `Permission denied: ${dirPath}`, dirPath)
    }

    if (!response.ok) {
      return createFileSystemError('UNKNOWN', `Failed to read directory: ${response.statusText}`, dirPath)
    }

    const files = await response.json()

    // Extract file paths
    return files.map((file: any) => file.path || file.name)
  } catch (error) {
    return createFileSystemError(
      'UNKNOWN',
      `Failed to read directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`,
      dirPath
    )
  }
}

/**
 * Lists directory contents with file metadata
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
 * Optimized: Batches file stat operations for better performance
 *
 * @param dirPath - The directory path to list
 * @returns Promise resolving to an array of FileMetadata objects or a FileSystemError
 */
export async function listDirectory(dirPath: string): Promise<FileMetadata[] | FileSystemError> {
  try {
    if (!isValidPath(dirPath)) {
      return createFileSystemError('INVALID_PATH', `Invalid path format: ${dirPath}`, dirPath);
    }
    const normalizedPath = normalizePath(dirPath);
    const response = await fetch(`/api/files?path=${encodeURIComponent(normalizedPath)}`);
    if (response.status === 404) {
      return createFileSystemError('NOT_FOUND', `Directory not found: ${dirPath}`, dirPath);
    }
    if (response.status === 403) {
      return createFileSystemError('PERMISSION_DENIED', `Permission denied: ${dirPath}`, dirPath);
    }
    if (!response.ok) {
      return createFileSystemError('UNKNOWN', `Failed to list directory: ${response.statusText}`, dirPath);
    }
    const files = await response.json();
    return files;
  } catch (error) {
    return createFileSystemError(
      'UNKNOWN',
      `Failed to list directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`,
      dirPath
    );
  }
}

/**
 * Gets file metadata including size, type, and modified date
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 *
 * @param filePath - The file path
 * @returns Promise resolving to FileMetadata or a FileSystemError
 */
export async function getFileMetadata(filePath: string): Promise<FileMetadata | FileSystemError> {
  try {
    if (!isValidPath(filePath)) {
      return createFileSystemError('INVALID_PATH', `Invalid path format: ${filePath}`, filePath);
    }
    const response = await fetch(`/api/files?path=${encodeURIComponent(filePath)}`);
    if (response.status === 404) {
      return createFileSystemError('NOT_FOUND', `File not found: ${filePath}`, filePath);
    }
    if (response.status === 403) {
      return createFileSystemError('PERMISSION_DENIED', `Permission denied: ${filePath}`, filePath);
    }
    if (!response.ok) {
      return createFileSystemError('UNKNOWN', `Failed to get metadata: ${response.statusText}`, filePath);
    }
    const files = await response.json();
    if (Array.isArray(files)) {
      const file = files.find((f: any) => f.path === filePath || f.name === filePath);
      if (!file) {
        return createFileSystemError('NOT_FOUND', `File not found: ${filePath}`, filePath);
      }
      return file;
    }
    return files;
  } catch (error) {
    return createFileSystemError(
      'UNKNOWN',
      `Failed to get metadata for ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      filePath
    );
  }
}

/**
 * Reads image dimensions from a file
 * Validates: Requirements 4.5
 *
 * @param filePath - The file path
 * @returns Promise resolving to dimensions or undefined
 */

/**
 * Normalizes a file path
 * Validates: Requirements 1.5, 7.1, 7.2, 7.3, 7.4, 7.5
 *
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function normalizePath(path: string): string {
  // Remove trailing slashes
  let normalized = path.replace(/\/+$/, '')

  // Ensure path starts with /
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized
  }

  // Replace multiple slashes with single slash
  normalized = normalized.replace(/\/+/g, '/')

  return normalized
}

/**
 * Validates a file path
 * Validates: Requirements 1.5, 7.1, 7.2, 7.3, 7.4, 7.5
 *
 * @param path - The path to validate
 * @returns true if the path is valid
 */
export function isValidPath(path: string): boolean {
  if (!path || typeof path !== 'string') {
    return false
  }

  // Check for invalid characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/
  if (invalidChars.test(path)) {
    return false
  }

  return true
}


/**
 * Sorts files according to the specified criteria
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5
 *
 * @param files - The array of files to sort
 * @param sortBy - The sort criterion: 'name', 'size', 'date', or 'type'
 * @param reverse - Whether to reverse the sort order (default: false)
 * @returns A new sorted array of files
 */
export function sortFiles(
  files: FileMetadata[],
  sortBy: 'name' | 'size' | 'date' | 'type',
  reverse?: boolean
): FileMetadata[] {
  // Create a copy to avoid mutating the original array
  const sorted = [...files]

  switch (sortBy) {
    case 'name':
      // Sort alphabetically by name
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break

    case 'size':
      // Sort by size in ascending order (smallest first)
      sorted.sort((a, b) => a.size - b.size)
      break

    case 'date':
      // Sort by date in descending order (newest first)
      sorted.sort((a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime())
      break

    case 'type':
      // Sort by type, grouping files by type
      // Order: images, documents, videos, other
      const typeOrder = { image: 0, document: 1, video: 2, other: 3 }
      sorted.sort((a, b) => {
        const typeA = typeOrder[a.type as keyof typeof typeOrder]
        const typeB = typeOrder[b.type as keyof typeof typeOrder]

        // If types are different, sort by type order
        if (typeA !== typeB) {
          return typeA - typeB
        }

        // If types are the same, sort by name within the type
        return a.name.localeCompare(b.name)
      })
      break
  }

  // Apply reverse if requested
  if (reverse) {
    sorted.reverse()
  }

  return sorted
}


/**
 * Changes the current directory to the specified path
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 *
 * @param path - The path to navigate to
 * @returns Promise resolving to void or a FileSystemError
 */
export async function navigateTo(path: string): Promise<void | FileSystemError> {
  try {
    // Validate the path
    if (!isValidPath(path)) {
      return createFileSystemError('INVALID_PATH', `Invalid path format: ${path}`, path)
    }

    // Normalize the path
    const normalizedPath = normalizePath(path)

    // Check if the path exists and is a directory
    const stats = await fs.stat(normalizedPath)

    if (!stats.isDirectory()) {
      return createFileSystemError('INVALID_PATH', `Path is not a directory: ${normalizedPath}`, normalizedPath)
    }

    // Update the current path only after successful validation
    currentPath = normalizedPath
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') {
      return createFileSystemError('NOT_FOUND', `Directory not found: ${path}`, path)
    }
    if (err.code === 'EACCES') {
      return createFileSystemError('PERMISSION_DENIED', `Permission denied: ${path}`, path)
    }
    return createFileSystemError(
      'UNKNOWN',
      `Failed to navigate to ${path}: ${error instanceof Error ? error.message : String(error)}`,
      path
    )
  }
}

/**
 * Gets the current directory path
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 *
 * @returns The current directory path
 */
export function getCurrentPath(): string {
  return currentPath
}

/**
 * Generates a breadcrumb trail from the current path
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 *
 * @returns An array of breadcrumb segments representing the path hierarchy
 */
export function getBreadcrumbs(): BreadcrumbSegment[] {
  const breadcrumbs: BreadcrumbSegment[] = []

  // Always include the root directory
  breadcrumbs.push({
    name: 'Home',
    path: '/',
  })

  // If current path is root, return just the root
  if (currentPath === '/') {
    return breadcrumbs
  }

  // Split the path into segments and create breadcrumb entries
  const segments = currentPath.split('/').filter((segment) => segment.length > 0)

  let accumulatedPath = ''
  for (const segment of segments) {
    accumulatedPath += '/' + segment
    breadcrumbs.push({
      name: segment,
      path: accumulatedPath,
    })
  }

  return breadcrumbs
}

/**
 * Filters files by type
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 *
 * @param files - The array of files to filter
 * @param filterType - The filter type: 'images', 'documents', 'videos', or 'all'
 * @returns A new array containing only files matching the specified filter
 */
export function filterFiles(
  files: FileMetadata[],
  filterType: 'images' | 'documents' | 'videos' | 'all'
): FileMetadata[] {
  // If filter is 'all', return all files
  if (filterType === 'all') {
    return files
  }

  // Map filter type to file type
  const typeMap: Record<string, 'image' | 'document' | 'video'> = {
    images: 'image',
    documents: 'document',
    videos: 'video',
  }

  const targetType = typeMap[filterType]

  // Filter files by type
  return files.filter((file) => file.type === targetType)
}
