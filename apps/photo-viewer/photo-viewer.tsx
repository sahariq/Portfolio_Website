"use client"

import { useState, useCallback, useEffect } from "react"
import type { PhotoViewerState, MediaFile } from "./types"
import { createInitialState, setViewMode, setCurrentMedia, updateZoomLevel, updatePanOffset, toggleSlideshow, getNextMediaIndex, shouldDisablePrevious, shouldDisableNext, resetZoomAndPan } from "./state"
import { loadMediaFilesFromFolder } from "./file-system-integration"
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts"
import { ErrorBoundary } from "./components/error-boundary"
import { SingleImageView } from "./components/single-image-view"
import { ThumbnailGridView } from "./components/thumbnail-grid-view"
import { SlideshowView } from "./components/slideshow-view"
import { FullScreenView } from "./components/fullscreen-view"
import { getErrorMessage } from "./errors"

interface PhotoViewerProps {
  appId: string
  initialFolderPath?: string
}

/**
 * Main Photo Viewer component
 * Integrates all view components and manages application state
 * Handles keyboard shortcuts, error handling, and responsive layout
 * Validates: Requirements 1.1, 1.2, 10.1, 10.2, 10.3, 10.4
 */
export function PhotoViewer({ appId, initialFolderPath = '/public' }: PhotoViewerProps) {
  const [state, setState] = useState<PhotoViewerState>(() =>
    createInitialState(initialFolderPath)
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 })

  // Load media files from folder on mount or when folder changes
  useEffect(() => {
    const loadFolder = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const mediaFiles = await loadMediaFilesFromFolder(state.currentFolderPath)
        setState((prev) => ({
          ...prev,
          mediaFiles,
          currentMediaIndex: 0,
        }))
      } catch (err) {
        const errorMessage = getErrorMessage(err)
        setError(errorMessage)
        console.error('Failed to load folder:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (state.currentFolderPath) {
      loadFolder()
    }
  }, [state.currentFolderPath])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById(`photo-viewer-${appId}`)
      if (container) {
        setWindowSize({
          width: container.clientWidth,
          height: container.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial size

    return () => window.removeEventListener('resize', handleResize)
  }, [appId])

  // State update handlers
  const handleViewModeChange = useCallback((mode: 'single' | 'grid' | 'slideshow' | 'fullscreen') => {
    setState((prev) => {
      let newState = setViewMode(prev, mode)
      // Reset zoom and pan when switching modes
      if (mode !== 'fullscreen') {
        newState = resetZoomAndPan(newState)
      }
      return newState
    })
  }, [])

  const handleMediaSelect = useCallback((index: number) => {
    setState((prev) => {
      let newState = setCurrentMedia(prev, index)
      // Reset zoom and pan when selecting new media
      newState = resetZoomAndPan(newState)
      return newState
    })
  }, [])

  const handleZoomChange = useCallback((zoomLevel: number) => {
    setState((prev) => updateZoomLevel(prev, zoomLevel))
  }, [])

  const handlePanChange = useCallback((panOffset: { x: number; y: number }) => {
    setState((prev) => updatePanOffset(prev, panOffset))
  }, [])

  const handleSlideshowToggle = useCallback(() => {
    setState((prev) => toggleSlideshow(prev))
  }, [])

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    setState((prev) => {
      const nextIndex = getNextMediaIndex(
        prev.currentMediaIndex,
        direction,
        prev.mediaFiles.length,
        prev.mode === 'slideshow' // Wrap around in slideshow mode
      )
      let newState = setCurrentMedia(prev, nextIndex)
      // Reset zoom and pan when navigating
      newState = resetZoomAndPan(newState)
      return newState
    })
  }, [])

  const handleExitFullScreen = useCallback(() => {
    handleViewModeChange('single')
  }, [handleViewModeChange])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onArrowLeft: () => handleNavigate('prev'),
    onArrowRight: () => handleNavigate('next'),
    onSpace: handleSlideshowToggle,
    onF: () => handleViewModeChange(state.mode === 'fullscreen' ? 'single' : 'fullscreen'),
    onEscape: () => {
      if (state.mode === 'fullscreen') {
        handleExitFullScreen()
      }
    },
    onPlus: () => handleZoomChange(state.zoomLevel + 0.1),
    onMinus: () => handleZoomChange(state.zoomLevel - 0.1),
  }, state.mode !== 'fullscreen' || state.mode === 'fullscreen')

  // Get current media file
  const currentMediaFile = state.mediaFiles[state.currentMediaIndex]
  const canNavigatePrev = !shouldDisablePrevious(state.currentMediaIndex)
  const canNavigateNext = !shouldDisableNext(state.currentMediaIndex, state.mediaFiles.length)

  // Render error state
  if (error && !currentMediaFile) {
    return (
      <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-white dark">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#2a2a2a] border border-red-500/30 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Error Loading Folder</h2>
            <p className="text-sm text-white/80 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setState((prev) => ({
                  ...prev,
                  currentFolderPath: initialFolderPath,
                }))
              }}
              className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-white dark">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-white/60">Loading media files...</p>
          </div>
        </div>
      </div>
    )
  }

  // Render empty state
  if (state.mediaFiles.length === 0) {
    return (
      <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-white dark">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white/50">
            <p className="text-lg">No media files found</p>
            <p className="text-sm">The selected folder contains no supported image or video files</p>
          </div>
        </div>
      </div>
    )
  }

  // Render full-screen view
  if (state.mode === 'fullscreen' && currentMediaFile) {
    return (
      <ErrorBoundary>
        <FullScreenView
          mediaFile={currentMediaFile}
          onExitFullScreen={handleExitFullScreen}
          windowSize={windowSize}
          zoomLevel={state.zoomLevel}
          panOffset={state.panOffset}
          onZoomChange={handleZoomChange}
          onPanChange={handlePanChange}
          onNavigate={handleNavigate}
          canNavigatePrev={canNavigatePrev}
          canNavigateNext={canNavigateNext}
        />
      </ErrorBoundary>
    )
  }

  // Render main UI with view mode selector
  return (
    <div
      id={`photo-viewer-${appId}`}
      className="flex flex-col h-full w-full bg-[#1a1a1a] text-white dark"
    >
      {/* Header with view mode selector */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
        <h2 className="text-lg font-semibold m-0">Photo Viewer</h2>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleViewModeChange('single')}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              state.mode === 'single'
                ? 'bg-white/20 border-white/30'
                : 'border-white/18 bg-white/5 hover:bg-white/10'
            }`}
            title="Single image view"
          >
            Single
          </button>
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              state.mode === 'grid'
                ? 'bg-white/20 border-white/30'
                : 'border-white/18 bg-white/5 hover:bg-white/10'
            }`}
            title="Thumbnail grid view"
          >
            Grid
          </button>
          <button
            onClick={() => handleViewModeChange('slideshow')}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              state.mode === 'slideshow'
                ? 'bg-white/20 border-white/30'
                : 'border-white/18 bg-white/5 hover:bg-white/10'
            }`}
            title="Slideshow view"
          >
            Slideshow
          </button>
          <button
            onClick={() => handleViewModeChange('fullscreen')}
            className="px-3 py-2 rounded-lg border border-white/18 bg-white/5 hover:bg-white/10 transition-colors text-sm"
            title="Full-screen view (F)"
          >
            Full-screen
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <ErrorBoundary>
          {state.mode === 'single' && currentMediaFile && (
            <SingleImageView
              mediaFile={currentMediaFile}
              zoomLevel={state.zoomLevel}
              panOffset={state.panOffset}
              onZoomChange={handleZoomChange}
              onPanChange={handlePanChange}
              onNavigate={handleNavigate}
              canNavigatePrev={canNavigatePrev}
              canNavigateNext={canNavigateNext}
              windowSize={windowSize}
            />
          )}

          {state.mode === 'grid' && (
            <ThumbnailGridView
              mediaFiles={state.mediaFiles}
              currentMediaIndex={state.currentMediaIndex}
              onSelectMedia={handleMediaSelect}
              windowSize={windowSize}
            />
          )}

          {state.mode === 'slideshow' && currentMediaFile && (
            <SlideshowView
              mediaFile={currentMediaFile}
              isPlaying={state.slideshowPlaying}
              onPlayPause={handleSlideshowToggle}
              onNavigate={handleNavigate}
              canNavigatePrev={canNavigatePrev}
              canNavigateNext={canNavigateNext}
              windowSize={windowSize}
              zoomLevel={state.zoomLevel}
              panOffset={state.panOffset}
              onZoomChange={handleZoomChange}
              onPanChange={handlePanChange}
              currentIndex={state.currentMediaIndex}
              totalMedia={state.mediaFiles.length}
            />
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}
