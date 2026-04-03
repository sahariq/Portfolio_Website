"use client"

import { usePaint } from "@/contexts/paint-context"

const MIN_ZOOM = 25
const MAX_ZOOM = 400

export function PaintToolbar() {
  const {
    currentTool,
    setCurrentTool,
    primaryColor,
    setPrimaryColor,
    presetColors,
    brushSize,
    setBrushSize,
    opacity,
    setOpacity,
    fillShapes,
    setFillShapes,
    zoom,
    setZoom,
    canUndo,
    canRedo,
    undo,
    redo,
  } = usePaint()

  const toolButtonClass = (tool: string) =>
    `px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
      currentTool === tool
        ? "bg-[#0ea5e9] border-[#0ea5e9] text-black"
        : "bg-[#1f1f1f] border-white/10 text-white/80 hover:bg-[#2a2a2a]"
    }`

  const adjustZoom = (nextZoom: number) => {
    setZoom(Math.max(MIN_ZOOM, Math.min(nextZoom, MAX_ZOOM)))
  }

  return (
    <div className="border-b border-white/10 bg-[#181818] px-3 py-2">
      <div className="mb-2 text-xs font-semibold text-white/60">Tools</div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Core Tools */}
        <button className={toolButtonClass("brush")} onClick={() => setCurrentTool("brush")} title="Brush (B)">
          Brush
        </button>
        <button className={toolButtonClass("eraser")} onClick={() => setCurrentTool("eraser")} title="Eraser (E)">
          Eraser
        </button>
        <button
          className={toolButtonClass("eyedropper")}
          onClick={() => setCurrentTool("eyedropper")}
          title="Color Picker (I)"
        >
          Pick
        </button>
        <button className={toolButtonClass("fill")} onClick={() => setCurrentTool("fill")} title="Fill (G)">
          Fill
        </button>
        <button className={toolButtonClass("text")} onClick={() => setCurrentTool("text")} title="Text (T)">
          Text
        </button>
        <button
          className={toolButtonClass("magnifier")}
          onClick={() => setCurrentTool("magnifier")}
          title="Magnifier (M)"
        >
          Mag
        </button>

        <div className="mx-2 h-6 w-px bg-white/10" />

        {/* Shape Tools */}
        <button className={toolButtonClass("line")} onClick={() => setCurrentTool("line")} title="Line (L)">
          Line
        </button>
        <button className={toolButtonClass("rectangle")} onClick={() => setCurrentTool("rectangle")} title="Rectangle (R)">
          Rect
        </button>
        <button className={toolButtonClass("ellipse")} onClick={() => setCurrentTool("ellipse")} title="Ellipse (O)">
          Ellipse
        </button>

        <div className="mx-2 h-6 w-px bg-white/10" />

        {/* Shape Fill */}
        <label className="flex items-center gap-1.5 text-xs text-white/80">
          <input
            type="checkbox"
            checked={fillShapes}
            onChange={(event) => setFillShapes(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-white/15 bg-[#111]"
            title="Fill Shapes (F)"
          />
          Fill
        </label>

        <div className="mx-2 h-6 w-px bg-white/10" />

        {/* Color Controls */}
        <label className="flex items-center gap-2 text-xs text-white/80">
          Color
          <input
            type="color"
            value={primaryColor}
            onChange={(event) => setPrimaryColor(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded border border-white/10 bg-transparent p-0"
            aria-label="Brush color"
          />
        </label>
        <div className="flex items-center gap-1.5">
          {presetColors.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setPrimaryColor(swatch)}
              className="h-5 w-5 rounded border border-white/25"
              style={{ backgroundColor: swatch }}
              aria-label={`Set color ${swatch}`}
            />
          ))}
        </div>

        <div className="mx-2 h-6 w-px bg-white/10" />

        {/* Size Control */}
        <label className="flex items-center gap-2 text-xs text-white/80">
          Size
          <input
            type="range"
            min={1}
            max={64}
            value={brushSize}
            onChange={(event) => setBrushSize(Number(event.target.value))}
            className="w-24"
            aria-label="Brush size"
          />
          <span className="w-7 text-right text-white/60">{brushSize}</span>
        </label>

        {/* Opacity Control */}
        <label className="flex items-center gap-2 text-xs text-white/80">
          Opacity
          <input
            type="range"
            min={0}
            max={100}
            value={opacity}
            onChange={(event) => setOpacity(Number(event.target.value))}
            className="w-24"
            aria-label="Brush opacity"
          />
          <span className="w-8 text-right text-white/60">{opacity}%</span>
        </label>

        <div className="mx-2 h-6 w-px bg-white/10" />

        {/* History */}
        <button
          className="rounded border border-white/10 bg-[#1f1f1f] px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={undo}
          disabled={!canUndo}
        >
          Undo
        </button>
        <button
          className="rounded border border-white/10 bg-[#1f1f1f] px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={redo}
          disabled={!canRedo}
        >
          Redo
        </button>

        <div className="mx-2 h-6 w-px bg-white/10" />

        {/* Zoom Control */}
        <button
          className="rounded border border-white/10 bg-[#1f1f1f] px-2 py-1.5 text-xs text-white/80 transition-colors hover:bg-[#2a2a2a]"
          onClick={() => adjustZoom(zoom - 25)}
        >
          -
        </button>
        <label className="flex items-center gap-2 text-xs text-white/80">
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={25}
            value={zoom}
            onChange={(event) => adjustZoom(Number(event.target.value))}
            className="w-20"
            aria-label="Zoom level"
          />
          <span className="w-10 text-right text-white/60">{zoom}%</span>
        </label>
        <button
          className="rounded border border-white/10 bg-[#1f1f1f] px-2 py-1.5 text-xs text-white/80 transition-colors hover:bg-[#2a2a2a]"
          onClick={() => adjustZoom(zoom + 25)}
        >
          +
        </button>
      </div>
    </div>
  )
}
