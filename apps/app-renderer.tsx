"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import type { WindowPayload } from "@/types/os"
import { apps } from "@/lib/apps"
import { SettingsErrorBoundary } from "./settings-error-boundary"

const FileExplorer = dynamic(() => import("./file-explorer").then((m) => m.FileExplorer), { ssr: false })
const Notepad = dynamic(() => import("./notepad").then((m) => m.Notepad), { ssr: false })
const Terminal = dynamic(() => import("./terminal").then((m) => m.Terminal), { ssr: false })
const Browser = dynamic(() => import("./browser").then((m) => m.Browser), { ssr: false })
const Settings = dynamic(() => import("./settings").then((m) => m.Settings), { ssr: false })
const About = dynamic(() => import("./about").then((m) => m.About), { ssr: false })
const Paint = dynamic(() => import("./paint").then((m) => m.Paint), { ssr: false })
const PDFViewer = dynamic(() => import("./pdf-viewer").then((m) => m.PDFViewer), { ssr: false })
const PhotoViewer = dynamic(() => import("@/apps/photo-viewer").then((m) => m.PhotoViewer), { ssr: false })
const ProjectsApp = dynamic(() => import("./projects"), { ssr: false })

interface RenderContext {
  appId: string
  windowId: string
  payload?: WindowPayload
}

const asString = (v: unknown) => (typeof v === "string" ? v : undefined)

const renderExplorer = ({ appId, payload }: RenderContext) => (
  <FileExplorer appId={appId} payload={payload} />
)

// One entry per app. To add an app: add it to lib/apps.ts, then add a line here.
const registry: Record<string, (ctx: RenderContext) => ReactNode> = {
  "file-explorer": renderExplorer,
  "my-computer": renderExplorer,
  "recycle-bin": renderExplorer,
  projects: () => <ProjectsApp />,
  notepad: ({ windowId, payload }) => <Notepad windowId={windowId} filePath={asString(payload?.filePath)} />,
  terminal: () => <Terminal />,
  browser: () => <Browser />,
  settings: () => (
    <SettingsErrorBoundary>
      <Settings />
    </SettingsErrorBoundary>
  ),
  about: () => <About />,
  paint: () => <Paint />,
  // PDFViewer must accept an optional `file` prop (URL under /public)
  pdf: ({ payload }) => <PDFViewer file={asString(payload?.file)} />,
  photos: ({ appId }) => <PhotoViewer appId={appId} />,
}

function Placeholder({ message }: { message: string }) {
  return <div className="flex h-full items-center justify-center text-white/50">{message}</div>
}

interface AppRendererProps {
  appId: string
  windowId: string
  payload?: WindowPayload
}

export function AppRenderer({ appId, windowId, payload }: AppRendererProps) {
  const render = registry[appId]
  if (render) return <>{render({ appId, windowId, payload })}</>

  const title = apps[appId]?.title
  return <Placeholder message={title ? `${title} isn't available yet` : "Application not found"} />
}