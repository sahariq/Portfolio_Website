"use client"

import Image from "next/image"
import { Github, Linkedin, Mail, Code, FileText, Coffee } from "lucide-react"
import { useWindowStore } from "@/store/window-store"
import { apps } from "@/lib/apps"
import { profile, skills } from "@/lib/profile"

const linkClass =
  "flex items-center gap-3 p-3 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] hover:bg-[#353535] transition-colors"

export function About() {
  const openWindow = useWindowStore((s) => s.openWindow)

  return (
    <div className="h-full bg-gradient-to-br from-[#1e1e1e] to-[#252525] p-8 overflow-auto">
      <div className="max-w-lg mx-auto">
        {/* Profile */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#0078d4] to-[#00a2ed] flex items-center justify-center">
            <Image src="/pfp.jpeg" alt={`${profile.name} profile`} width={96} height={96} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-light text-white/90 mb-1">{profile.name}</h1>
          <p className="text-white/60">{profile.headline}</p>
          <p className="text-white/40 text-xs mt-1">{profile.location}</p>
        </div>

        {/* Bio */}
        <div className="bg-[#2d2d2d] rounded-lg p-5 border border-[#3d3d3d] mb-6">
          <div className="text-sm text-white/80 leading-relaxed space-y-3">
            {profile.aboutParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#2d2d2d] rounded-lg p-5 border border-[#3d3d3d] mb-6">
          <h2 className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
            <Code className="h-4 w-4 text-[#0078d4]" />
            Skills
          </h2>
          <div className="space-y-3">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <div className="text-xs text-white/50 mb-1">{category}</div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((s) => (
                    <span key={s} className="bg-white/10 text-white/75 text-[11px] px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => openWindow(apps.pdf, { file: profile.resumeFile })}
            className={linkClass}
          >
            <FileText className="h-5 w-5 text-white/70" />
            <span className="text-sm text-white/90">Resume</span>
          </button>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Github className="h-5 w-5 text-white/70" />
            <span className="text-sm text-white/90">GitHub</span>
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Linkedin className="h-5 w-5 text-[#0a66c2]" />
            <span className="text-sm text-white/90">LinkedIn</span>
          </a>
          <a href={`mailto:${profile.email}`} className={linkClass}>
            <Mail className="h-5 w-5 text-white/70" />
            <span className="text-sm text-white/90">Email</span>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-white/40 flex items-center justify-center gap-1">
          <span>Made with</span>
          <Coffee className="h-3 w-3" />
          <span>and code</span>
        </div>
      </div>
    </div>
  )
}