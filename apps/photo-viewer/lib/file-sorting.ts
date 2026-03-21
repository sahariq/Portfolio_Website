/**
 * File Sorting utilities
 * Provides functions to sort files by various criteria
 */

import type { FileMetadata, SortType } from './file-system-types'

/**
 * Sorts files according to the specified criteria
 * @param files - The array of files to sort
 * @param sortBy - The sort criterion: 'name', 'size', 'date', or 'type'
 * @param reverse - Whether to reverse the sort order (default: false)
 * @returns A new sorted array of files
 */
export function sortFiles(
  files: FileMetadata[],
  sortBy: SortType,
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
 * Sorts files by name
 * @param files - The array of files to sort
 * @param reverse - Whether to reverse the sort order (default: false)
 * @returns A new sorted array of files
 */
export function sortByName(files: FileMetadata[], reverse?: boolean): FileMetadata[] {
  return sortFiles(files, 'name', reverse)
}

/**
 * Sorts files by size
 * @param files - The array of files to sort
 * @param reverse - Whether to reverse the sort order (default: false)
 * @returns A new sorted array of files
 */
export function sortBySize(files: FileMetadata[], reverse?: boolean): FileMetadata[] {
  return sortFiles(files, 'size', reverse)
}

/**
 * Sorts files by date
 * @param files - The array of files to sort
 * @param reverse - Whether to reverse the sort order (default: false)
 * @returns A new sorted array of files
 */
export function sortByDate(files: FileMetadata[], reverse?: boolean): FileMetadata[] {
  return sortFiles(files, 'date', reverse)
}

/**
 * Sorts files by type
 * @param files - The array of files to sort
 * @param reverse - Whether to reverse the sort order (default: false)
 * @returns A new sorted array of files
 */
export function sortByType(files: FileMetadata[], reverse?: boolean): FileMetadata[] {
  return sortFiles(files, 'type', reverse)
}
