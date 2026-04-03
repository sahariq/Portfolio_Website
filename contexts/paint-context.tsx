"use client"

import { createContext, useContext, ReactNode, useState, useCallback } from "react"

export type PaintTool = "brush" | "eraser" | "fill" | "line" | "rectangle" | "ellipse" | "text" | "eyedropper" | "magnifier"

export interface PaintContextType {
  // Tool state
  currentTool: PaintTool
  setCurrentTool: (tool: PaintTool) => void

  // Color state
  primaryColor: string
  setPrimaryColor: (color: string) => void
  recentColors: string[]
  addRecentColor: (color: string) => void

  // Brush settings
  brushSize: number
  setBrushSize: (size: number) => void
  opacity: number
  setOpacity: (opacity: number) => void
  fillShapes: boolean
  setFillShapes: (fill: boolean) => void

  // Canvas state
  canvasSize: { width: number; height: number }
  setCanvasSize: (size: { width: number; height: number }) => void
  canvasTitle: string
  setCanvasTitle: (title: string) => void
  zoom: number
  setZoom: (zoom: number) => void
  cursorPos: { x: number; y: number }
  setCursorPos: (pos: { x: number; y: number }) => void

  // History/Undo-Redo
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  pushSnapshot: (snapshot: ImageData) => void
  clearCanvas?: () => void

  // Presets
  presetColors: string[]
}

const PaintContext = createContext<PaintContextType | undefined>(undefined)

interface PaintProviderProps {
  children: ReactNode
}

const INITIAL_CANVAS_WIDTH = 1200
const INITIAL_CANVAS_HEIGHT = 800
const MAX_HISTORY = 30
const PRESET_COLORS = ["#000000", "#ffffff", "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]

export function PaintProvider({ children }: PaintProviderProps) {
  const [currentTool, setCurrentTool] = useState<PaintTool>("brush")
  const [primaryColor, setPrimaryColorState] = useState("#2563eb")
  const [recentColors, setRecentColors] = useState<string[]>(["#2563eb"])
  const [brushSize, setBrushSize] = useState(8)
  const [opacity, setOpacity] = useState(100)
  const [fillShapes, setFillShapes] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: INITIAL_CANVAS_WIDTH, height: INITIAL_CANVAS_HEIGHT })
  const [canvasTitle, setCanvasTitle] = useState("Untitled")
  const [zoom, setZoom] = useState(100)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color)
    setRecentColors((previous) => {
      const next = [color, ...previous.filter((entry) => entry !== color)]
      return next.slice(0, 8)
    })
  }, [])

  const addRecentColor = useCallback((color: string) => {
    setRecentColors((previous) => {
      const next = [color, ...previous.filter((entry) => entry !== color)]
      return next.slice(0, 8)
    })
  }, [])

  const pushSnapshot = useCallback(
    (snapshot: ImageData) => {
      setHistory((previous) => {
        const next = previous.slice(0, historyIndex + 1)
        next.push(snapshot)
        if (next.length > MAX_HISTORY) {
          next.shift()
          return next
        }
        return next
      })

      setHistoryIndex((previous) => {
        const nextIndex = Math.min(previous + 1, MAX_HISTORY - 1)
        return nextIndex
      })
    },
    [historyIndex],
  )

  const undo = useCallback(() => {
    if (!canUndo) return

    const nextIndex = historyIndex - 1
    setHistoryIndex(nextIndex)
  }, [canUndo, historyIndex])

  const redo = useCallback(() => {
    if (!canRedo) return

    const nextIndex = historyIndex + 1
    setHistoryIndex(nextIndex)
  }, [canRedo, historyIndex])

  const value: PaintContextType = {
    currentTool,
    setCurrentTool,
    primaryColor,
    setPrimaryColor,
    recentColors,
    addRecentColor,
    brushSize,
    setBrushSize,
    opacity,
    setOpacity,
    fillShapes,
    setFillShapes,
    canvasSize,
    setCanvasSize,
    canvasTitle,
    setCanvasTitle,
    zoom,
    setZoom,
    cursorPos,
    setCursorPos,
    canUndo,
    canRedo,
    undo,
    redo,
    pushSnapshot,
    presetColors: PRESET_COLORS,
  }

  return <PaintContext.Provider value={value}>{children}</PaintContext.Provider>
}

export function usePaint(): PaintContextType {
  const context = useContext(PaintContext)
  if (!context) {
    throw new Error("usePaint must be used within a PaintProvider")
  }
  return context
}
