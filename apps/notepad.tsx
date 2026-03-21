"use client"

import { useState, useEffect } from "react"
import { useWindowStore } from "@/store/window-store"

interface NotepadProps {
  windowId: string
  filePath?: string
}

export function Notepad({ windowId, filePath }: NotepadProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lineNumber, setLineNumber] = useState(1)
  const [columnNumber, setColumnNumber] = useState(1)
  const windows = useWindowStore((s) => s.windows)
  const window = windows.find((w) => w.id === windowId)

  // Load file content when filePath is provided
  useEffect(() => {
    if (!filePath) return

    const loadFile = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(filePath)
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`)
        }
        const text = await response.text()
        setContent(text)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file')
        console.error('Failed to load file:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadFile()
  }, [filePath])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setContent(text)

    // Calculate line and column numbers
    const beforeCursor = text.substring(0, e.target.selectionStart)
    const lines = beforeCursor.split('\n')
    const currentLine = lines.length
    const currentColumn = lines[lines.length - 1].length + 1

    setLineNumber(currentLine)
    setColumnNumber(currentColumn)
  }

  const handleTextAreaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const beforeCursor = content.substring(0, textarea.selectionStart)
    const lines = beforeCursor.split('\n')
    const currentLine = lines.length
    const currentColumn = lines[lines.length - 1].length + 1

    setLineNumber(currentLine)
    setColumnNumber(currentColumn)
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Menu bar */}
      <div className="flex items-center gap-1 px-2 py-0.5 bg-[#2d2d2d] border-b border-[#3d3d3d] text-xs">
        <button className="px-2 py-1 hover:bg-white/10 rounded text-white/80">File</button>
        <button className="px-2 py-1 hover:bg-white/10 rounded text-white/80">Edit</button>
        <button className="px-2 py-1 hover:bg-white/10 rounded text-white/80">View</button>
      </div>

      {/* Text area */}
      <textarea
        value={content}
        onChange={handleTextChange}
        onClick={handleTextAreaClick}
        className="flex-1 w-full p-3 bg-[#1e1e1e] text-white/90 text-sm font-mono resize-none focus:outline-none"
        placeholder={isLoading ? "Loading..." : "Start typing..."}
        spellCheck={false}
        disabled={isLoading}
      />

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#2d2d2d] border-t border-[#3d3d3d] text-xs text-white/50">
        <span>{error ? `Error: ${error}` : `Ln ${lineNumber}, Col ${columnNumber}`}</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}
