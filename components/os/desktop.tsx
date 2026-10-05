"use client"

import { useWindowStore } from "@/store/window-store"
import { useSystemSounds } from "@/hooks/use-system-sounds"
import { desktopIcons } from "@/lib/apps"
import { DesktopIcon } from "./desktop-icon"
import { Window } from "./window"
import { Taskbar } from "./taskbar"
import { useEffect, useRef } from "react"

export function Desktop() {
  const windows = useWindowStore((s) => s.windows)
  const setStartMenuOpen = useWindowStore((s) => s.setStartMenuOpen)
  const { playOpen } = useSystemSounds()

  const prevWindowCountRef = useRef(windows.length)

  useEffect(() => {
    // Play sound when a new window is opened
    if (windows.length > prevWindowCountRef.current) {
      playOpen()
    }
    prevWindowCountRef.current = windows.length
  }, [windows.length, playOpen])

  return (
    <div
      className="relative h-[100dvh] w-screen overflow-hidden select-none"
      onClick={() => setStartMenuOpen(false)}
      suppressHydrationWarning
    >
      {/* Desktop wallpaper - Image background - served from /public folder */}
      <img
        src="/background.jpg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none"
      />

      {/* Desktop icons */}
      <div className="absolute inset-0 pb-12" suppressHydrationWarning>
        {desktopIcons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} win={win} />
      ))}

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}