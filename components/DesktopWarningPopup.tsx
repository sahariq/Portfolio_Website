"use client"
import React, { useEffect, useState } from "react"

export default function DesktopWarningPopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024
    if (!isDesktop) {
      setShowPopup(true)
    }
  }, [])

  if (!showPopup) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--win-bg-layer-3, #242424)",
          color: "var(--win-text-primary, #fff)",
          borderRadius: "var(--win-radius-xl, 12px)",
          boxShadow: "var(--win-shadow-popup, 0 4px 16px rgba(0,0,0,0.3))",
          padding: "2rem 2.5rem",
          maxWidth: 340,
          textAlign: "center",
          border: "1px solid var(--win-border-default, rgba(255,255,255,0.08))",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: 12 }}>Best viewed on desktop</h2>
        <p style={{ marginBottom: 20 }}>
          This portfolio works best on desktop screens for a full Windows 11–style experience.
        </p>
        <button
          style={{
            background: "var(--win-accent-primary, #60cdff)",
            color: "#111",
            border: "none",
            borderRadius: "var(--win-radius-sm, 6px)",
            padding: "0.5rem 1.5rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "var(--win-shadow-hover, 0 2px 6px rgba(0,0,0,0.15))",
          }}
          onClick={() => setShowPopup(false)}
          autoFocus
        >
          Continue
        </button>
      </div>
    </div>
  )
}