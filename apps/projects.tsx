"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { projects } from "@/lib/profile"

const FALLBACK_ICON = "/folder.png"
const MAX_TAGS_ON_CARD = 4

// Featured projects first, otherwise keep the order from profile.ts
const sortedProjects = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

export default function ProjectsApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const project = projects.find((p) => p.id === selectedId)

  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setSelectedId(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedId])

  return (
    // The modal is positioned against this wrapper, so it stays inside the window
    // and doesn't scroll away with the grid.
    <div className="relative h-full w-full bg-[hsl(0_0%_10%)]">
      <div className="h-full w-full overflow-auto p-6">
        <h1 className="text-3xl font-light text-white/90 mb-6">Projects</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedProjects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setSelectedId(proj.id)}
              className="flex flex-col items-start text-left rounded-xl bg-[hsl(0_0%_16%)] hover:bg-[hsl(0_0%_22%)] shadow-lg p-5 transition-colors border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <Image
                src={proj.icon ?? FALLBACK_ICON}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-contain mb-3 drop-shadow"
              />
              <div className="text-base font-medium text-white/90 mb-1 line-clamp-2">{proj.title}</div>
              <div className="text-[11px] text-white/40 mb-2">
                {[proj.org, proj.period].filter(Boolean).join(" · ")}
              </div>
              <div className="text-xs text-white/60 line-clamp-3">{proj.summary}</div>
              <div className="flex flex-wrap gap-1 mt-3">
                {proj.stack.slice(0, MAX_TAGS_ON_CARD).map((t) => (
                  <span key={t} className="bg-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
                {proj.stack.length > MAX_TAGS_ON_CARD && (
                  <span className="text-white/40 text-[10px] px-1 py-0.5">
                    +{proj.stack.length - MAX_TAGS_ON_CARD}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project details */}
      {project && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <div
            className="relative max-h-full w-full max-w-lg overflow-auto rounded-2xl border border-white/10 bg-[hsl(0_0%_14%)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 rounded p-1 text-white/60 hover:bg-white/10 hover:text-white"
              onClick={() => setSelectedId(null)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4 mb-4 pr-6">
              <Image src={project.icon ?? FALLBACK_ICON} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
              <div>
                <div className="text-xl font-semibold text-white/90 leading-snug">{project.title}</div>
                <div className="text-xs text-white/60 mt-1">
                  {[project.org, project.period].filter(Boolean).join(" · ")}
                </div>
              </div>
            </div>

            <p className="text-sm text-white/80 mb-3">{project.summary}</p>

            <ul className="text-sm text-white/70 list-disc pl-5 space-y-1 mb-4">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            {project.screenshot && (
              <Image
                src={project.screenshot}
                alt={`${project.title} screenshot`}
                width={800}
                height={480}
                className="rounded-lg mb-4 border border-white/10"
              />
            )}

            <div className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span key={t} className="bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            {(project.github || project.live) && (
              <div className="flex gap-4 mt-4">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                    GitHub
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline text-sm">
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}