# File System Integration - Website Integration Guide

This guide explains how to integrate the File System Integration module into your website.

## What Was Implemented

The File System Integration module provides a complete virtual file system API with:

- **Directory browsing** - List files and subdirectories
- **File filtering** - Filter by type (images, documents, videos)
- **File sorting** - Sort by name, size, date, or type
- **Metadata retrieval** - Get file information including image dimensions
- **Caching** - TTL-based caching for performance
- **Thumbnail generation** - Generate and cache image thumbnails
- **Path navigation** - Navigate directories and breadcrumbs
- **Error handling** - Comprehensive error handling

## File Structure

```
apps/photo-viewer/lib/
├── file-system-types.ts          # Core type definitions
├── file-system-cache.ts          # TTL-based cache implementation
├── file-type-detection.ts        # File type detection utilities
├── file-system-operations.ts     # Core file system operations
├── file-sorting.ts               # File sorting utilities
├── path-navigation.ts            # Path navigation utilities
├── thumbnail-generation.ts       # Thumbnail generation
├── virtual-file-system.ts        # Main VirtualFileSystem API class
├── photo-viewer-adapter.ts       # Photo Viewer integration adapter
├── index.ts                      # Public API exports
└── README.md                     # Detailed API documentation
```

## Quick Integration

### 1. Import the VirtualFileSystem

```typescript
import { VirtualFileSystem } from '@/apps/photo-viewer/lib'

// Create an instance
const fileSystem = new VirtualFileSystem()
```

### 2. List Files

```typescript
// List all files in a directory
const files = await fileSystem.listFiles('/photos')

// List only images, sorted by date
const images = await fileSystem.listFiles('/photos', {
  filter: 'images',
  sort: 'date',
  reverse: true,
})
```

### 3. Get File Metadata

```typescript
const metadata = await fileSystem.getFileMetadata('/photos/vacation.jpg')
console.log(metadata)
// {
//   name: 'vacation.jpg',
//   path: '/photos/vacation.jpg',
//   size: 2457600,
//   type: 'image',
//   modifiedDate: Date,
//   dimensions: { width: 3840, height: 2160 }
// }
```

### 4. Navigate Directories

```typescript
// Navigate to a directory
await fileSystem.navigateTo('/photos/2024')

// Get current path
const currentPath = fileSystem.getCurrentPath() // '/photos/2024'

// Get breadcrumbs
const breadcrumbs = fileSystem.getBreadcrumbs()
// [
//   { name: 'Home', path: '/' },
//   { name: 'photos', path: '/photos' },
//   { name: '2024', path: '/photos/2024' }
// ]
```

### 5. Generate Thumbnails

```typescript
// Get thumbnail for an image
const thumbnail = await fileSystem.getThumbnail('/photos/vacation.jpg')
// Returns base64 data URL: 'data:image/jpeg;base64,...'

// Use in an image element
<img src={thumbnail} alt="Thumbnail" />
```

### 6. Manage Cache

```typescript
// Clear all caches
fileSystem.clearCache()

// Invalidate cache for a specific path
fileSystem.invalidateCache('/photos')
```

## Photo Viewer Integration

The Photo Viewer adapter provides convenient functions for the Photo Viewer app:

```typescript
import {
  loadMediaFilesFromFolderVFS,
  getThumbnailVFS,
  clearFileSystemCache,
} from '@/apps/photo-viewer/lib/photo-viewer-adapter'

// Load media files
const mediaFiles = await loadMediaFilesFromFolderVFS('/photos')

// Get thumbnail
const thumbnail = await getThumbnailVFS('/photos/vacation.jpg')

// Clear cache
clearFileSystemCache()
```

## Using with React Components

### Example: File Browser Component

```typescript
'use client'

import { useState, useEffect } from 'react'
import { VirtualFileSystem } from '@/apps/photo-viewer/lib'
import type { FileMetadata } from '@/apps/photo-viewer/lib'

export function FileBrowser() {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileSystem = new VirtualFileSystem()

  useEffect(() => {
    loadFiles()
  }, [currentPath])

  const loadFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const fileList = await fileSystem.listFiles(currentPath, {
        sort: 'name',
      })
      setFiles(fileList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = async (path: string) => {
    try {
      await fileSystem.navigateTo(path)
      setCurrentPath(path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to navigate')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>File Browser</h2>
      <p>Current: {currentPath}</p>

      <div>
        {files.map((file) => (
          <div key={file.path}>
            <span>{file.name}</span>
            <span>{file.size} bytes</span>
            <span>{file.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Example: Image Gallery Component

```typescript
'use client'

import { useState, useEffect } from 'react'
import { VirtualFileSystem } from '@/apps/photo-viewer/lib'
import type { FileMetadata } from '@/apps/photo-viewer/lib'

export function ImageGallery() {
  const [images, setImages] = useState<FileMetadata[]>([])
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})

  const fileSystem = new VirtualFileSystem()

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const imageList = await fileSystem.listFiles('/photos', {
        filter: 'images',
        sort: 'date',
        reverse: true,
      })
      setImages(imageList)

      // Generate thumbnails
      const thumbs: Record<string, string> = {}
      for (const image of imageList) {
        thumbs[image.path] = await fileSystem.getThumbnail(image.path)
      }
      setThumbnails(thumbs)
    } catch (err) {
      console.error('Failed to load images:', err)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.path}>
          <img
            src={thumbnails[image.path]}
            alt={image.name}
            className="w-full h-auto rounded"
          />
          <p className="text-sm mt-2">{image.name}</p>
        </div>
      ))}
    </div>
  )
}
```

## API Endpoints Required

The File System Integration expects the following API endpoint to be available:

### GET `/api/files[path]`

Returns a list of files in the specified directory.

**Parameters:**
- `path` - The directory path (e.g., `/api/files/photos`)

**Response:**
```json
[
  {
    "name": "vacation.jpg",
    "path": "/photos/vacation.jpg",
    "size": 2457600,
    "type": "image",
    "modifiedDate": "2024-01-15T10:30:00Z"
  }
]
```

## Performance Considerations

1. **Caching**: File listings are cached for 5 minutes by default
2. **Batch Operations**: Multiple file operations are batched for efficiency
3. **Lazy Loading**: Thumbnails are generated on-demand
4. **Progressive Loading**: Thumbnails can be loaded progressively

## Error Handling

All operations throw errors with specific codes:

```typescript
try {
  await fileSystem.listFiles('/invalid/path')
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.log('Directory not found')
  } else if (error.code === 'PERMISSION_DENIED') {
    console.log('Access denied')
  } else if (error.code === 'INVALID_PATH') {
    console.log('Invalid path format')
  }
}
```

## Supported File Types

### Images
- jpg, jpeg, png, gif, webp, bmp, svg

### Documents
- pdf, doc, docx, txt, xls, xlsx, ppt, pptx

### Videos
- mp4, webm, avi, mov, mkv, flv

## Next Steps

1. **Set up API endpoint** - Implement `/api/files[path]` endpoint
2. **Test with Photo Viewer** - The Photo Viewer app is already integrated
3. **Create custom components** - Use the examples above to create your own
4. **Optimize for your use case** - Adjust cache TTL and batch sizes as needed

## Documentation

For detailed API documentation, see `apps/photo-viewer/lib/README.md`

## Support

For issues or questions, refer to:
- `.kiro/specs/file-system-integration/requirements.md` - Requirements
- `.kiro/specs/file-system-integration/design.md` - Design details
- `apps/photo-viewer/lib/README.md` - API documentation
