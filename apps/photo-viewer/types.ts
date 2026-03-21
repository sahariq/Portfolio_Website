/**
 * Core TypeScript interfaces for the Photo Viewer application
 * Defines data models for media files, metadata, and view state
 */

/**
 * Represents a media file (image or video) in the file system
 * Validates: Requirements 1.1, 1.2
 */
export interface MediaFile {
  id: string
  name: string
  path: string
  type: 'image' | 'video'
  format: 'jpg' | 'png' | 'mp4' | 'webm'
  size: number // bytes
  dimensions?: { width: number; height: number }
  thumbnail?: string // base64 or data URL
  lastModified: Date
}

/**
 * Raw data for a loaded media file
 * Validates: Requirements 1.1, 1.2
 */
export interface MediaFileData {
  url: string
  blob: Blob
  dimensions?: { width: number; height: number }
}

/**
 * Metadata information about a media file for display
 * Validates: Requirements 2.3
 */
export interface MediaMetadata {
  filename: string
  fileSize: string // formatted (e.g., "2.5 MB")
  dimensions?: string // formatted (e.g., "1920x1080")
  format: string
  lastModified: string
}

/**
 * Current view state of the Photo Viewer
 * Validates: Requirements 2.1, 4.1, 5.1, 6.1
 */
export interface ViewState {
  mode: 'single' | 'grid' | 'slideshow' | 'fullscreen'
  zoomLevel: number // 1.0 to 4.0
  panOffset: { x: number; y: number }
  currentMediaIndex: number
  slideshowPlaying: boolean
}

/**
 * Complete application state
 * Validates: Requirements 2.1, 4.1, 5.1, 6.1
 */
export interface PhotoViewerState extends ViewState {
  currentFolderPath: string
  mediaFiles: MediaFile[]
  slideshowInterval: number // milliseconds, default 3000
}
