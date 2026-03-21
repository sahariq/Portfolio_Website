# Photo Viewer Application - Design

## Overview

The Photo Viewer is a desktop application built with React and TypeScript that provides multiple viewing modes for images and videos. The architecture separates concerns into state management, file system integration, UI components, and utility functions. The application uses a virtual file system API to access media files and supports zoom, pan, rotation, and slideshow functionality.

## Architecture

The Photo Viewer follows a component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Photo Viewer App                      │
├─────────────────────────────────────────────────────────┤
│  State Management (Redux/Context)                        │
│  - View mode, zoom level, pan offset                     │
│  - Current media index, slideshow state                  │
│  - Media files list, current folder path                 │
├─────────────────────────────────────────────────────────┤
│  File System Integration Layer                           │
│  - Query file system for media files                     │
│  - Retrieve file metadata                                │
│  - Cache file listings                                   │
├─────────────────────────────────────────────────────────┤
│  UI Components                                           │
│  - ImageDisplay (single image view)                      │
│  - ThumbnailGridView (grid of thumbnails)                │
│  - SlideshowView (automatic slideshow)                   │
│  - FullscreenView (fullscreen display)                   │
│  - NavigationControls (next, previous, zoom)             │
│  - MetadataDisplay (filename, dimensions, size)          │
├─────────────────────────────────────────────────────────┤
│  Utility Functions                                       │
│  - Format validation (isSupportedFormat)                 │
│  - Zoom calculations (zoomIn, zoomOut)                   │
│  - Formatting (formatFileSize, formatDimensions)         │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Core Types

```typescript
interface MediaFile {
  id: string
  name: string
  path: string
  type: 'image' | 'video'
  format: 'jpg' | 'png' | 'gif' | 'webp' | 'mp4' | 'webm'
  size: number
  dimensions?: { width: number; height: number }
  thumbnail?: string
  lastModified: Date
}

interface ViewState {
  mode: 'single' | 'grid' | 'slideshow' | 'fullscreen'
  zoomLevel: number // 1.0 to 4.0
  panOffset: { x: number; y: number }
  currentMediaIndex: number
  slideshowPlaying: boolean
  rotationDegrees: number // 0, 90, 180, 270
}

interface PhotoViewerState extends ViewState {
  currentFolderPath: string
  mediaFiles: MediaFile[]
  slideshowInterval: number // milliseconds
}
```

### Component Hierarchy

**PhotoViewer (Root Component)**
- Manages overall state and view mode switching
- Handles keyboard shortcuts
- Renders appropriate view based on mode

**ImageDisplay**
- Displays a single image with zoom and pan
- Handles mouse wheel zoom
- Handles drag-to-pan
- Applies rotation transform

**ThumbnailGridView**
- Displays grid of thumbnail images
- Handles responsive layout
- Handles thumbnail selection
- Shows tooltip on hover

**SlideshowView**
- Displays current image in slideshow mode
- Manages automatic advancement timer
- Shows slideshow controls (play, pause, interval)

**FullscreenView**
- Displays image at maximum size
- Hides UI controls
- Handles escape key to exit

**NavigationControls**
- Next/Previous buttons
- First/Last buttons
- Zoom in/out buttons
- Fit-to-window button
- Rotation buttons

**MetadataDisplay**
- Shows filename
- Shows dimensions
- Shows file size
- Shows modified date
- Shows current zoom level

## Data Models

### MediaFile Structure

Each media file is represented with complete metadata:

```typescript
{
  id: "photo-1-1234567890",
  name: "vacation-photo.jpg",
  path: "/home/user/Pictures/vacation-photo.jpg",
  type: "image",
  format: "jpg",
  size: 2457600, // bytes
  dimensions: { width: 3840, height: 2160 },
  thumbnail: "data:image/jpeg;base64,...",
  lastModified: new Date("2024-01-15T10:30:00Z")
}
```

### State Management

The application state is immutable and updated through pure functions:

```typescript
// Initial state
const initialState: PhotoViewerState = {
  mode: 'single',
  currentFolderPath: '/home/user/Pictures',
  mediaFiles: [],
  currentMediaIndex: 0,
  zoomLevel: 1.0,
  panOffset: { x: 0, y: 0 },
  slideshowPlaying: false,
  slideshowInterval: 3000,
  rotationDegrees: 0
}

// State updates through pure functions
function updateZoomLevel(state, zoomLevel) {
  return { ...state, zoomLevel: clampZoomLevel(zoomLevel) }
}

function navigateNext(state) {
  const nextIndex = Math.min(state.currentMediaIndex + 1, state.mediaFiles.length - 1)
  return { ...state, currentMediaIndex: nextIndex, zoomLevel: 1.0, panOffset: { x: 0, y: 0 } }
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Zoom Level Bounds

*For any* zoom operation, the resulting zoom level SHALL remain within the valid range [1.0, 4.0].

**Validates: Requirements 4.3, 4.4**

### Property 2: Navigation Boundary Enforcement

*For any* media file list and current index, navigating next when at the last file SHALL not advance the index, and navigating previous when at the first file SHALL not decrease the index.

**Validates: Requirements 5.3, 5.4**

### Property 3: Zoom Reset on Media Switch

*For any* media file switch, the zoom level and pan offset SHALL be reset to default values (1.0 and {x: 0, y: 0}).

**Validates: Requirements 2.4**

### Property 4: Slideshow Advancement

*For any* slideshow in progress, advancing to the next media file SHALL occur at intervals equal to the configured slideshow interval, and SHALL stop when reaching the last media file.

**Validates: Requirements 6.1, 6.4**

### Property 5: Format Support Consistency

*For any* file path, the format support check SHALL be consistent: if isSupportedFormat returns true, then getMediaType SHALL return a non-null value.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 6: Metadata Completeness

*For any* displayed media file, all metadata fields (filename, dimensions, file size, modified date) SHALL be present and non-empty in the metadata display.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 7: Rotation Idempotence

*For any* image, rotating 360 degrees (four 90-degree rotations) SHALL result in the original orientation.

**Validates: Requirements 11.1, 11.2, 11.3**

### Property 8: Grid View Responsiveness

*For any* window resize event, the grid layout SHALL reflow to accommodate the new window dimensions while maintaining thumbnail aspect ratios.

**Validates: Requirements 3.4**

### Property 9: Keyboard Shortcut Consistency

*For any* keyboard shortcut, pressing the shortcut key SHALL produce the same result as clicking the corresponding UI button.

**Validates: Requirements 9.1 through 9.10**

### Property 10: Fullscreen Mode Isolation

*For any* fullscreen mode, exiting fullscreen (via escape key) SHALL restore the previous view mode and all UI controls.

**Validates: Requirements 7.3, 7.4**

## Error Handling

The Photo Viewer implements comprehensive error handling:

1. **Unsupported Format Errors**: When a user attempts to open an unsupported file format, display an error message and prevent loading.

2. **File System Errors**: When the file system API returns an error (file not found, permission denied), display a user-friendly error message.

3. **Metadata Retrieval Errors**: When metadata cannot be retrieved for a file, display placeholder values and continue operation.

4. **Thumbnail Generation Errors**: When thumbnail generation fails, display a placeholder thumbnail.

5. **State Validation**: Validate all state transitions to ensure consistency (e.g., current media index is within bounds).

## Testing Strategy

### Unit Testing

Unit tests verify specific examples, edge cases, and error conditions:

- Format validation edge cases (empty strings, uppercase extensions, multiple dots)
- Zoom calculations at boundaries (1.0, 4.0)
- Navigation at list boundaries (first file, last file, empty list)
- Metadata formatting (zero bytes, very large files, special characters)
- Rotation calculations (0°, 90°, 180°, 270°, 360°)
- Pan offset calculations with various zoom levels

### Property-Based Testing

Property-based tests verify universal properties across all inputs:

- **Property 1**: Zoom level bounds - generate random zoom operations and verify results stay in [1.0, 4.0]
- **Property 2**: Navigation boundaries - generate random media lists and indices, verify navigation respects boundaries
- **Property 3**: Zoom reset on switch - generate random media switches, verify zoom/pan reset
- **Property 4**: Slideshow advancement - generate random slideshow intervals, verify timing and termination
- **Property 5**: Format support consistency - generate random file paths, verify format checks are consistent
- **Property 6**: Metadata completeness - generate random media files, verify all metadata fields present
- **Property 7**: Rotation idempotence - generate random rotation sequences, verify 360° rotation returns to original
- **Property 8**: Grid responsiveness - generate random window sizes, verify grid reflows correctly
- **Property 9**: Keyboard shortcut consistency - generate random shortcuts, verify they match button actions
- **Property 10**: Fullscreen isolation - generate random fullscreen transitions, verify state restoration

**Configuration**: Each property test runs minimum 100 iterations with randomly generated inputs.

**Test Tags**: Each test includes a comment referencing the design property:
```typescript
// Feature: photo-viewer, Property 1: Zoom Level Bounds
test('zoom level stays within bounds', () => { ... })
```
