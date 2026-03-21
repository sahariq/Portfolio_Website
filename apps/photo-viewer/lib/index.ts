/**
 * File System Integration - Public API
 * Exports all public interfaces and classes for use by applications
 */

export { VirtualFileSystem } from './virtual-file-system'
export { FileSystemCache } from './file-system-cache'
export {
  listDirectory,
  getFileMetadata,
  navigateTo,
  getCurrentPath,
  getBreadcrumbs,
  sortFiles,
  filterFiles,
  normalizePath,
  isValidPath,
  createFileSystemError,
} from './file-system-operations'
export { detectFileType, getFileExtension, isImage, isDocument, isVideo } from './file-type-detection'
export { getThumbnail, generateThumbnail, generateThumbnails } from './thumbnail-generation'
export type {
  FileMetadata,
  FileListOptions,
  FileSystemError,
  BreadcrumbSegment,
  CacheEntry,
  SortType,
} from './file-system-types'
export { FILE_TYPE_EXTENSIONS, DEFAULT_CACHE_TTL, THUMBNAIL_DIMENSIONS } from './file-system-types'
