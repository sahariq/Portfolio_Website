"use client"

import { create } from "zustand"
import type { FileMetadata } from "@/apps/photo-viewer/lib/file-system-types"

interface FileExplorerStore {
  directoryCache: Record<string, FileMetadata[]>
  setCachedDirectory: (path: string, files: FileMetadata[]) => void
  clearCachedDirectory: (path: string) => void
  clearAllCache: () => void
}

export const useFileExplorerStore = create<FileExplorerStore>((set) => ({
  directoryCache: {},
  setCachedDirectory: (path, files) =>
    set((state) => ({
      directoryCache: {
        ...state.directoryCache,
        [path]: files,
      },
    })),
  clearCachedDirectory: (path) =>
    set((state) => {
      const next = { ...state.directoryCache }
      delete next[path]
      return { directoryCache: next }
    }),
  clearAllCache: () => set({ directoryCache: {} }),
}))
