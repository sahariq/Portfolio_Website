/**
 * Path Navigation utilities
 * Handles path manipulation and breadcrumb generation
 */

import type { BreadcrumbSegment } from './file-system-types'

/**
 * Generates breadcrumb segments from a path
 * @param path - The file path
 * @returns Array of breadcrumb segments
 */
export function generateBreadcrumbs(path: string): BreadcrumbSegment[] {
  const breadcrumbs: BreadcrumbSegment[] = []

  // Always include the root directory
  breadcrumbs.push({
    name: 'Home',
    path: '/',
  })

  // If current path is root, return just the root
  if (path === '/') {
    return breadcrumbs
  }

  // Split the path into segments and create breadcrumb entries
  const segments = path.split('/').filter((segment) => segment.length > 0)

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
 * Joins path segments into a single path
 * @param segments - Path segments to join
 * @returns Joined path
 */
export function joinPath(...segments: string[]): string {
  const parts = segments
    .map((s) => s.replace(/^\/+|\/+$/g, '')) // Remove leading/trailing slashes
    .filter((s) => s.length > 0)

  return '/' + parts.join('/')
}

/**
 * Gets the parent directory of a path
 * @param path - The file path
 * @returns Parent directory path
 */
export function getParentPath(path: string): string {
  const normalized = path.replace(/\/+$/, '') // Remove trailing slashes

  if (normalized === '/') {
    return '/'
  }

  const lastSlashIndex = normalized.lastIndexOf('/')
  if (lastSlashIndex === 0) {
    return '/'
  }

  return normalized.substring(0, lastSlashIndex)
}

/**
 * Gets the filename from a path
 * @param path - The file path
 * @returns Filename
 */
export function getFileName(path: string): string {
  const normalized = path.replace(/\/+$/, '') // Remove trailing slashes
  const lastSlashIndex = normalized.lastIndexOf('/')

  if (lastSlashIndex === -1) {
    return normalized
  }

  return normalized.substring(lastSlashIndex + 1)
}

/**
 * Checks if a path is absolute
 * @param path - The path to check
 * @returns true if path is absolute, false otherwise
 */
export function isAbsolutePath(path: string): boolean {
  return path.startsWith('/')
}

/**
 * Resolves a relative path against a base path
 * @param basePath - The base path
 * @param relativePath - The relative path
 * @returns Resolved absolute path
 */
export function resolvePath(basePath: string, relativePath: string): string {
  if (isAbsolutePath(relativePath)) {
    return relativePath
  }

  const baseSegments = basePath.split('/').filter((s) => s.length > 0)
  const relativeSegments = relativePath.split('/').filter((s) => s.length > 0)

  for (const segment of relativeSegments) {
    if (segment === '..') {
      baseSegments.pop()
    } else if (segment !== '.') {
      baseSegments.push(segment)
    }
  }

  return '/' + baseSegments.join('/')
}
