"use client"

import { Github, Linkedin, Mail, Globe, Code, Coffee } from "lucide-react"

export function About() {
  return (
    <div className="h-full bg-gradient-to-br from-[#1e1e1e] to-[#252525] p-8 overflow-auto">
      <div className="max-w-lg mx-auto">
        {/* Profile */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#0078d4] to-[#00a2ed] flex items-center justify-center">
            <img src="/pfp.jpeg" alt="Sahar Iqbal profile" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-light text-white/90 mb-1">Sahar Iqbal</h1>
          <p className="text-white/60">Software Engineer & Product-Focused Full-Stack Developer</p>
        </div>

        {/* About Me Modern Block */}
        <div className="bg-[#2d2d2d] rounded-lg p-5 border border-[#3d3d3d] mb-6">
          <div className="text-sm text-white/80 leading-relaxed space-y-3">
            <p>
              I’m a Software Engineering student at FAST-NUCES with a passion for building impactful products on the web. My focus is on crafting seamless full-stack experiences (React, Next.js, Node.js) while always considering product strategy and real user needs.
            </p>
            <p>
              From developing secure, end-to-end encrypted messaging platforms to optimizing features that boost retention by 15%, or training CNNs to detect pneumonia from X-rays, I approach every project with the same mindset: write clean code, solve real problems, and deliver with purpose.
            </p>
            <p>
              I also run a small e-commerce business, so I understand the importance of great design, smooth UX, and keeping customers happy—whether they’re users or buyers.
            </p>
          </div>
        </div>

        {/* Top Skills Modern Block */}
        <div className="bg-[#2d2d2d] rounded-lg p-5 border border-[#3d3d3d] mb-6">
          <h2 className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
            <Code className="h-4 w-4 text-[#0078d4]" />
            Top Skills
          </h2>
          <ul className="text-white/80 text-sm space-y-1 pl-2 list-disc">
            <li><b>Full-Stack Development:</b> React.js, Next.js, Node.js, Express, TypeScript, Tailwind CSS</li>
            <li><b>Backend & Databases:</b> REST APIs, MongoDB, MySQL, JWT Authentication</li>
            <li><b>AI & Machine Learning:</b> Python, scikit-learn, NLP, TensorFlow/Keras, Genetic Algorithms</li>
            <li><b>Product & Data:</b> Data-Driven Development, Agile/Scrum, SQL, Retention Optimization</li>
            <li><b>Tools & Workflow:</b> Git/GitHub, Vercel, Postman, Clean Code, Debugging</li>
          </ul>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://github.com/sahariq"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] hover:bg-[#353535] transition-colors"
          >
            <Github className="h-5 w-5 text-white/70" />
            <span className="text-sm text-white/90">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/sahar-iqbal-483b162a9/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] hover:bg-[#353535] transition-colors"
          >
            <Linkedin className="h-5 w-5 text-[#0a66c2]" />
            <span className="text-sm text-white/90">LinkedIn</span>
          </a>
          <a
            href="mailto:sahariqbalmalik05@gmail.com"
            className="flex items-center gap-3 p-3 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] hover:bg-[#353535] transition-colors"
          >
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
