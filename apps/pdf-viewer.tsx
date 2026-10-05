"use client"

import { Download, ExternalLink } from "lucide-react"
import { profile } from "@/lib/profile"
import { useIsMobile } from "@/hooks/use-mobile"

interface PDFViewerProps {
  /** URL of the PDF under /public. Defaults to the resume. */
  file?: string
}

const buttonClass =
  "flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/90 no-underline"

export function PDFViewer({ file = profile.resumeFile }: PDFViewerProps) {
  const isMobile = useIsMobile()
  const url = encodeURI(file)
  const isResume = file === profile.resumeFile
  const fileName = decodeURIComponent(file.split("/").pop() ?? "document.pdf")
  const title = isResume ? "Resume" : fileName
  const downloadName = isResume ? `${profile.name.replace(/\s+/g, "-")}-Resume.pdf` : fileName

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
        <h2 className="text-lg font-semibold m-0 truncate">{title}</h2>

        <div className="flex gap-2 ml-auto shrink-0">
          <a href={url} download={downloadName} className={buttonClass}>
            <Download className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : undefined}>Download PDF</span>
          </a>
          <a href={url} target="_blank" rel="noreferrer" className={buttonClass}>
            <ExternalLink className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : undefined}>Open in new tab</span>
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          // Most mobile browsers can't render PDFs inside an iframe, so link out instead.
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-white/70">PDF previews aren&apos;t supported on mobile browsers.</p>
            <a href={url} target="_blank" rel="noreferrer" className={buttonClass}>
              <ExternalLink className="h-4 w-4" />
              Open {title}
            </a>
          </div>
        ) : (
          <iframe title={title} src={url} className="w-full h-full border-0" />
        )}
      </div>
    </div>
  )
}