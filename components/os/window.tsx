"use client"

import { memo, useCallback, useEffect, useState, type CSSProperties } from "react"
import { Minus, Square, X, Copy } from "lucide-react"
import { useWindowStore } from "@/store/window-store"
import { useSettingsStore } from "@/store/settings-store"
import { useSystemSounds } from "@/hooks/use-system-sounds"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  TASKBAR_HEIGHT,
  useConstrainToViewport,
  useWindowInteractions,
  type ResizeEdge,
  type SnapEdge,
} from "@/hooks/use-window-interactions"
import { AppRenderer } from "@/apps/app-renderer"
import { AppErrorBoundary } from "./app-error-boundary"
import { cn } from "@/lib/utils"
import type { WindowState } from "@/types/os"

interface WindowProps {
  win: WindowState
}

const FULL_SCREEN: CSSProperties = {
  top: 0,
  left: 0,
  width: "100%",
  height: `calc(100dvh - ${TASKBAR_HEIGHT}px)`,
}

const SNAP_STYLES: Record<SnapEdge, CSSProperties> = {
  left: { ...FULL_SCREEN, width: "50%" },
  right: { ...FULL_SCREEN, left: "50%", width: "50%" },
  top: FULL_SCREEN,
}

const RESIZE_HANDLES: { edge: ResizeEdge; className: string }[] = [
  { edge: "n", className: "top-0 left-2 right-2 h-1 cursor-n-resize" },
  { edge: "s", className: "bottom-0 left-2 right-2 h-1 cursor-s-resize" },
  { edge: "w", className: "left-0 top-2 bottom-2 w-1 cursor-w-resize" },
  { edge: "e", className: "right-0 top-2 bottom-2 w-1 cursor-e-resize" },
  { edge: "nw", className: "top-0 left-0 h-2 w-2 cursor-nw-resize" },
  { edge: "ne", className: "top-0 right-0 h-2 w-2 cursor-ne-resize" },
  { edge: "sw", className: "bottom-0 left-0 h-2 w-2 cursor-sw-resize" },
  { edge: "se", className: "bottom-0 right-0 h-2 w-2 cursor-se-resize" },
]

function getWindowStyle(
  win: WindowState,
  isMobile: boolean,
  minimizeTarget: { x: number; y: number } | null,
): CSSProperties {
  const zIndex = win.zIndex

  if (isMobile) return { ...FULL_SCREEN, zIndex, borderRadius: 0 }

  if (minimizeTarget) {
    const translateX = minimizeTarget.x - (win.x + win.width / 2)
    const translateY = minimizeTarget.y - (win.y + win.height / 2)
    return {
      top: win.y,
      left: win.x,
      width: win.width,
      height: win.height,
      zIndex,
      transform: `translate(${translateX}px, ${translateY}px) scale(0.1)`,
      opacity: 0,
      transition: "transform 200ms ease-in, opacity 200ms ease-in",
    }
  }

  if (win.isMaximized) return { ...FULL_SCREEN, zIndex, borderRadius: 0 }
  if (win.snapEdge) return { ...SNAP_STYLES[win.snapEdge], zIndex }
  return { top: win.y, left: win.x, width: win.width, height: win.height, zIndex }
}

const controlClass = "items-center justify-center text-white/80 hover:bg-white/10 transition-colors"

function WindowInner({ win }: WindowProps) {
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const isActive = useWindowStore((s) => s.activeWindowId === win.id)

  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled)
  const { playClose, playMinimize, playMaximize } = useSystemSounds()
  const isMobile = useIsMobile()

  const { isDragging, isResizing, previewSnap, onTitleBarMouseDown, onResizeStart } = useWindowInteractions(
    win,
    isMobile,
  )
  useConstrainToViewport(win, isMobile)

  const [isOpening, setIsOpening] = useState(true)
  const [minimizeTarget, setMinimizeTarget] = useState<{ x: number; y: number } | null>(null)
  const isMinimizing = minimizeTarget !== null

  useEffect(() => {
    if (!animationsEnabled) {
      setIsOpening(false)
      return
    }
    const timer = setTimeout(() => setIsOpening(false), 200)
    return () => clearTimeout(timer)
  }, [animationsEnabled])

  const handleMinimize = useCallback(() => {
    playMinimize()

    if (!animationsEnabled) {
      minimizeWindow(win.id)
      return
    }

    // Animate towards this window's taskbar button, or the middle of the taskbar as a fallback
    const rect = document.querySelector(`[data-window-id="${win.id}"]`)?.getBoundingClientRect()
    setMinimizeTarget(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight - 24 },
    )
    setTimeout(() => {
      minimizeWindow(win.id)
      setMinimizeTarget(null)
    }, 200)
  }, [animationsEnabled, minimizeWindow, playMinimize, win.id])

  const handleClose = useCallback(() => {
    playClose()
    closeWindow(win.id)
  }, [closeWindow, playClose, win.id])

  const handleMaximizeToggle = useCallback(() => {
    playMaximize()
    if (win.isMaximized) restoreWindow(win.id)
    else maximizeWindow(win.id)
  }, [maximizeWindow, playMaximize, restoreWindow, win.id, win.isMaximized])

  // Minimized windows stay mounted (just hidden) so apps keep their state:
  // unsaved Notepad text, terminal history, the Explorer's current folder.
  const hidden = win.isMinimized && !isMinimizing
  const isFloating = !win.isMaximized && !win.snapEdge
  const canResize = !isMobile && isFloating

  return (
    <>
      {previewSnap && (
        <div
          className={cn(
            "fixed pointer-events-none z-[9998]",
            "bg-[#60cdff]/10 border-2 border-[#60cdff]/40 rounded-lg",
            "backdrop-blur-sm",
            animationsEnabled && "animate-in fade-in zoom-in-95 duration-150",
            previewSnap === "left" && "top-0 left-0 w-1/2 h-[calc(100vh-48px)]",
            previewSnap === "right" && "top-0 right-0 w-1/2 h-[calc(100vh-48px)]",
            previewSnap === "top" && "top-0 left-0 w-full h-[calc(100vh-48px)]",
          )}
        >
          <div className="absolute inset-2 rounded border border-[#60cdff]/20" />
        </div>
      )}

      <div
        role="group"
        aria-label={win.title}
        className={cn(
          "absolute flex flex-col overflow-hidden",
          "bg-[#202020]/95 backdrop-blur-xl",
          "border border-[#3d3d3d]",
          isActive
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(96,205,255,0.15)]"
            : "shadow-lg shadow-black/30",
          isFloating && "rounded-lg",
          hidden && "hidden",
          animationsEnabled && isOpening && "animate-in fade-in zoom-in-[0.98] duration-200",
          // No transitions while dragging or resizing, for performance
          !isDragging && !isResizing && !isMinimizing && "transition-shadow duration-200",
        )}
        style={getWindowStyle(win, isMobile, minimizeTarget)}
        onMouseDown={() => {
          if (!isActive) focusWindow(win.id)
        }}
      >
        {/* Title bar */}
        <div
          className={cn(
            "window-titlebar flex items-center justify-between select-none shrink-0",
            isMobile ? "h-11" : "h-9",
            isActive ? "bg-[#2d2d2d]" : "bg-[#252525]",
            isFloating && "rounded-t-lg",
          )}
          onMouseDown={onTitleBarMouseDown}
          onDoubleClick={handleMaximizeToggle}
        >
          <div className="flex items-center gap-2 px-3 min-w-0">
            <img src={win.icon} alt="" className="h-4 w-4 object-contain shrink-0" />
            <span className="text-xs text-white/90 font-normal truncate">{win.title}</span>
          </div>

          <div className="window-controls flex items-center shrink-0">
            <button
              onClick={handleMinimize}
              className={cn(controlClass, isMobile ? "hidden" : "flex h-9 w-11")}
              aria-label="Minimize"
            >
              <Minus className="h-4 w-4" strokeWidth={1} />
            </button>
            <button
              onClick={handleMaximizeToggle}
              className={cn(controlClass, isMobile ? "hidden" : "flex h-9 w-11")}
              aria-label={win.isMaximized ? "Restore" : "Maximize"}
            >
              {win.isMaximized || win.snapEdge ? (
                <Copy className="h-3.5 w-3.5 rotate-180" strokeWidth={1.5} />
              ) : (
                <Square className="h-3 w-3" strokeWidth={1.5} />
              )}
            </button>
            <button
              onClick={handleClose}
              className={cn(
                "flex items-center justify-center text-white/80 transition-colors min-h-[44px] min-w-[44px]",
                isMobile ? "h-11 w-11" : "h-9 w-11",
                isFloating && "rounded-tr-lg",
                "hover:bg-[#c42b1c] hover:text-white",
              )}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
          <AppErrorBoundary appTitle={win.title} onClose={handleClose}>
            <AppRenderer appId={win.appId} windowId={win.id} payload={win.payload} />
          </AppErrorBoundary>
        </div>

        {canResize &&
          RESIZE_HANDLES.map(({ edge, className }) => (
            <div
              key={edge}
              className={cn("absolute", className)}
              onMouseDown={(e) => onResizeStart(e, edge)}
            />
          ))}
      </div>
    </>
  )
}

// Only the window that actually changed re-renders while another one is dragged
export const Window = memo(WindowInner)