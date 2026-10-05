"use client"

import { memo, useCallback, useState } from "react"
import { useWindowStore } from "@/store/window-store"
import { apps } from "@/lib/apps"
import type { DesktopIconData } from "@/types/os"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface DesktopIconProps {
  icon: DesktopIconData
}

const ICON_SIZE = 80
const GRID_GAP = 8
const GRID_PADDING = 12

function DesktopIconInner({ icon }: DesktopIconProps) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const setStartMenuOpen = useWindowStore((s) => s.setStartMenuOpen)
  const isMobile = useIsMobile()
  const [isSelected, setIsSelected] = useState(false)

  const open = useCallback(() => {
    const app = apps[icon.appId]
    if (!app) return
    openWindow(app, icon.payload)
    setStartMenuOpen(false)
  }, [icon.appId, icon.payload, openWindow, setStartMenuOpen])

  // Touch screens: single tap opens. Desktop: click selects, double-click opens.
  const handleClick = useCallback(() => {
    setIsSelected(true)
    if (isMobile) open()
  }, [isMobile, open])

  const x = GRID_PADDING + icon.gridPosition.col * (ICON_SIZE + GRID_GAP)
  const y = GRID_PADDING + icon.gridPosition.row * (ICON_SIZE + GRID_GAP)

  return (
    <button
      className={cn(
        "absolute flex flex-col items-center justify-center gap-1 rounded-md p-2 transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        isSelected ? "bg-white/15" : "hover:bg-white/10",
      )}
      style={{ top: y, left: x, width: ICON_SIZE, height: ICON_SIZE }}
      onClick={handleClick}
      onDoubleClick={open}
      onBlur={() => setIsSelected(false)}
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <img src={icon.icon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
      </div>
      <span className="line-clamp-2 text-center text-[11px] font-normal leading-tight text-white drop-shadow-md">
        {icon.title}
      </span>
    </button>
  )
}

export const DesktopIcon = memo(DesktopIconInner)