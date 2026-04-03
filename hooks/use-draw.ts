import { useCallback, useRef } from "react"

interface Point {
  x: number
  y: number
}

export function useDraw(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onSnapshot: (snapshot: ImageData) => void,
) {
  const isDrawingRef = useRef(false)
  const hasStrokeRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)
  const shapeStartPointRef = useRef<Point | null>(null)
  const shapeStartSnapshotRef = useRef<ImageData | null>(null)

  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext("2d")
  }, [canvasRef])

  const getCanvasPoint = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>): Point | null => {
      const canvas = canvasRef.current
      if (!canvas) return null

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      return {
        x: Math.max(0, Math.min((event.clientX - rect.left) * scaleX, canvas.width)),
        y: Math.max(0, Math.min((event.clientY - rect.top) * scaleY, canvas.height)),
      }
    },
    [canvasRef],
  )

  const captureSnapshot = useCallback(() => {
    const ctx = getContext()
    const canvas = canvasRef.current
    if (!ctx || !canvas) return null

    return ctx.getImageData(0, 0, canvas.width, canvas.height)
  }, [canvasRef, getContext])

  const restoreSnapshot = useCallback(
    (snapshot: ImageData) => {
      const ctx = getContext()
      if (!ctx) return

      ctx.putImageData(snapshot, 0, 0)
    },
    [getContext],
  )

  const drawLineSegment = useCallback(
    (ctx: CanvasRenderingContext2D, from: Point, to: Point) => {
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    },
    [],
  )

  const startStroke = useCallback(() => {
    isDrawingRef.current = true
    hasStrokeRef.current = false
    lastPointRef.current = null
  }, [])

  const endStroke = useCallback(() => {
    if (!isDrawingRef.current) return

    isDrawingRef.current = false
    lastPointRef.current = null
    shapeStartPointRef.current = null
    shapeStartSnapshotRef.current = null

    if (hasStrokeRef.current) {
      const snapshot = captureSnapshot()
      if (snapshot) {
        onSnapshot(snapshot)
      }
    }

    hasStrokeRef.current = false
  }, [captureSnapshot, onSnapshot])

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getContext()
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }, [canvasRef, getContext])

  const clearCanvas = useCallback(() => {
    const ctx = getContext()
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    const snapshot = captureSnapshot()
    if (snapshot) {
      onSnapshot(snapshot)
    }
  }, [captureSnapshot, canvasRef, getContext, onSnapshot])

  return {
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
    clearCanvas,
  }
}
