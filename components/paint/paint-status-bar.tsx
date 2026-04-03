"use client"

import { usePaint } from "@/contexts/paint-context"

export function PaintStatusBar() {
  const { cursorPos, canvasSize, zoom } = usePaint()

  return (
    <div className="flex items-center justify-between border-t border-white/10 bg-[#181818] px-3 py-1 text-xs text-white/50">
      <div className="flex items-center gap-4">
        <span>
          Pos: {cursorPos.x}, {cursorPos.y}
        </span>
        <span>
          Size: {canvasSize.width} x {canvasSize.height}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span>{zoom}%</span>
      </div>
    </div>
  )
}
