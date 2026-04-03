"use client"

import { ChevronDown } from "lucide-react"
import { useState, useRef } from "react"
import { usePaint } from "@/contexts/paint-context"

type MenuSection = "file" | "edit" | "view" | null

export function PaintMenuBar({ onClearCanvas }: { onClearCanvas: () => void }) {
  const { canUndo, canRedo, undo, redo, zoom, setZoom } = usePaint()
  const [openMenu, setOpenMenu] = useState<MenuSection>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const menuButtonClass = (section: MenuSection) =>
    `px-3 py-1 text-xs font-medium border-b-2 transition-colors ${
      openMenu === section
        ? "border-[#0ea5e9] text-white bg-[#1f1f1f]"
        : "border-transparent text-white/70 hover:text-white"
    }`

  const closeMenus = () => setOpenMenu(null)

  return (
    <div className="relative border-b border-white/10 bg-[#181818] px-1 py-0" onClick={closeMenus}>
      <div className="flex">
        <button
          className={menuButtonClass("file")}
          onClick={(e) => {
            e.stopPropagation()
            setOpenMenu(openMenu === "file" ? null : "file")
          }}
        >
          File
          <ChevronDown className="ml-1 inline h-3 w-3" />
        </button>
        <button
          className={menuButtonClass("edit")}
          onClick={(e) => {
            e.stopPropagation()
            setOpenMenu(openMenu === "edit" ? null : "edit")
          }}
        >
          Edit
          <ChevronDown className="ml-1 inline h-3 w-3" />
        </button>
        <button
          className={menuButtonClass("view")}
          onClick={(e) => {
            e.stopPropagation()
            setOpenMenu(openMenu === "view" ? null : "view")
          }}
        >
          View
          <ChevronDown className="ml-1 inline h-3 w-3" />
        </button>
      </div>

      {/* File Menu */}
      {openMenu === "file" ? (
        <div className="absolute left-0 top-full z-50 w-48 rounded border border-white/15 bg-[#1f1f1f] shadow-lg">
          <button className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8">
            New
          </button>
          <button
            className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8"
            onClick={() => {
              fileInputRef.current?.click()
              setOpenMenu(null)
            }}
          >
            Open
          </button>
          <button className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8">
            Save
          </button>
          <div className="border-t border-white/10" />
          <button className="block w-full px-3 py-2 text-left text-xs text-white/50">
            Exit
          </button>
        </div>
      ) : null}

      {/* Edit Menu */}
      {openMenu === "edit" ? (
        <div className="absolute left-24 top-full z-50 w-48 rounded border border-white/15 bg-[#1f1f1f] shadow-lg">
          <button
            className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8 disabled:text-white/40"
            onClick={() => {
              undo()
              setOpenMenu(null)
            }}
            disabled={!canUndo}
          >
            Undo
          </button>
          <button
            className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8 disabled:text-white/40"
            onClick={() => {
              redo()
              setOpenMenu(null)
            }}
            disabled={!canRedo}
          >
            Redo
          </button>
          <div className="border-t border-white/10" />
          <button
            className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8"
            onClick={() => {
              onClearCanvas()
              setOpenMenu(null)
            }}
          >
            Clear
          </button>
        </div>
      ) : null}

      {/* View Menu */}
      {openMenu === "view" ? (
        <div className="absolute left-48 top-full z-50 w-48 rounded border border-white/15 bg-[#1f1f1f] shadow-lg">
          <button className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8">
            Zoom In
          </button>
          <button className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8">
            Zoom Out
          </button>
          <button
            className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/8"
            onClick={() => {
              setZoom(100)
              setOpenMenu(null)
            }}
          >
            Fit to Window
          </button>
        </div>
      ) : null}
    </div>
  )
}

