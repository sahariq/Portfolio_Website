"use client"

import { useEffect, useState } from "react"

interface NotepadProps {
  /** Passed by the window system; Notepad itself doesn't need it. */
  windowId?: string
  /** URL of a text file under /public to open, e.g. /files/Documents/Notes.txt */
  filePath?: string
}

function getCursor(el: HTMLTextAreaElement) {
  const lines = el.value.substring(0, el.selectionStart).split("\n")
  return { line: lines.length, column: lines[lines.length - 1].length + 1 }
}

export function Notepad({ filePath }: NotepadProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(Boolean(filePath))
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState({ line: 1, column: 1 })

  const fileName = filePath ? decodeURIComponent(filePath.split("/").pop() ?? filePath) : "Untitled"

  // Load the file when one is provided
  useEffect(() => {
    if (!filePath) return

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetch(encodeURI(filePath), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Couldn't open ${filePath} (${res.status})`)
        return res.text()
      })
      .then(setContent)
      .catch((err) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : "Failed to load file")
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [filePath])

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Menu bar */}
      <div className="flex items-center gap-1 px-2 py-0.5 bg-[#2d2d2d] border-b border-[#3d3d3d] text-xs">
        <button className="px-2 py-1 hover:bg-white/10 rounded text-white/80">File</button>
        <button className="px-2 py-1 hover:bg-white/10 rounded text-white/80">Edit</button>
        <button className="px-2 py-1 hover:bg-white/10 rounded text-white/80">View</button>
        <span className="ml-auto truncate px-2 text-white/40">{fileName}</span>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setCursor(getCursor(e.currentTarget))
        }}
        // onSelect also fires for arrow-key and mouse caret moves, which onChange/onClick missed
        onSelect={(e) => setCursor(getCursor(e.currentTarget))}
        className="flex-1 w-full p-3 bg-[#1e1e1e] text-white/90 text-sm font-mono resize-none focus:outline-none"
        placeholder={isLoading ? "Loading..." : "Start typing..."}
        spellCheck={false}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between px-3 py-1 bg-[#2d2d2d] border-t border-[#3d3d3d] text-xs text-white/50">
        <span>{error ? `Error: ${error}` : `Ln ${cursor.line}, Col ${cursor.column}`}</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}