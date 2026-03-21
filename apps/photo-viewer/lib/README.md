# File System Integration Library

A comprehensive virtual file system API for your website that provides directory browsing, file filtering, metadata retrieval, caching, and thumbnail generation.

## Overview

The File System Integration module provides a unified interface for accessing files from your file system. It's designed to work seamlessly with your Photo Viewer application and can be extended to other applications.

## Features

- **Directory Browsing**: List files and subdirectories with metadata
- **File Filtering**: Filter files by type (images, documents, videos)
- **File Sorting**: Sort files by name, size, date, or type
- **Metadata Retrieval**: Get file information including dimensions for images
- **Caching**: TTL-based caching for performance optimization
- **Thumbnail Generation**: Generate and cache thumbnails for images
- **Path Navigation**: Navigate directories and generate breadcrumb trails
- **Error Handling**: Comprehensive error handling with specific error codes
- **Type Safety**: Full TypeScript support with proper type definitions

## Quick Start

### Basic Usage

```typescript
import { VirtualFileSystem } from './virtual-file-system'

// Create a file system instance
const fs = new VirtualFileSystem()

// List files in a directory
const files = await fs.listFiles('/path/to/folder', {
  filter: 'images',
  sort: 'name',
})

// Get file metadata
const metadata = await fs.getFileMetadata('/path/to/file.jpg')

// Navigate to a directory
await fs.navigateTo('/path/to/folder')

// Get current path
const currentPath = fs.getCurrentPath()

// Get breadcrumbs
const breadcrumbs = fs.getBreadcrumbs()

// Get thumbnail for an image
const thumbnail = await fs.getThumbnail('/path/to/image.jpg')
```

### Photo Viewer Integration

```typescript
import { loadMediaFilesFromFolderVFS, getThumbnailVFS } from './photo-viewer-adapter'

// Load media files using the adapter
const mediaFiles = await loadMediaFilesFromFolderVFS('/path/to/photos')

// Get thumbnail for a media file
const thumbnail = await getThumbnailVFS('/path/to/photo.jpg')
```

## API Reference

### VirtualFileSystem Class

#### Methods

##### `listFiles(path: string, options?: FileListOptions): Promise<FileMetadata[]>`

Lists files in a directory with optional filtering and sorting.

**Parameters:**
- `path` - The directory path to list
- `options` - Optional filtering and sorting options
  - `filter` - Filter by type: 'images', 'documents', 'videos', or 'all'
  - `sort` - Sort by: 'name', 'size', 'date', or 'type'
  - `reverse` - Reverse the sort order (default: false)

**Returns:** Array of FileMetadata objects

**Example:**
```typescript
const files = await fs.listFiles('/photos', {
  filter: 'images',
  sort: 'date',
  reverse: true,
})
```

##### `getFileMetadata(path: string): Promise<FileMetadata>`

Gets metadata for a specific file.

**Parameters:**
- `path` - The file path

**Returns:** FileMetadata object with name, size, type, modified date, and dimensions (for images)

**Example:**
```typescript
const metadata = await fs.getFileMetadata('/photos/vacation.jpg')
console.log(metadata.dimensions) // { width: 3840, height: 2160 }
```

##### `navigateTo(path: string): Promise<void>`

Navigates to a different directory.

**Parameters:**
- `path` - The directory path to navigate to

**Example:**
```typescript
await fs.navigateTo('/photos/2024')
```

##### `getCurrentPath(): string`

Gets the current directory path.

**Returns:** Current directory path

**Example:**
```typescript
const path = fs.getCurrentPath() // '/photos/2024'
```

##### `getBreadcrumbs(): BreadcrumbSegment[]`

Gets breadcrumb segments for the current path.

**Returns:** Array of breadcrumb segments with name and path

**Example:**
```typescript
const breadcrumbs = fs.getBreadcrumbs()
// [
//   { name: 'Home', path: '/' },
//   { name: 'photos', path: '/photos' },
//   { name: '2024', path: '/photos/2024' }
// ]
```

##### `getThumbnail(path: string): Promise<string>`

Gets a thumbnail for an image file.

**Parameters:**
- `path` - The image file path

**Returns:** Thumbnail as base64 data URL

**Example:**
```typescript
const thumbnail = await fs.getThumbnail('/photos/vacation.jpg')
// 'data:image/jpeg;base64,...'
```

##### `clearCache(): void`

Clears all caches.

**Example:**
```typescript
fs.clearCache()
```

##### `invalidateCache(path: string): void`

Invalidates cache for a specific path.

**Parameters:**
- `path` - The path to invalidate cache for

**Example:**
```typescript
fs.invalidateCache('/photos')
```

### Types

#### FileMetadata

```typescript
interface FileMetadata {
  name: string
  path: string
  size: number
  type: 'image' | 'document' | 'video' | 'other'
  modifiedDate: Date
  dimensions?: { width: number; height: number }
}
```

#### FileListOptions

```typescript
interface FileListOptions {
  filter?: 'images' | 'documents' | 'videos' | 'all'
  sort?: 'name' | 'size' | 'date' | 'type'
  reverse?: boolean
}
```

#### BreadcrumbSegment

```typescript
interface BreadcrumbSegment {
  name: string
  path: string
}
```

#### FileSystemError

```typescript
interface FileSystemError {
  code: 'NOT_FOUND' | 'PERMISSION_DENIED' | 'INVALID_PATH' | 'UNKNOWN'
  message: string
  path?: string
}
```

## Utility Functions

### File Type Detection

```typescript
import { detectFileType, isImage, isDocument, isVideo } from './file-type-detection'

// Detect file type
const type = detectFileType('photo.jpg') // 'image'

// Check file type
if (isImage('photo.jpg')) {
  console.log('This is an image')
}
```

### File Sorting

```typescript
import { sortFiles, sortByName, sortByDate } from './file-sorting'

// Sort files
const sorted = sortFiles(files, 'date', true) // Sort by date, newest first

// Or use convenience functions
const byName = sortByName(files)
const byDate = sortByDate(files, true)
```

### Path Navigation

```typescript
import { generateBreadcrumbs, joinPath, getParentPath } from './path-navigation'

// Generate breadcrumbs
const breadcrumbs = generateBreadcrumbs('/photos/2024/vacation')

// Join paths
const path = joinPath('photos', '2024', 'vacation') // '/photos/2024/vacation'

// Get parent path
const parent = getParentPath('/photos/2024') // '/photos'
```

## Caching

The File System Integration uses TTL-based caching for performance optimization:

- **File listings** are cached for 5 minutes
- **Metadata** is cached for 5 minutes
- **Thumbnails** are cached for 5 minutes

You can customize the cache TTL when setting values:

```typescript
const cache = new FileSystemCache()
cache.set('key', value, 10 * 60 * 1000) // 10 minute TTL
```

## Error Handling

All operations return descriptive errors with specific error codes:

```typescript
try {
  await fs.listFiles('/invalid/path')
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.log('Directory not found')
  } else if (error.code === 'PERMISSION_DENIED') {
    console.log('Access denied')
  }
}
```

## Performance Optimization

The module includes several performance optimizations:

1. **Caching**: File listings, metadata, and thumbnails are cached with TTL
2. **Batch Operations**: Multiple file operations are batched where possible
3. **Progressive Thumbnail Generation**: Thumbnails are generated progressively for better UX
4. **Lazy Loading**: Thumbnails are loaded on-demand

## Integration with Photo Viewer

The Photo Viewer adapter provides convenient functions for integrating with the Photo Viewer application:

```typescript
import {
  loadMediaFilesFromFolderVFS,
  getThumbnailVFS,
  clearFileSystemCache,
  invalidateFileSystemCache,
} from './photo-viewer-adapter'

// Load media files
const mediaFiles = await loadMediaFilesFromFolderVFS('/photos')

// Get thumbnail
const thumbnail = await getThumbnailVFS('/photos/vacation.jpg')

// Clear cache
clearFileSystemCache()

// Invalidate specific cache
invalidateFileSystemCache('/photos')
```

## File Type Support

### Images
- jpg, jpeg, png, gif, webp, bmp, svg

### Documents
- pdf, doc, docx, txt, xls, xlsx, ppt, pptx

### Videos
- mp4, webm, avi, mov, mkv, flv

## Browser Compatibility

The File System Integration requires:
- ES2020 or later
- Fetch API support
- Canvas API (for thumbnail generation)
- Image and Video APIs

## License

This module is part of the File System Integration specification and is provided as-is.
