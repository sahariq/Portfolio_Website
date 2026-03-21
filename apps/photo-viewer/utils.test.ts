/**
 * Unit tests for Photo Viewer utility functions
 * Tests file format validation, zoom calculations, and helper functions
 */

import {
  isSupportedFormat,
  isImageFormat,
  isVideoFormat,
  getMediaType,
  getNormalizedFormat,
  formatFileSize,
  formatDimensions,
  clampZoomLevel,
  zoomIn,
  zoomOut,
  calculateAspectRatio,
  calculateFitToWindowDimensions,
  getFileExtension,
} from './utils'

describe('File Format Validation', () => {
  describe('isSupportedFormat', () => {
    it('should return true for supported image formats', () => {
      expect(isSupportedFormat('photo.jpg')).toBe(true)
      expect(isSupportedFormat('photo.jpeg')).toBe(true)
      expect(isSupportedFormat('photo.png')).toBe(true)
    })

    it('should return true for supported video formats', () => {
      expect(isSupportedFormat('video.mp4')).toBe(true)
      expect(isSupportedFormat('video.webm')).toBe(true)
    })

    it('should return false for unsupported formats', () => {
      expect(isSupportedFormat('document.pdf')).toBe(false)
      expect(isSupportedFormat('document.docx')).toBe(false)
      expect(isSupportedFormat('archive.zip')).toBe(false)
    })

    it('should be case-insensitive', () => {
      expect(isSupportedFormat('photo.JPG')).toBe(true)
      expect(isSupportedFormat('photo.PNG')).toBe(true)
      expect(isSupportedFormat('video.MP4')).toBe(true)
    })

    it('should handle files without extensions', () => {
      expect(isSupportedFormat('photo')).toBe(false)
    })
  })

  describe('isImageFormat', () => {
    it('should return true for image formats', () => {
      expect(isImageFormat('photo.jpg')).toBe(true)
      expect(isImageFormat('photo.png')).toBe(true)
    })

    it('should return false for video formats', () => {
      expect(isImageFormat('video.mp4')).toBe(false)
      expect(isImageFormat('video.webm')).toBe(false)
    })
  })

  describe('isVideoFormat', () => {
    it('should return true for video formats', () => {
      expect(isVideoFormat('video.mp4')).toBe(true)
      expect(isVideoFormat('video.webm')).toBe(true)
    })

    it('should return false for image formats', () => {
      expect(isVideoFormat('photo.jpg')).toBe(false)
      expect(isVideoFormat('photo.png')).toBe(false)
    })
  })

  describe('getMediaType', () => {
    it('should return "image" for image files', () => {
      expect(getMediaType('photo.jpg')).toBe('image')
      expect(getMediaType('photo.png')).toBe('image')
    })

    it('should return "video" for video files', () => {
      expect(getMediaType('video.mp4')).toBe('video')
      expect(getMediaType('video.webm')).toBe('video')
    })

    it('should return null for unsupported formats', () => {
      expect(getMediaType('document.pdf')).toBe(null)
    })
  })

  describe('getNormalizedFormat', () => {
    it('should normalize jpeg to jpg', () => {
      expect(getNormalizedFormat('photo.jpeg')).toBe('jpg')
    })

    it('should return correct format for supported files', () => {
      expect(getNormalizedFormat('photo.jpg')).toBe('jpg')
      expect(getNormalizedFormat('photo.png')).toBe('png')
      expect(getNormalizedFormat('video.mp4')).toBe('mp4')
      expect(getNormalizedFormat('video.webm')).toBe('webm')
    })

    it('should return null for unsupported formats', () => {
      expect(getNormalizedFormat('document.pdf')).toBe(null)
    })
  })

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('photo.jpg')).toBe('jpg')
      expect(getFileExtension('video.mp4')).toBe('mp4')
    })

    it('should handle multiple dots in filename', () => {
      expect(getFileExtension('photo.backup.jpg')).toBe('jpg')
    })

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('photo')).toBe('')
    })
  })
})

describe('Formatting Functions', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(512)).toBe('0.5 KB')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })

  describe('formatDimensions', () => {
    it('should format dimensions correctly', () => {
      expect(formatDimensions(1920, 1080)).toBe('1920x1080')
      expect(formatDimensions(800, 600)).toBe('800x600')
    })
  })
})

describe('Zoom Functions', () => {
  describe('clampZoomLevel', () => {
    it('should clamp zoom level to valid range [1.0, 4.0]', () => {
      expect(clampZoomLevel(0.5)).toBe(1.0)
      expect(clampZoomLevel(1.0)).toBe(1.0)
      expect(clampZoomLevel(2.0)).toBe(2.0)
      expect(clampZoomLevel(4.0)).toBe(4.0)
      expect(clampZoomLevel(5.0)).toBe(4.0)
    })
  })

  describe('zoomIn', () => {
    it('should increase zoom by 10%', () => {
      expect(zoomIn(1.0)).toBeCloseTo(1.1, 5)
      expect(zoomIn(2.0)).toBeCloseTo(2.2, 5)
    })

    it('should clamp to maximum zoom level', () => {
      expect(zoomIn(4.0)).toBe(4.0)
    })

    it('should not exceed 4.0 when zooming in from high levels', () => {
      expect(zoomIn(3.7)).toBeLessThanOrEqual(4.0)
    })
  })

  describe('zoomOut', () => {
    it('should decrease zoom by 10%', () => {
      expect(zoomOut(2.0)).toBeCloseTo(1.818, 2)
      expect(zoomOut(1.1)).toBeCloseTo(1.0, 5)
    })

    it('should clamp to minimum zoom level', () => {
      expect(zoomOut(1.0)).toBe(1.0)
    })

    it('should not go below 1.0 when zooming out', () => {
      expect(zoomOut(1.05)).toBeGreaterThanOrEqual(1.0)
    })
  })
})

describe('Aspect Ratio Functions', () => {
  describe('calculateAspectRatio', () => {
    it('should calculate aspect ratio correctly', () => {
      expect(calculateAspectRatio(1920, 1080)).toBeCloseTo(16 / 9, 5)
      expect(calculateAspectRatio(800, 600)).toBeCloseTo(4 / 3, 5)
      expect(calculateAspectRatio(1, 1)).toBe(1)
    })

    it('should handle zero height', () => {
      expect(calculateAspectRatio(100, 0)).toBe(1)
    })
  })

  describe('calculateFitToWindowDimensions', () => {
    it('should fit wide image to window width', () => {
      const result = calculateFitToWindowDimensions(1920, 1080, 800, 600)
      expect(result.width).toBe(800)
      expect(result.height).toBeLessThanOrEqual(600)
    })

    it('should fit tall image to window height', () => {
      const result = calculateFitToWindowDimensions(600, 1200, 800, 600)
      expect(result.height).toBe(600)
      expect(result.width).toBeLessThanOrEqual(800)
    })

    it('should maintain aspect ratio', () => {
      const imageAspect = 1920 / 1080
      const result = calculateFitToWindowDimensions(1920, 1080, 800, 600)
      const resultAspect = result.width / result.height
      expect(resultAspect).toBeCloseTo(imageAspect, 5)
    })

    it('should fit square image correctly', () => {
      const result = calculateFitToWindowDimensions(1000, 1000, 800, 600)
      expect(result.width).toBe(600)
      expect(result.height).toBe(600)
    })
  })
})
