"use client"

import { create } from "zustand"
import type { WindowState, AppDefinition, WindowPayload } from "@/types/os"

interface WindowStore {
  windows: WindowState[]
  activeWindowId: string | null
  highestZIndex: number
  startMenuOpen: boolean

  openWindow: (app: AppDefinition, payload?: WindowPayload) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  snapWindow: (id: string, edge: "left" | "right" | "top" | null) => void
  setStartMenuOpen: (open: boolean) => void
  toggleStartMenu: () => void
  getWindowById: (id: string) => WindowState | undefined
}

// Topmost visible window, used to hand focus over when one closes/minimizes
function topWindowId(windows: WindowState[]): string | null {
  const visible = windows.filter((w) => !w.isMinimized)
  if (visible.length === 0) return null
  return visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a)).id
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  highestZIndex: 100,
  startMenuOpen: false,

  openWindow: (app, payload) => {
    const { windows, highestZIndex } = get()
    const existing = windows.find((w) => w.appId === app.id && !app.allowMultiple)

    if (existing) {
      // Reuse the window with fresh launch data (a new object, so apps notice every re-launch)
      if (payload) {
        set((s) => ({
          windows: s.windows.map((w) => (w.id === existing.id ? { ...w, payload: { ...payload } } : w)),
        }))
      }
      get().focusWindow(existing.id)
      return
    }

    const id = `window-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const newZIndex = highestZIndex + 1
    const offset = (windows.length % 10) * 30

    set({
      windows: [
        ...windows,
        {
          id,
          appId: app.id,
          title: app.title,
          icon: app.icon,
          x: app.defaultX ?? 100 + offset,
          y: app.defaultY ?? 50 + offset,
          width: app.defaultWidth ?? 800,
          height: app.defaultHeight ?? 600,
          minWidth: app.minWidth ?? 400,
          minHeight: app.minHeight ?? 300,
          isMinimized: false,
          isMaximized: false,
          zIndex: newZIndex,
          snapEdge: null,
          payload,
        },
      ],
      activeWindowId: id,
      highestZIndex: newZIndex,
    })
  },

  closeWindow: (id) => {
    set((state) => {
      const windows = state.windows.filter((w) => w.id !== id)
      return {
        windows,
        activeWindowId: state.activeWindowId === id ? topWindowId(windows) : state.activeWindowId,
      }
    })
  },

  minimizeWindow: (id) => {
    set((state) => {
      const windows = state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
      return {
        windows,
        activeWindowId: state.activeWindowId === id ? topWindowId(windows) : state.activeWindowId,
      }
    })
  },

  maximizeWindow: (id) => {
    get().focusWindow(id)
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true, isMinimized: false, snapEdge: null } : w,
      ),
    }))
  },

  restoreWindow: (id) => {
    get().focusWindow(id)
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: false, isMinimized: false, snapEdge: null } : w,
      ),
    }))
  },

  focusWindow: (id) => {
    const newZIndex = get().highestZIndex + 1
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w)),
      activeWindowId: id,
      highestZIndex: newZIndex,
    }))
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y, snapEdge: null } : w)),
    }))
  },

  updateWindowSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    }))
  },

  snapWindow: (id, edge) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, snapEdge: edge, isMaximized: false } : w)),
    }))
  },

  setStartMenuOpen: (open) => set({ startMenuOpen: open }),
  toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),

  getWindowById: (id) => get().windows.find((w) => w.id === id),
}))