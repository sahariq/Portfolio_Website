/**
 * State management for the Photo Viewer application
 * Defines state initialization and utilities
 * Validates: Requirements 2.1, 4.1, 5.1, 6.1
 */

import type { PhotoViewerState } from './types'

/**
 * Default slideshow interval in milliseconds
 */
const DEFAULT_SLIDESHOW_INTERVAL = 3000

/**
 * Default zoom level (100%)
 */
const DEFAULT_ZOOM_LEVEL = 1.0

/**
 * Creates the initial state for the Photo Viewer
 * Initializes all state properties with sensible defaults
 * Validates: Requirements 2.1, 4.1, 5.1, 6.1
 *
 * @param folderPath - Optional initial folder path (defaults to empty string)
 * @returns Initial PhotoViewerState object
 */
export function createInitialState(folderPath?: string): PhotoViewerState {
  return {
    mode: 'single',
    currentFolderPath: folderPath || '',
    mediaFiles: [],
    currentMediaIndex: 0,
    zoomLevel: DEFAULT_ZOOM_LEVEL,
    panOffset: { x: 0, y: 0 },
    slideshowPlaying: false,
    slideshowInterval: DEFAULT_SLIDESHOW_INTERVAL,
  }
}

/**
 * Resets zoom and pan to default values
 * Used when switching between media files
 * Validates: Requirements 4.1, 4.3
 *
 * @param state - Current state
 * @returns New state with reset zoom and pan
 */
export function resetZoomAndPan(state: PhotoViewerState): PhotoViewerState {
  return {
    ...state,
    zoomLevel: DEFAULT_ZOOM_LEVEL,
    panOffset: { x: 0, y: 0 },
  }
}

/**
 * Clamps zoom level to valid range [1.0, 4.0]
 * Validates: Requirements 4.2
 *
 * @param zoomLevel - The zoom level to clamp
 * @returns Clamped zoom level between 1.0 and 4.0
 */
export function clampZoomLevel(zoomLevel: number): number {
  const MIN_ZOOM = 1.0
  const MAX_ZOOM = 4.0
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel))
}

/**
 * Calculates new zoom level after zoom in operation
 * Increments by 10% (0.1)
 * Validates: Requirements 4.1, 9.6
 *
 * @param currentZoom - Current zoom level
 * @returns New zoom level after zoom in
 */
export function zoomIn(currentZoom: number): number {
  const ZOOM_INCREMENT = 0.1
  return clampZoomLevel(currentZoom + ZOOM_INCREMENT)
}

/**
 * Calculates new zoom level after zoom out operation
 * Decrements by 10% (0.1)
 * Validates: Requirements 4.1, 9.7
 *
 * @param currentZoom - Current zoom level
 * @returns New zoom level after zoom out
 */
export function zoomOut(currentZoom: number): number {
  const ZOOM_INCREMENT = 0.1
  return clampZoomLevel(currentZoom - ZOOM_INCREMENT)
}

/**
 * Calculates new zoom level from mouse wheel delta
 * Positive delta = zoom in, negative delta = zoom out
 * Validates: Requirements 4.1
 *
 * @param currentZoom - Current zoom level
 * @param wheelDelta - Mouse wheel delta (positive or negative)
 * @returns New zoom level
 */
export function zoomFromWheelDelta(currentZoom: number, wheelDelta: number): number {
  const ZOOM_INCREMENT = 0.1
  const direction = wheelDelta > 0 ? 1 : -1
  return clampZoomLevel(currentZoom + direction * ZOOM_INCREMENT)
}

/**
 * Validates if a media index is within bounds
 * Validates: Requirements 5.1, 5.5, 5.6
 *
 * @param index - The index to validate
 * @param mediaCount - Total number of media files
 * @returns true if index is valid, false otherwise
 */
export function isValidMediaIndex(index: number, mediaCount: number): boolean {
  return index >= 0 && index < mediaCount
}

/**
 * Determines if the Previous button should be disabled
 * Validates: Requirements 5.5
 *
 * @param currentIndex - Current media index
 * @returns true if Previous button should be disabled
 */
export function shouldDisablePrevious(currentIndex: number): boolean {
  return currentIndex === 0
}

/**
 * Determines if the Next button should be disabled
 * Validates: Requirements 5.6
 *
 * @param currentIndex - Current media index
 * @param mediaCount - Total number of media files
 * @returns true if Next button should be disabled
 */
export function shouldDisableNext(currentIndex: number, mediaCount: number): boolean {
  return currentIndex === mediaCount - 1
}

/**
 * Calculates the next media index for navigation
 * Wraps around at boundaries if specified
 * Validates: Requirements 5.2, 5.3, 5.4
 *
 * @param currentIndex - Current media index
 * @param direction - Navigation direction ('prev' or 'next')
 * @param mediaCount - Total number of media files
 * @param wrap - Whether to wrap around at boundaries (default: false)
 * @returns New media index
 */
export function getNextMediaIndex(
  currentIndex: number,
  direction: 'prev' | 'next',
  mediaCount: number,
  wrap: boolean = false,
): number {
  if (mediaCount === 0) return 0

  let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

  if (wrap) {
    // Wrap around at boundaries
    nextIndex = (nextIndex + mediaCount) % mediaCount
  } else {
    // Clamp to valid range
    nextIndex = Math.max(0, Math.min(nextIndex, mediaCount - 1))
  }

  return nextIndex
}


/**
 * Updates the view mode in the state
 * Validates: Requirements 2.1, 5.1, 6.1, 7.1
 *
 * @param state - Current state
 * @param mode - New view mode ('single', 'grid', 'slideshow', or 'fullscreen')
 * @returns New state with updated view mode
 */
export function setViewMode(
  state: PhotoViewerState,
  mode: 'single' | 'grid' | 'slideshow' | 'fullscreen',
): PhotoViewerState {
  return {
    ...state,
    mode,
  }
}

/**
 * Updates the current media index in the state
 * Validates: Requirements 2.1, 5.1, 5.2, 5.3, 5.4
 *
 * @param state - Current state
 * @param index - New media index
 * @returns New state with updated current media index
 */
export function setCurrentMedia(state: PhotoViewerState, index: number): PhotoViewerState {
  // Clamp index to valid range
  const clampedIndex = Math.max(0, Math.min(index, state.mediaFiles.length - 1))
  return {
    ...state,
    currentMediaIndex: clampedIndex,
  }
}

/**
 * Updates the zoom level in the state with clamping
 * Ensures zoom level stays within [100%, 400%] bounds
 * Validates: Requirements 4.1, 4.2, 9.6, 9.7
 *
 * @param state - Current state
 * @param zoomLevel - New zoom level
 * @returns New state with updated zoom level (clamped to [1.0, 4.0])
 */
export function updateZoomLevel(state: PhotoViewerState, zoomLevel: number): PhotoViewerState {
  return {
    ...state,
    zoomLevel: clampZoomLevel(zoomLevel),
  }
}

/**
 * Updates the pan offset in the state
 * Validates: Requirements 4.3, 4.4
 *
 * @param state - Current state
 * @param offset - New pan offset { x, y }
 * @returns New state with updated pan offset
 */
export function updatePanOffset(
  state: PhotoViewerState,
  offset: { x: number; y: number },
): PhotoViewerState {
  return {
    ...state,
    panOffset: offset,
  }
}

/**
 * Toggles the slideshow playing state
 * Validates: Requirements 6.3, 6.4, 9.3
 *
 * @param state - Current state
 * @returns New state with toggled slideshow playing state
 */
export function toggleSlideshow(state: PhotoViewerState): PhotoViewerState {
  return {
    ...state,
    slideshowPlaying: !state.slideshowPlaying,
  }
}
