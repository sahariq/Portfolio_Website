"use client"

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react"
import { useWindowStore } from "@/store/window-store"
import type { WindowState } from "@/types/os"

export const TASKBAR_HEIGHT = 48
const SNAP_THRESHOLD = 20

export type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"
export type SnapEdge = "left" | "right" | "top"

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

interface ResizeSession {
  edge: ResizeEdge
  x: number
  y: number
  width: number
  height: number
  winX: number
  winY: number
}

/**
 * Drag, resize and edge-snap behaviour for one window.
 * Gesture data lives in refs and the latest window is read through a ref, so the
 * document listeners are attached once per gesture instead of on every pixel moved.
 */
export function useWindowInteractions(win: WindowState, isMobile: boolean) {
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)
  const snapWindow = useWindowStore((s) => s.snapWindow)
  const updateWindowPosition = useWindowStore((s) => s.updateWindowPosition)
  const updateWindowSize = useWindowStore((s) => s.updateWindowSize)

  const winRef = useRef(win)
  useEffect(() => {
    winRef.current = win
  })

  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const resizeRef = useRef<ResizeSession | null>(null)
  const snapRef = useRef<SnapEdge | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [previewSnap, setPreviewSnapState] = useState<SnapEdge | null>(null)

  const setPreviewSnap = useCallback((edge: SnapEdge | null) => {
    if (snapRef.current === edge) return
    snapRef.current = edge
    setPreviewSnapState(edge)
  }, [])

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const onMove = (e: MouseEvent) => {
      const w = winRef.current
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight - TASKBAR_HEIGHT

      if (isDragging) {
        if (e.clientX <= SNAP_THRESHOLD) setPreviewSnap("left")
        else if (e.clientX >= viewportWidth - SNAP_THRESHOLD) setPreviewSnap("right")
        else if (e.clientY <= SNAP_THRESHOLD) setPreviewSnap("top")
        else {
          setPreviewSnap(null)
          const { x: offsetX, y: offsetY } = dragOffsetRef.current
          updateWindowPosition(
            w.id,
            clamp(e.clientX - offsetX, 0, Math.max(0, viewportWidth - w.width)),
            clamp(e.clientY - offsetY, 0, Math.max(0, viewportHeight - w.height)),
          )
        }
      }

      const r = resizeRef.current
      if (isResizing && r) {
        const deltaX = e.clientX - r.x
        const deltaY = e.clientY - r.y
        let width = r.width
        let height = r.height
        let x = r.winX
        let y = r.winY

        if (r.edge.includes("e")) width = Math.max(w.minWidth, r.width + deltaX)
        if (r.edge.includes("w")) {
          width = Math.max(w.minWidth, r.width - deltaX)
          x = r.winX + (r.width - width)
        }
        if (r.edge.includes("s")) height = Math.max(w.minHeight, r.height + deltaY)
        if (r.edge.includes("n")) {
          height = Math.max(w.minHeight, r.height - deltaY)
          y = r.winY + (r.height - height)
        }

        width = Math.min(width, viewportWidth)
        height = Math.min(height, viewportHeight)
        x = clamp(x, 0, Math.max(0, viewportWidth - width))
        y = clamp(y, 0, Math.max(0, viewportHeight - height))

        updateWindowSize(w.id, width, height)
        if (r.edge.includes("w") || r.edge.includes("n")) updateWindowPosition(w.id, x, y)
      }
    }

    const onUp = () => {
      if (isDragging && snapRef.current) snapWindow(winRef.current.id, snapRef.current)
      resizeRef.current = null
      setPreviewSnap(null)
      setIsDragging(false)
      setIsResizing(false)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
    document.body.style.userSelect = "none"
    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
      document.body.style.userSelect = ""
    }
  }, [isDragging, isResizing, setPreviewSnap, snapWindow, updateWindowPosition, updateWindowSize])

  const onTitleBarMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      if (isMobile) return
      if ((e.target as HTMLElement).closest(".window-controls")) return
      e.preventDefault()
      focusWindow(win.id)

      if (win.isMaximized || win.snapEdge) {
        // Dragging a maximized or snapped window restores it, with the cursor centred on the title bar
        restoreWindow(win.id)
        dragOffsetRef.current = { x: win.width / 2, y: 15 }
      } else {
        dragOffsetRef.current = { x: e.clientX - win.x, y: e.clientY - win.y }
      }
      setIsDragging(true)
    },
    [focusWindow, isMobile, restoreWindow, win],
  )

  const onResizeStart = useCallback(
    (e: ReactMouseEvent, edge: ResizeEdge) => {
      e.preventDefault()
      e.stopPropagation()
      focusWindow(win.id)
      resizeRef.current = {
        edge,
        x: e.clientX,
        y: e.clientY,
        width: win.width,
        height: win.height,
        winX: win.x,
        winY: win.y,
      }
      setIsResizing(true)
    },
    [focusWindow, win],
  )

  return { isDragging, isResizing, previewSnap, onTitleBarMouseDown, onResizeStart }
}

/** Keeps a floating window inside the viewport, including after the browser is resized. */
export function useConstrainToViewport(win: WindowState, isMobile: boolean) {
  const updateWindowPosition = useWindowStore((s) => s.updateWindowPosition)
  const updateWindowSize = useWindowStore((s) => s.updateWindowSize)

  const winRef = useRef(win)
  useEffect(() => {
    winRef.current = win
  })

  const skip = isMobile || win.isMaximized || win.snapEdge !== null || win.isMinimized

  useEffect(() => {
    if (skip) return

    const constrain = () => {
      const w = winRef.current
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight - TASKBAR_HEIGHT

      const width = Math.min(w.width, viewportWidth)
      const height = Math.min(w.height, viewportHeight)
      const x = clamp(w.x, 0, Math.max(0, viewportWidth - width))
      const y = clamp(w.y, 0, Math.max(0, viewportHeight - height))

      if (width !== w.width || height !== w.height) updateWindowSize(w.id, width, height)
      if (x !== w.x || y !== w.y) updateWindowPosition(w.id, x, y)
    }

    constrain()
    window.addEventListener("resize", constrain)
    return () => window.removeEventListener("resize", constrain)
  }, [skip, updateWindowPosition, updateWindowSize])
}
