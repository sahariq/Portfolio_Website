# Photo Viewer App

A desktop application for browsing, viewing, and interacting with images and videos from the file system. Integrated with the Windows-like simulator desktop environment.

## Project Structure

```
apps/photo-viewer/
├── types.ts              # Core TypeScript interfaces (MediaFile, ViewState, etc.)
├── utils.ts              # Utility functions (format validation, zoom calculations)
├── photo-viewer.tsx      # Main PhotoViewer component
├── index.ts              # Public exports
├── utils.test.ts         # Unit tests for utilities
├── photo-viewer.test.tsx # Unit tests for component
└── README.md             # This file
```

## Core Types

### MediaFile
Represents a media file (image or video) in the file system.

```typescript
interface MediaFile {
  id: string
  name: string
  path: string
  type: 'image' | 'video'
  format: 'jpg' | 'png' | 'mp4' | 'webm'
  size: number
  dimensions?: { width: number; height: number }
  thumbnail?: string
  lastModified: Date
}
```

### ViewState
Current view state of the Photo Viewer.

```typescript
interface ViewState {
  mode: 'single' | 'grid' | 'slideshow' | 'fullscreen'
  zoomLevel: number // 1.0 to 4.0
  panOffset: { x: number; y: number }
  currentMediaIndex: number
  slideshowPlaying: boolean
}
```

### PhotoViewerState
Complete application state extending ViewState.

```typescript
interface PhotoViewerState extends ViewState {
  currentFolderPath: string
  mediaFiles: MediaFile[]
  slideshowInterval: number // milliseconds, default 3000
}
```

## Utility Functions

### File Format Validation
- `isSupportedFormat(filePath)` - Check if file format is supported
- `isImageFormat(filePath)` - Check if file is an image
- `isVideoFormat(filePath)` - Check if file is a video
- `getMediaType(filePath)` - Get media type ('image' | 'video' | null)
- `getNormalizedFormat(filePath)` - Get normalized format string

### Formatting Functions
- `formatFileSize(bytes)` - Format bytes to human-readable string
- `formatDimensions(width, height)` - Format dimensions string
- `formatDate(date)` - Format date to readable string

### Zoom Functions
- `clampZoomLevel(zoomLevel)` - Clamp zoom to [1.0, 4.0]
- `zoomIn(currentZoom)` - Calculate zoom in (10% increment)
- `zoomOut(currentZoom)` - Calculate zoom out (10% decrement)

### Aspect Ratio Functions
- `calculateAspectRatio(width, height)` - Calculate aspect ratio
- `calculateFitToWindowDimensions(...)` - Calculate fit-to-window dimensions

## Supported Formats

### Images
- JPG / JPEG
- PNG

### Videos
- MP4
- WebM

## Styling

The Photo Viewer uses:
- **Tailwind CSS** for styling with dark theme
- **Radix UI** components for UI elements
- **Dark theme colors** consistent with other desktop apps

## Requirements Covered

Task 1 covers the following requirements:
- **1.1**: Media File Support - JPG and PNG image formats
- **1.2**: Media File Support - MP4 and WebM video formats
- **10.3**: Window Integration - Dark theme aesthetic
- **10.4**: Window Integration - Radix UI and Tailwind CSS

## Next Steps

The following tasks will build upon this foundation:
1. File system integration layer (Task 2)
2. Core state management (Task 3)
3. ImageDisplay component (Task 4)
4. SingleImageView component (Task 5)
5. ThumbnailGridView component (Task 6)
6. SlideshowView component (Task 7)
7. FullScreenView component (Task 8)
8. Video playback (Task 9)
9. Keyboard shortcuts (Task 10)
10. Metadata display (Task 11)
11. Performance optimizations (Task 12)
12. Window integration (Task 13)
13. Error handling (Task 14)
