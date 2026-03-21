/**
 * Project Adapter
 * Handles project folder detection, media file filtering, and project-specific utilities
 * Validates: Requirements 1.1, 4.1, 4.2, 6.1, 6.2, 6.3, 6.4
 */

import type { FileMetadata } from './file-system-types'
import { detectFileType } from './file-type-detection'

/**
 * Detects if a path represents a project folder
 * A project folder is a directory within /projects that contains project structure
 * Validates: Requirements 1.1, 1.2
 *
 * @param path - The path to check
 * @returns true if the path is a project folder
 */
export function isProjectFolder(path: string): boolean {
  if (!path || typeof path !== 'string') {
    return false
  }

  // Normalize path
  const normalized = normalizePath(path)

  // Check if path is within /projects
  if (!normalized.startsWith('/projects/')) {
    return false
  }

  // Extract project name (first segment after /projects)
  const segments = normalized.split('/').filter((s) => s.length > 0)

  // Must have at least 2 segments: 'projects' and 'project-name'
  if (segments.length < 2) {
    return false
  }

  // If there are more than 2 segments, it's a subfolder of a project, not the project itself
  // But we still consider it part of a project structure
  return true
}

/**
 * Gets the project root path from any path within a project
 * Validates: Requirements 1.1
 *
 * @param path - Any path within a project
 * @returns The project root path, or null if not in a project
 */
export function getProjectRootPath(path: string): string | null {
  if (!isProjectFolder(path)) {
    return null
  }

  const normalized = normalizePath(path)
  const segments = normalized.split('/').filter((s) => s.length > 0)

  // Return /projects/project-name
  if (segments.length >= 2) {
    return `/${segments[0]}/${segments[1]}`
  }

  return null
}

/**
 * Gets media files from a project folder
 * Filters files by media type (images or videos)
 * Validates: Requirements 4.1, 4.2, 4.3
 *
 * @param projectPath - The project root path
 * @param mediaType - The type of media to retrieve: 'images' or 'videos'
 * @param files - The list of files to filter
 * @returns Array of media files matching the specified type
 */
export function getProjectMediaFiles(
  projectPath: string,
  mediaType: 'images' | 'videos',
  files: FileMetadata[]
): FileMetadata[] {
  if (!isProjectFolder(projectPath)) {
    return []
  }

  // Determine the expected subfolder name
  const subfolderName = mediaType === 'images' ? 'images' : 'videos'

  // Filter files that are in the correct subfolder and have the correct type
  const expectedType = mediaType === 'images' ? 'image' : 'video'

  return files.filter((file) => {
    // Check if file is in the correct subfolder
    const pathSegments = file.path.split('/').filter((s) => s.length > 0)
    const projectSegments = projectPath.split('/').filter((s) => s.length > 0)

    // File should be in project/subfolder/filename
    if (pathSegments.length !== projectSegments.length + 2) {
      return false
    }

    // Check if the subfolder matches
    if (pathSegments[projectSegments.length] !== subfolderName) {
      return false
    }

    // Check if file type matches
    return file.type === expectedType
  })
}

/**
 * Gets the details file from a project folder
 * Validates: Requirements 3.1, 3.2
 *
 * @param projectPath - The project root path
 * @param files - The list of files to search
 * @returns The details.txt file metadata, or null if not found
 */
export function getProjectDetails(projectPath: string, files: FileMetadata[]): FileMetadata | null {
  if (!isProjectFolder(projectPath)) {
    return null
  }

  // Find details.txt in the project root
  return (
    files.find((file) => {
      // File should be directly in the project root
      const fileParent = file.path.substring(0, file.path.lastIndexOf('/'))
      const normalizedProjectPath = normalizePath(projectPath)

      return fileParent === normalizedProjectPath && file.name === 'details.txt'
    }) || null
  )
}

/**
 * Normalizes a path for project operations
 * Validates: Requirements 5.1
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
 * Checks if a path is a project media subfolder (images or videos)
 * Validates: Requirements 4.1, 4.2
 *
 * @param path - The path to check
 * @returns true if the path is a project media subfolder
 */
export function isProjectMediaSubfolder(path: string): boolean {
  if (!isProjectFolder(path)) {
    return false
  }

  const normalized = normalizePath(path)
  const segments = normalized.split('/').filter((s) => s.length > 0)

  // Must have exactly 3 segments: 'projects', 'project-name', and 'images' or 'videos'
  if (segments.length !== 3) {
    return false
  }

  const subfolder = segments[2]
  return subfolder === 'images' || subfolder === 'videos'
}

/**
 * Gets the media type from a project media subfolder path
 * Validates: Requirements 4.1, 4.2
 *
 * @param path - The path to check
 * @returns 'images', 'videos', or null if not a media subfolder
 */
export function getProjectMediaType(path: string): 'images' | 'videos' | null {
  if (!isProjectMediaSubfolder(path)) {
    return null
  }

  const normalized = normalizePath(path)
  const segments = normalized.split('/').filter((s) => s.length > 0)
  const subfolder = segments[2]

  return subfolder === 'images' ? 'images' : 'videos'
}
