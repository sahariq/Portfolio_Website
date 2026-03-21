// Project data for the Windows 11–style Projects app
export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  icon: string // path to icon in public/
  screenshot?: string // optional screenshot
  links: {
    github?: string
    demo?: string
    [key: string]: string | undefined
  }
  role?: string
  details?: string // longer markdown/HTML description
}

export const projects: Project[] = [
  {
    id: "chest-xray-cnn",
    title: "Chest X-ray CNN",
    description: "Deep learning model for automated chest X-ray classification.",
    tech: ["Python", "TensorFlow", "Keras", "Deep Learning"],
    icon: "/icons8-ai-48.png",
    links: {
      github: "https://github.com/sahariq/chest-xray-cnn"
    },
    role: "Machine Learning Engineer",
    details: "Developed a convolutional neural network to classify chest X-ray images for disease detection. Includes data preprocessing, model training, and evaluation."
  },
  {
    id: "aegis",
    title: "Aegis / AegisIDS",
    description: "Cybersecurity backend and intrusion detection system.",
    tech: ["Python", "FastAPI", "Cybersecurity", "Backend"],
    icon: "/icons8-cybersecurity-48.png",
    links: {
      github: "https://github.com/sahariq/Aegis",
      ids: "https://github.com/sahariq/AegisIDS"
    },
    role: "Backend & Security Developer",
    details: "Aegis is a backend platform for cybersecurity applications. AegisIDS is an intrusion detection system built on top of Aegis, featuring real-time monitoring and alerting."
  },
  {
    id: "secure-messaging",
    title: "Secure End-to-End Encrypted Messaging & File Sharing",
    description: "A public secure messaging and file sharing system with end-to-end encryption.",
    tech: ["JavaScript", "Node.js", "Crypto", "Web"],
    icon: "/icons8-message-48.png",
    links: {
      github: "https://github.com/sahariq/Secure-End-to-End-Encrypted-Messaging-File-Sharing-System"
    },
    role: "Fullstack Developer",
    details: "Implements secure messaging and file sharing using strong cryptography. Features user authentication, encrypted file transfer, and a modern web UI."
  },
  {
    id: "ai-agent-disaster",
    title: "AI Agent for Disaster Resource & Volunteer Allocation",
    description: "AI agent to optimize allocation of resources and volunteers during disasters.",
    tech: ["Python", "AI", "Optimization", "Multi-Agent Systems"],
    icon: "/icons8-disaster-48.png",
    links: {
      github: "https://github.com/sahariq/AI-Agent-for-Disaster-Resource-and-Volunteer-Allocation"
    },
    role: "AI Developer",
    details: "Designed and implemented an AI agent that uses optimization techniques to allocate resources and volunteers efficiently in disaster scenarios."
  },
  {
    id: "digixtech",
    title: "DigiXTech",
    description: "A digital technology platform for modern business solutions.",
    tech: ["JavaScript", "React", "Node.js", "Web"],
    icon: "/icons8-cloud-development-48.png",
    links: {
      github: "https://github.com/sahariq/DigiXTech"
    },
    role: "Fullstack Developer",
    details: "Developed a digital platform offering a suite of business tools and integrations for digital transformation."
  },
  {
    id: "watch-party",
    title: "Watch Party",
    description: "A web app for synchronized video watching with friends.",
    tech: ["JavaScript", "WebRTC", "Node.js", "React"],
    icon: "/icons8-movie-48.png",
    links: {
      github: "https://github.com/sahariq/watch-party"
    },
    role: "Frontend Developer",
    details: "Built a real-time platform for group video watching, chat, and media synchronization."
  },
  {
    id: "movie-recommender",
    title: "Movie Recommender",
    description: "A machine learning-based movie recommendation system.",
    tech: ["Python", "Machine Learning", "Flask", "Recommender Systems"],
    icon: "/icons8-movie-48 (1).png",
    links: {
      github: "https://github.com/sahariq/movie_recommender"
    },
    role: "ML Engineer",
    details: "Implemented collaborative filtering and content-based algorithms to recommend movies to users."
  },
  {
    id: "iqbal-cardiocare",
    title: "Iqbal CardioCare",
    description: "A healthcare web app for cardiac patient management.",
    tech: ["JavaScript", "React", "Node.js", "Healthcare"],
    icon: "/icons8-doctor-48.png",
    links: {
      github: "https://github.com/sahariq/iqbal-cardiocare",
      demo: "https://iqbal-cardiocare.vercel.app"
    },
    role: "Fullstack Developer",
    details: "Created a platform for managing cardiac patient data, appointments, and analytics for healthcare providers."
  }
]
