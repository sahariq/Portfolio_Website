"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { usePaint } from "@/contexts/paint-context"
import { useDraw } from "@/hooks/use-draw"

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function hexToRgba(hex: string): [number, number, number, number] {
  const normalized = hex.replace("#", "")
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized

  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)

  return [r, g, b, 255]
}

function colorsMatch(data: Uint8ClampedArray, index: number, target: [number, number, number, number]): boolean {
  return (
    data[index] === target[0] &&
    data[index + 1] === target[1] &&
    data[index + 2] === target[2] &&
    data[index + 3] === target[3]
  )
}

function setPixelColor(data: Uint8ClampedArray, index: number, color: [number, number, number, number]) {
  data[index] = color[0]
  data[index + 1] = color[1]
  data[index + 2] = color[2]
  data[index + 3] = color[3]
}

interface Point {
  x: number
  y: number
}

export function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    currentTool,
    primaryColor,
    brushSize,
    opacity,
    fillShapes,
    canvasSize,
    zoom,
    setCursorPos,
    pushSnapshot,
    addRecentColor,
  } = usePaint()

  const {
    getContext,
    getCanvasPoint,
    captureSnapshot,
    restoreSnapshot,
    drawLineSegment,
    isDrawingRef,
    hasStrokeRef,
    lastPointRef,
    shapeStartPointRef,
    shapeStartSnapshotRef,
    startStroke,
    endStroke,
    initializeCanvas,
  } = useDraw(canvasRef, pushSnapshot)

  const isShapeTool = useMemo(
    () => currentTool === "line" || currentTool === "rectangle" || currentTool === "ellipse",
    [currentTool],
  )

  const zoomScale = zoom / 100

  // Initialize canvas on size change
  useEffect(() => {
    initializeCanvas()
  }, [canvasSize.width, canvasSize.height, initializeCanvas])

  const applyBrushStyle = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = brushSize
      ctx.globalAlpha = opacity / 100

      if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out"
        ctx.strokeStyle = "rgba(0, 0, 0, 1)"
        return
      }

      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = primaryColor
    },
    [brushSize, opacity, currentTool, primaryColor],
  )

  const drawShapePreview = useCallback(
    (start: Point, end: Point) => {
      const ctx = getContext()
      if (!ctx) return

      const baseSnapshot = shapeStartSnapshotRef.current
      if (!baseSnapshot) return

      restoreSnapshot(baseSnapshot)

      ctx.lineWidth = brushSize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = opacity / 100
      ctx.strokeStyle = primaryColor
      ctx.fillStyle = primaryColor

      const left = Math.min(start.x, end.x)
      const top = Math.min(start.y, end.y)
      const width = Math.abs(end.x - start.x)
      const height = Math.abs(end.y - start.y)

      if (currentTool === "line") {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        return
      }

      if (currentTool === "rectangle") {
        if (fillShapes) {
          ctx.fillRect(left, top, width, height)
        }
        ctx.strokeRect(left, top, width, height)
        return
      }

      if (currentTool === "ellipse") {
        ctx.beginPath()
        ctx.ellipse(
          left + width / 2,
          top + height / 2,
          Math.max(width / 2, 1),
          Math.max(height / 2, 1),
          0,
          0,
          Math.PI * 2,
        )
        if (fillShapes) {
          ctx.fill()
        }
        ctx.stroke()
      }
    },
    [brushSize, currentTool, fillShapes, getContext, opacity, primaryColor, restoreSnapshot],
  )

  const floodFill = useCallback(
    (x: number, y: number) => {
      const ctx = getContext()
      const canvas = canvasRef.current
      if (!ctx || !canvas) return

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const { data, width, height } = imageData

      const startX = Math.floor(clamp(x, 0, width - 1))
      const startY = Math.floor(clamp(y, 0, height - 1))
      const startIndex = (startY * width + startX) * 4

      const targetColor: [number, number, number, number] = [
        data[startIndex],
        data[startIndex + 1],
        data[startIndex + 2],
        data[startIndex + 3],
      ]
      const replacementColor = hexToRgba(primaryColor)

      if (
        targetColor[0] === replacementColor[0] &&
        targetColor[1] === replacementColor[1] &&
        targetColor[2] === replacementColor[2] &&
        targetColor[3] === replacementColor[3]
      ) {
        return
      }

      const queue: Point[] = [{ x: startX, y: startY }]
      const maxPixels = width * height
      let processed = 0

      while (queue.length > 0 && processed < maxPixels) {
        const current = queue.pop()
        if (!current) continue

        const index = (current.y * width + current.x) * 4
        if (!colorsMatch(data, index, targetColor)) continue

        setPixelColor(data, index, replacementColor)
        processed += 1

        if (current.x > 0) queue.push({ x: current.x - 1, y: current.y })
        if (current.x < width - 1) queue.push({ x: current.x + 1, y: current.y })
        if (current.y > 0) queue.push({ x: current.x, y: current.y - 1 })
        if (current.y < height - 1) queue.push({ x: current.x, y: current.y + 1 })
      }

      ctx.putImageData(imageData, 0, 0)
      const snapshot = captureSnapshot()
      if (snapshot) {
        pushSnapshot(snapshot)
      }
    },
    [captureSnapshot, getContext, primaryColor, pushSnapshot],
  )

  const eyedropColor = useCallback(
    (x: number, y: number) => {
      const ctx = getContext()
      const canvas = canvasRef.current
      if (!ctx || !canvas) return

      const imageData = ctx.getImageData(x, y, 1, 1)
      const [r, g, b] = imageData.data
      const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase()}`
      addRecentColor(hex)
    },
    [addRecentColor, getContext],
  )

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const point = getCanvasPoint(event)
      if (!point) return

      event.currentTarget.setPointerCapture(event.pointerId)

      if (currentTool === "eyedropper") {
        eyedropColor(point.x, point.y)
        return
      }

      if (currentTool === "fill") {
        floodFill(point.x, point.y)
        return
      }

      if (isShapeTool) {
        startStroke()
        shapeStartPointRef.current = point
        shapeStartSnapshotRef.current = captureSnapshot()
        return
      }

      startStroke()
      lastPointRef.current = point

      const ctx = getContext()
      if (!ctx) return

      applyBrushStyle(ctx)
      ctx.beginPath()
      ctx.arc(point.x, point.y, Math.max(brushSize / 2, 1), 0, Math.PI * 2)
      ctx.fillStyle = currentTool === "eraser" ? "rgba(0, 0, 0, 1)" : primaryColor
      ctx.fill()
      hasStrokeRef.current = true
    },
    [
      applyBrushStyle,
      brushSize,
      captureSnapshot,
      currentTool,
      eyedropColor,
      floodFill,
      getCanvasPoint,
      getContext,
      isShapeTool,
      primaryColor,
      startStroke,
    ],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const point = getCanvasPoint(event)
      if (point) {
        setCursorPos({ x: Math.round(point.x), y: Math.round(point.y) })
      }

      if (!isDrawingRef.current || currentTool === "fill") return

      if (isShapeTool) {
        const shapeStartPoint = shapeStartPointRef.current
        if (!point || !shapeStartPoint) return

        drawShapePreview(shapeStartPoint, point)
        hasStrokeRef.current = true
        return
      }

      const lastPoint = lastPointRef.current
      if (!point || !lastPoint) return

      const ctx = getContext()
      if (!ctx) return

      applyBrushStyle(ctx)
      drawLineSegment(ctx, lastPoint, point)
      lastPointRef.current = point
      hasStrokeRef.current = true
    },
    [
      applyBrushStyle,
      currentTool,
      drawLineSegment,
      drawShapePreview,
      getCanvasPoint,
      getContext,
      isDrawingRef,
      isShapeTool,
      setCursorPos,
    ],
  )

  const onPointerUp = useCallback(() => {
    endStroke()
  }, [endStroke])

  return (
    <>
      <div className="flex-1 overflow-auto bg-[linear-gradient(45deg,#1a1a1a_25%,#171717_25%,#171717_50%,#1a1a1a_50%,#1a1a1a_75%,#171717_75%,#171717_100%)] [background-size:20px_20px] p-4">
        <div className="mx-auto w-full rounded-lg border border-white/15 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="cursor-crosshair touch-none bg-white"
            style={{ width: `${Math.round(canvasSize.width * zoomScale)}px`, height: `${Math.round(canvasSize.height * zoomScale)}px` }}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </>
  )
}
