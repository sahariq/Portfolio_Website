/**
 * Photo Viewer App - Main exports
 */

export { PhotoViewer } from './photo-viewer'
export type { MediaFile, MediaFileData, MediaMetadata, ViewState, PhotoViewerState } from './types'
export {
  isSupportedFormat,
  isImageFormat,
  isVideoFormat,
  getMediaType,
  getNormalizedFormat,
  formatFileSize,
  formatDimensions,
  formatDate,
  generateMediaFileId,
  clampZoomLevel,
  zoomIn,
  zoomOut,
  calculateAspectRatio,
  calculateFitToWindowDimensions,
} from './utils'
