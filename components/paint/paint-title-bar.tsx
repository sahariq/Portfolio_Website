"use client"

import { Minus, Maximize2, X } from "lucide-react"
import { usePaint } from "@/contexts/paint-context"

export function PaintTitleBar() {
  const { canvasTitle } = usePaint()

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-3 py-1.5">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded bg-gradient-to-br from-red-400 to-blue-500" />
        <span className="text-xs font-semibold">{canvasTitle} - Paint</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="rounded p-1 text-white/50 hover:bg-white/10">
          <Minus className="h-4 w-4" />
        </button>
        <button className="rounded p-1 text-white/50 hover:bg-white/10">
          <Maximize2 className="h-4 w-4" />
        </button>
        <button className="rounded p-1 text-white/50 hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
