"use client"

import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 1024
const DISMISS_KEY = "desktop-warning-dismissed"

export default function DesktopWarningPopup() {
  const [isMobile, setIsMobile] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    const previouslyDismissed = sessionStorage.getItem(DISMISS_KEY) === "true"
    setDismissed(previouslyDismissed)

    updateViewport()
    window.addEventListener("resize", updateViewport)
    return () => window.removeEventListener("resize", updateViewport)
  }, [])

  if (!isMobile || dismissed) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/15 bg-[#222]/95 p-5 text-white shadow-2xl">
        <h2 className="text-lg font-semibold leading-snug">Best viewed on desktop/laptop</h2>
        <p className="mt-2 text-sm text-white/80">
          This portfolio is best viewed on a desktop/laptop screen. Please visit on a larger device for the full
          experience.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(DISMISS_KEY, "true")
              setDismissed(true)
            }}
            className="min-h-[44px] flex-1 rounded-md bg-[#60cdff] px-4 text-sm font-semibold text-black hover:bg-[#78d5ff]"
          >
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  )
}
