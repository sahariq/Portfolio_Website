"use client"

import { useState } from "react"
import { projects } from "@/lib/projects"
import { Card } from "@/components/ui/card"

export default function ProjectsApp() {
  const [selected, setSelected] = useState<string | null>(null)
  const project = projects.find(p => p.id === selected)

  return (
    <div className="h-full w-full bg-[hsl(0_0%_10%)] p-6 overflow-auto">
      <h1 className="text-3xl font-light text-white/90 mb-6">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <button
            key={proj.id}
            className="flex flex-col items-center rounded-xl bg-[hsl(0_0%_16%)] hover:bg-[hsl(0_0%_22%)] shadow-lg p-5 transition-colors border border-white/10 focus:outline-none"
            onClick={() => setSelected(proj.id)}
          >
            <img src={proj.icon} alt={proj.title} className="h-14 w-14 object-contain mb-3 drop-shadow" />
            <div className="text-lg font-medium text-white/90 mb-1">{proj.title}</div>
            <div className="text-xs text-white/60 text-center line-clamp-2">{proj.description}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {proj.tech.map((t) => (
                <span key={t} className="bg-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Modal/Window for project details */}
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[hsl(0_0%_14%)] rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border border-white/10">
            <button
              className="absolute top-3 right-3 text-white/60 hover:text-white text-xl"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center gap-4 mb-4">
              <img src={project.icon} alt={project.title} className="h-12 w-12 object-contain" />
              <div>
                <div className="text-2xl font-semibold text-white/90">{project.title}</div>
                <div className="text-xs text-white/60 mt-1">{project.role}</div>
              </div>
            </div>
            <div className="text-white/80 mb-3">{project.details || project.description}</div>
            {project.screenshot && (
              <img src={project.screenshot} alt="Screenshot" className="rounded-lg mb-3 border border-white/10" />
            )}
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tech.map((t) => (
                <span key={t} className="bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              {project.links.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">GitHub</a>
              )}
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline text-sm">Live Demo</a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
