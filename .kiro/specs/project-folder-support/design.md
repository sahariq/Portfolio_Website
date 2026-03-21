# Project Folder Support - Design

## Overview

The Project Folder Support feature extends the desktop simulator's file system capabilities to handle a structured `/projects` directory hierarchy. The design maintains clean separation of concerns by:

1. **Virtual File System Enhancement**: Adding project-aware path handling and caching
2. **File Explorer Integration**: Supporting nested navigation with breadcrumb trails
3. **Photo Viewer Integration**: Automatically detecting and filtering media from project subfolders
4. **Notepad Integration**: Opening text files from project folders
5. **Unified Component Interface**: Providing a consistent API across all components

The implementation leverages the existing virtual file system architecture while adding project-specific logic at the component level, ensuring backward compatibility and maintainability.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Desktop Simulator                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ File Explorer│  │ Photo Viewer │  │   Notepad    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           │                                  │
│                    ┌──────▼──────┐                           │
│                    │   Project    │                          │
│                    │  Adapter     │                          │
│                    └──────┬───────┘                          │
│                           │                                  │
│                    ┌──────▼──────────────┐                   │
│                    │ Virtual File System │                   │
│                    │  - Path Handling    │                   │
│                    │  - Caching          │                   │
│                    │  - File Operations  │                   │
│                    └──────┬──────────────┘                   │
│                           │                                  │
│                    ┌──────▼──────────────┐                   │
│                    │  File System API    │                   │
│                    │  (/api/files)       │                   │
│                    └─────────────────────┘                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Virtual File System (Enhanced)

**Location**: `apps/photo-viewer/lib/virtual-file-system.ts`

**Responsibilities**:
- Normalize and validate project folder paths
- Cache directory listings for performance
- Invalidate cache when directories change
- Support nested path traversal

**Key Methods**:
```typescript
listFiles(path: string, options?: FileListOptions): Promise<FileMetadata[]>
getFileMetadata(path: string): Promise<FileMetadata>
navigateTo(path: string): Promise<void>
getCurrentPath(): string
getBreadcrumbs(): BreadcrumbSegment[]
invalidateCache(path: string): void
```

### 2. Project Adapter (New)

**Location**: `apps/photo-viewer/lib/project-adapter.ts`

**Responsibilities**:
- Detect project folder structure
- Filter media files from project subfolders
- Provide project-specific path utilities
- Handle project folder validation

**Key Methods**:
```typescript
isProjectFolder(path: string): boolean
getProjectMediaFiles(projectPath: string, mediaType: 'images' | 'videos'): Promise<FileMetadata[]>
getProjectDetails(projectPath: string): Promise<FileMetadata | null>
normalizeProjectPath(path: string): string
```

### 3. File Explorer (Enhanced)

**Location**: `apps/file-explorer.tsx`

**Responsibilities**:
- Navigate into project folders
- Display nested folder contents
- Update breadcrumb trail during navigation
- Handle double-click on text files to open in Notepad

**Key Changes**:
- Support dynamic folder navigation (currently uses mock data)
- Integrate with Virtual File System for real path operations
- Add project folder detection and display

### 4. Photo Viewer (Enhanced)

**Location**: `apps/photo-viewer/photo-viewer.tsx`

**Responsibilities**:
- Detect media files in project subfolders
- Filter images and videos appropriately
- Maintain folder context during navigation
- Display media from project paths

**Key Changes**:
- Use Project Adapter to detect media in project folders
- Support navigation within project media subfolders
- Maintain correct path context for file operations

### 5. Notepad (Enhanced)

**Location**: `apps/notepad.tsx`

**Responsibilities**:
- Open text files from project folders
- Display file contents correctly
- Handle file paths from File Explorer

**Key Changes**:
- Accept file path parameter from File Explorer
- Support reading files from project folders

## Data Models

### FileMetadata (Existing)
```typescript
interface FileMetadata {
  name: string
  path: string
  size: number
  type: 'image' | 'document' | 'video' | 'folder'
  modifiedDate: Date
  dimensions?: { width: number; height: number }
}
```

### BreadcrumbSegment (Existing)
```typescript
interface BreadcrumbSegment {
  name: string
  path: string
}
```

### ProjectInfo (New)
```typescript
interface ProjectInfo {
  name: string
  path: string
  hasDetails: boolean
  hasImages: boolean
  hasVideos: boolean
  imageCount: number
  videoCount: number
}
```

### FileListOptions (Existing)
```typescript
interface FileListOptions {
  filter?: 'all' | 'images' | 'documents' | 'videos'
  sort?: 'name' | 'size' | 'date' | 'type'
  reverse?: boolean
}
```

## Integration Points

### File Explorer → Virtual File System
- File Explorer calls `listFiles()` to get folder contents
- File Explorer calls `navigateTo()` to change directories
- File Explorer calls `getBreadcrumbs()` to display path

### Photo Viewer → Virtual File System
- Photo Viewer calls `listFiles()` with filter for media types
- Photo Viewer calls `getFileMetadata()` for image dimensions
- Photo Viewer calls `getThumbnail()` for preview generation

### Photo Viewer → Project Adapter
- Photo Viewer calls `getProjectMediaFiles()` to detect media in project folders
- Photo Viewer calls `isProjectFolder()` to determine if current path is a project

### File Explorer → Notepad
- File Explorer passes file path when opening text files
- Notepad receives path and reads file contents

### All Components → Virtual File System
- All components use normalized paths from Virtual File System
- All components benefit from caching for performance

## Error Handling

### Path Validation Errors
- Invalid path format → Return `FileSystemError` with code `INVALID_PATH`
- Path contains invalid characters → Reject and return error
- Path traversal attempts → Validate and reject

### File Access Errors
- File not found → Return `FileSystemError` with code `NOT_FOUND`
- Permission denied → Return `FileSystemError` with code `PERMISSION_DENIED`
- Unknown errors → Return `FileSystemError` with code `UNKNOWN`

### Component-Level Handling
- File Explorer displays error messages to user
- Photo Viewer shows "folder is empty" when no media found
- Notepad shows error if file cannot be read

## Testing Strategy

### Unit Testing

**Virtual File System Tests**:
- Path normalization with various input formats
- Cache invalidation for nested paths
- Error handling for invalid paths
- File metadata retrieval

**Project Adapter Tests**:
- Project folder detection
- Media file filtering (images vs videos)
- Project path normalization
- Details file detection

**File Explorer Tests**:
- Navigation to project folders
- Breadcrumb trail updates
- Back/forward navigation history
- Double-click file opening

**Photo Viewer Tests**:
- Media detection in project subfolders
- Filter application for images/videos
- Thumbnail generation for project media
- Navigation within project folders

**Notepad Tests**:
- File opening from project paths
- Text content display
- File path handling

### Property-Based Testing

Property-based tests will validate universal correctness properties across all inputs using randomized test data generation.

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Project Folder Detection

*For any* path within the `/projects` directory, calling `listFiles()` SHALL return a list of items where each item has a valid `name`, `path`, `type`, and `modifiedDate`.

**Validates: Requirements 1.1, 1.2**

### Property 2: Nested Path Support

*For any* nested project path like `/projects/project-name/images`, the Virtual File System SHALL successfully normalize the path and return file metadata without errors.

**Validates: Requirements 1.3, 5.1, 5.2**

### Property 3: Mixed Content Listing

*For any* project folder containing both files and subfolders, calling `listFiles()` SHALL return results that include items with `type` equal to both `'file'` and `'folder'`.

**Validates: Requirements 1.4, 2.5**

### Property 4: Path Hierarchy Preservation

*For any* sequence of navigation operations to nested paths, calling `getCurrentPath()` after each navigation SHALL return the exact path that was navigated to.

**Validates: Requirements 1.5, 2.1**

### Property 5: Breadcrumb Trail Accuracy

*For any* path navigated to, calling `getBreadcrumbs()` SHALL return a list of segments where the concatenation of all segment paths equals the current path.

**Validates: Requirements 2.2**

### Property 6: Parent Directory Navigation

*For any* nested path with depth > 1, navigating to the parent directory (removing the last path segment) SHALL succeed and `getCurrentPath()` SHALL return the parent path.

**Validates: Requirements 2.3**

### Property 7: File Type Detection Consistency

*For any* file with extension `.txt`, calling `getFileMetadata()` SHALL return metadata where `type` equals `'document'`.

**Validates: Requirements 3.3, 6.1, 6.2**

### Property 8: Image File Detection

*For any* file with extension in `['.jpg', '.jpeg', '.png', '.gif', '.webp']`, calling `getFileMetadata()` SHALL return metadata where `type` equals `'image'`.

**Validates: Requirements 4.1, 6.3**

### Property 9: Video File Detection

*For any* file with extension in `['.mp4', '.webm']`, calling `getFileMetadata()` SHALL return metadata where `type` equals `'video'`.

**Validates: Requirements 4.2, 6.4**

### Property 10: Media Filtering

*For any* directory containing mixed file types, calling `listFiles()` with `filter: 'images'` SHALL return only files where `type` equals `'image'`.

**Validates: Requirements 4.3**

### Property 11: Folder Type Consistency

*For any* directory entry, if the entry represents a folder, calling `getFileMetadata()` SHALL return metadata where `type` equals `'folder'` regardless of the folder name.

**Validates: Requirements 6.5**

### Property 12: Path Normalization Idempotence

*For any* path, calling `normalizePath()` twice on the same path SHALL produce the same result as calling it once (idempotent operation).

**Validates: Requirements 5.1**

### Property 13: Cache Hit Performance

*For any* directory path, calling `listFiles()` twice with identical parameters SHALL return the same results, with the second call using cached data.

**Validates: Requirements 5.3, 9.2**

### Property 14: Cache Invalidation

*For any* path, after calling `invalidateCache(path)`, the next call to `listFiles(path)` SHALL return fresh data (not from cache).

**Validates: Requirements 5.4, 9.4**

### Property 15: Special Character Handling

*For any* path containing URL-encoded special characters, calling `normalizePath()` and `isValidPath()` SHALL handle them safely without throwing errors or allowing path traversal attacks.

**Validates: Requirements 5.5**

### Property 16: Error Object Structure

*For any* failed file operation, the returned error object SHALL contain `code` (one of: 'NOT_FOUND', 'PERMISSION_DENIED', 'INVALID_PATH', 'UNKNOWN') and `message` (non-empty string).

**Validates: Requirements 8.4**

### Property 17: Backward Compatibility - Non-Project Paths

*For any* path outside `/projects`, calling `listFiles()` SHALL work exactly as it did before the project folder feature was added.

**Validates: Requirements 10.1, 10.2, 10.5**

### Property 18: Backward Compatibility - File Types

*For any* file type (image, video, document), the file type detection logic SHALL return the same type as before the project folder feature was added.

**Validates: Requirements 10.3, 10.4**

### Property 19: Component Path Consistency

*For any* path navigated to in File Explorer, Photo Viewer SHALL be able to call `listFiles()` on the same path and receive valid results.

**Validates: Requirements 7.1**

### Property 20: Metadata Completeness

*For any* file returned by `listFiles()`, calling `getFileMetadata()` on that file's path SHALL return metadata with all required fields: `name`, `path`, `size`, `type`, `modifiedDate`.

**Validates: Requirements 3.4**

