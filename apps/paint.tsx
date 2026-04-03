"use client"

import { useEffect } from "react"
import { PaintProvider, usePaint } from "@/contexts/paint-context"
import { PaintMenuBar } from "@/components/paint/paint-menu-bar"
import { PaintToolbar } from "@/components/paint/paint-toolbar"
import { PaintCanvas } from "@/components/paint/paint-canvas"
import { PaintStatusBar } from "@/components/paint/paint-status-bar"

function PaintContent() {
  const { setCurrentTool, undo, redo } = usePaint()
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const isModifierPressed = event.ctrlKey || event.metaKey

      if (isModifierPressed && key === "z") {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
          return
        }
        undo()
        return
      }

      if (isModifierPressed && key === "y") {
        event.preventDefault()
        redo()
        return
      }

      if (isModifierPressed && key === "s") {
        event.preventDefault()
        // TODO: Wire save from canvas component
        return
      }

      if (isModifierPressed && key === "o") {
        event.preventDefault()
        // TODO: Wire file open from context
        return
      }

      if (isModifierPressed) return

      if (key === "b") {
        setCurrentTool("brush")
        return
      }

      if (key === "e") {
        setCurrentTool("eraser")
        return
      }

      if (key === "g") {
        setCurrentTool("fill")
        return
      }

      if (key === "l") {
        setCurrentTool("line")
        return
      }

      if (key === "r") {
        setCurrentTool("rectangle")
        return
      }

      if (key === "o") {
        setCurrentTool("ellipse")
        return
      }

      if (key === "i") {
        setCurrentTool("eyedropper")
        return
      }

      if (key === "t") {
        setCurrentTool("text")
        return
      }

      if (key === "m") {
        setCurrentTool("magnifier")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setCurrentTool, undo, redo])

  const handleClearCanvas = () => {
    // Clear action is handled by PaintMenuBar
  }

  return (
    <div className="flex h-full flex-col bg-[#121212] text-white">
      <PaintMenuBar onClearCanvas={handleClearCanvas} />
      <PaintToolbar />
      <PaintCanvas />
      <PaintStatusBar />
    </div>
  )
}

export function Paint() {
  return (
    <PaintProvider>
      <PaintContent />
    </PaintProvider>
  )
}
