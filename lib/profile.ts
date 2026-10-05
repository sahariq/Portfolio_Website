// Single source of truth for portfolio content.
// About, Projects, Start menu and Terminal should import from here instead of hard-coding text.
// Source: Resume.pdf (primary) + LinkedIn profile (extra projects, links, certifications).

export interface Experience {
  company: string
  role: string
  period: string
  location?: string
  bullets: string[]
}

export interface Project {
  id: string
  title: string
  period: string
  stack: string[]
  summary: string
  highlights: string[]
  github?: string
  live?: string
  org?: string
  featured?: boolean
  /** Optional: path under /public. Falls back to /folder.png */
  icon?: string
  /** Optional: path under /public */
  screenshot?: string
}

export const profile = {
  name: "Sahar Iqbal",
  headline: "Full Stack AI Engineer",
  location: "Islamabad, Pakistan",
  email: "sahariqbalmalik05@gmail.com",
  phone: "0334-9567336", // already public in Resume.pdf; omit from the UI if you prefer
  links: {
    linkedin: "https://www.linkedin.com/in/sahar-iqbal-483b162a9",
    github: "https://github.com/sahariq",
    portfolio: "https://portfolio-website-ten-blond-29.vercel.app",
  },
  resumeFile: "/files/Documents/Resume.pdf",
  summary:
    "Full Stack AI Engineer and product-minded builder with 3 years of experience delivering production-grade applications for government and private clients. Hands-on with LLM integration, LangChain, RAG pipelines, vector databases and agentic workflows, across Python/FastAPI, Node.js, React, Vue.js, Next.js, TypeScript and cloud tooling (Docker, AWS, CI/CD). Founder of an e-commerce business with proven customer discovery and cross-functional leadership.",
  aboutParagraphs: [
    "I'm a Software Engineering graduate from FAST-NUCES and a Full Stack Engineer at One Network, where I build production applications for the government sector.",
    "I enjoy taking products from idea to deployment, whether that's full-stack SaaS applications, AI-powered tools or secure web platforms. My work spans React, Vue.js, Next.js, Node.js, FastAPI, TypeScript and Python, plus LLM and RAG systems.",
    "Beyond my day job, I've built projects in cybersecurity, AI, encrypted messaging and recommendation systems, and I run my own e-commerce business, Captain Hook PK.",
  ],
} as const

export const skills: Record<string, string[]> = {
  "AI / LLM": ["LLM integration", "LangChain", "RAG", "Vector databases", "Embeddings", "Prompt engineering", "Agentic workflows", "SHAP / LIME"],
  Backend: ["Python", "FastAPI", "Node.js", "Express", "Django", "REST APIs", "WebSockets", "PostgreSQL", "MongoDB"],
  Frontend: ["React", "Vue.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind", "Pinia / Vuex"],
  "Cloud / DevOps": ["Docker", "AWS (EC2, S3, RDS)", "Vercel", "Netlify", "GitHub Actions", "CI/CD"],
  Product: ["Roadmapping", "PRDs", "Sprint planning", "Stakeholder management", "Customer discovery", "UX audits"],
  Tools: ["Git", "GitHub", "Jira", "Trello", "Notion", "Firebase", "Figma", "Excel"],
}

export const experience: Experience[] = [
  {
    company: "One Network (FWO)",
    role: "Full Stack Engineer",
    period: "Jun 2026 – Present",
    location: "Islamabad, Pakistan",
    bullets: [
      "Build and maintain 3+ production-grade government applications serving 50,000+ users with 99.9% uptime.",
      "Design and implement RESTful APIs; integrate 5+ third-party services.",
      "Reduced page load times by 40% through code optimisation, lazy loading and efficient state management (Pinia/Vuex).",
      "Develop reusable, modular frontend components with Vue.js, TypeScript and React, reducing development time by ~30%.",
      "Collaborate with cross-functional teams of 8+ engineers, designers and stakeholders.",
      "Support QA and UAT cycles for client-facing deployments; debug production issues.",
    ],
  },
  {
    company: "Captain Hook PK",
    role: "Founder & Owner",
    period: "Jun 2023 – Present",
    location: "Remote",
    bullets: [
      "Founded and scaled an e-commerce business, owning product strategy, customer experience, branding and operations.",
      "Conducted 150+ customer discovery sessions that directly shaped product decisions.",
      "Grew sales to 20–30 monthly orders through digital marketing and continuous product iteration.",
    ],
  },
  {
    company: "Nayatel",
    role: "Product Management Intern",
    period: "Jun 2025 – Jul 2025",
    location: "Islamabad, Pakistan",
    bullets: [
      "Researched 10+ AI platforms and 5 cybersecurity vendors; proposed 3 AI-powered product concepts to leadership.",
      "Built and launched a full-stack React MVP within 7 days.",
      "Built a Watch Party MVP with React and Firebase (synchronized playback and chat).",
    ],
  },
  {
    company: "CodingKey",
    role: "Product Analyst",
    period: "Jan 2024 – Aug 2024",
    location: "Islamabad, Pakistan",
    bullets: [
      "Analysed user behaviour and product performance data to support product improvements.",
      "Translated business requirements into technical specifications with engineering and design teams.",
      "Supported UI/UX improvements through usability analysis and feedback-driven iteration.",
    ],
  },
]

export const projects: Project[] = [
  {
    id: "aegis",
    title: "Aegis — AI-Driven Threat Detection & Security Advisory Platform",
    period: "Jun 2025 – May 2026",
    stack: ["Python", "FastAPI", "TensorFlow", "PyTorch", "XGBoost", "CNN-LSTM", "SHAP", "LIME", "Docker", "LangChain", "RAG", "React"],
    summary: "Final-year project: an enterprise-grade IDS with a RAG advisory chatbot and live dashboard for SMEs.",
    highlights: [
      "Hybrid CNN-LSTM + XGBoost model with >99.5% true positive rate and near-zero false positives.",
      "RAG chatbot (LangChain + vector DB) giving MITRE ATT&CK-mapped remediation.",
      "SHAP/LIME explainability, WebSocket live alerts, containerized microservices, sub-second inference.",
      "Trained and tested on CICIDS2017, Kitsune and DoH benchmarks.",
    ],
    org: "FAST-NUCES",
    featured: true,
  },
  {
    id: "air-quality",
    title: "Air Quality Monitoring System",
    period: "Jun 2026 – Present",
    stack: ["Vue 3", "Pinia", "Tailwind", "Leaflet", "Django", "WebSockets", "JWT"],
    summary: "Government operations platform for Punjab air quality across 44 ground stations in 41 districts.",
    highlights: [
      "Real-time monitoring, US-EPA AQI derivation, rollups, alerts, analytics and regulatory reporting.",
      "Live WebSocket fleet tracking and dispatch for mobile water-cannon trucks, with route replay.",
      "JWT auth with Django RBAC (Viewer/Operator/Admin) enforced end-to-end.",
    ],
    org: "One Network",
    featured: true,
  },
  {
    id: "marka-e-haq",
    title: "Marka e Haq Parking Management System",
    period: "Aug 2026 – Present",
    stack: ["Vue.js", "Vuex"],
    summary: "Frontend for a real-time parking platform handling booth operations at a major facility.",
    highlights: [
      "Role-based login (password + biometric fingerprint) routing 6 user types.",
      "Live Car and Bike booth dashboards with occupancy tracking.",
      "Ticketing module with QR-coded receipt generation; responsive glassmorphism UI.",
    ],
    org: "One Network",
  },
  {
    id: "e2ee-messaging",
    title: "Secure End-to-End Encrypted Messaging & File Sharing",
    period: "Dec 2025",
    stack: ["React", "Web Crypto API", "Node.js", "Express", "MongoDB", "IndexedDB"],
    summary: "E2EE platform with ECDH key exchange, ECDSA signatures and AES-256-GCM; the server never sees plaintext.",
    highlights: [
      "70%+ of the cryptographic logic implemented from scratch.",
      "Replay defence (nonce deduplication, timestamps, sequence numbers) and audit logging.",
      "STRIDE threat model with MITM and replay attack demonstrations.",
    ],
    org: "FAST-NUCES",
  },
  {
    id: "rag-handbook",
    title: "RAG FYP Handbook Assistant",
    period: "2025",
    stack: ["Python", "LangChain", "RAG", "Vector DB", "LLMs"],
    summary: "Document retrieval assistant with ingestion, chunking, embedding and retrieval pipelines.",
    highlights: ["Demonstrates an enterprise knowledge assistant pattern."],
  },
  {
    id: "disaster-agent",
    title: "AI Agent for Disaster Resource & Volunteer Allocation",
    period: "Sep 2025 – Dec 2025",
    stack: ["Python", "PuLP", "Scikit-learn", "Pandas", "GeoPandas", "Streamlit", "Flask"],
    summary: "Optimization agent that allocates volunteers and resources across disaster zones by severity and availability.",
    highlights: ["Integer programming with capacity constraints.", "Interactive Streamlit dashboard for real-time visualization."],
    github: "https://github.com/sahariq/AI-Agent-for-Disaster-Resource-and-Volunteer-Allocation",
  },
  {
    id: "cinematch",
    title: "CineMatch — AI Movie Recommendation Engine",
    period: "Apr 2025 – Apr 2026",
    stack: ["Python", "NLP", "Machine Learning", "Genetic Algorithms"],
    summary: "Mood-aware recommender using NLP on plots and genres, sentiment analysis and genetic-algorithm ranking.",
    highlights: ["Personalized ranking across multiple factors.", "Rich UI with posters, ratings and runtime."],
  },
  {
    id: "xray-cnn",
    title: "Chest X-Ray CNN — Pneumonia Detection",
    period: "Apr 2026",
    stack: ["Python", "TensorFlow", "CNN", "Scikit-learn"],
    summary: "Custom CNN built from scratch to classify chest X-rays as Normal or Pneumonia.",
    highlights: ["85.9% accuracy, F1 0.888, AUC-ROC 0.926.", "Experiments on augmentation, regularization and hyperparameters."],
  },
  {
    id: "portfolio-os",
    title: "Portfolio OS — Windows 11 Style",
    period: "Feb 2026",
    stack: ["Next.js", "React", "TypeScript", "Zustand", "Tailwind"],
    summary: "This site: a desktop-style portfolio with draggable windows, taskbar, start menu and built-in apps.",
    highlights: ["Custom window manager on Zustand.", "Resume viewer, file explorer, terminal and more."],
    live: "https://portfolio-website-ten-blond-29.vercel.app",
  },
]

export const education = [
  { school: "FAST-NUCES, Islamabad", degree: "BS, Software Engineering", period: "2022 – 2026" },
  { school: "Westminster Academy Islamabad", degree: "A Levels, Computer Science", period: "Grades: A B B" },
]

export const certifications = [
  "AWS Academy Graduate — Cloud Web Application Builder (May 2026)",
  "AWS Cloud Quest — Cloud Practitioner (Apr 2026)",
]