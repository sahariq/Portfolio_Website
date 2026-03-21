# Portfolio Website

This is a Windows 11–inspired portfolio website built with Next.js, React, and TypeScript. It features a desktop-like interface, multiple app windows, and a modern design to showcase your projects, resume, and more.

## Features
- Windows 11–style desktop UI
- Multiple app windows (About, Projects, Notepad, PDF Viewer, File Explorer, Terminal, etc.)
- Resume PDF viewer and download
- Project showcase with images and links
- Theming and responsive design

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- pnpm (or npm/yarn)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sahariq/Portfolio_Website.git
   cd Portfolio_Website
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   pnpm run dev
   # or
   npm run dev
   # or
   yarn dev
   ```
4. Open your browser at [http://localhost:3000](http://localhost:3000)

## Project Structure
- `app/` — Next.js app directory (pages, API routes)
- `components/` — Reusable UI and app components
- `apps/` — App window implementations (About, Projects, Notepad, etc.)
- `public/` — Static assets (images, icons, resume PDF)
- `lib/` — Utility functions and app data
- `store/` — Zustand stores for state management
- `styles/` — Global and custom CSS

## Deployment
This project is ready to deploy on Vercel. Set the root directory to the project root (where `package.json` is located).

## Customization
- Update your resume PDF in the `public/` folder and ensure the filename matches the code reference.
- Edit app content and add your own projects in `lib/projects.ts`.
- Customize themes and icons in the `public/` and `components/` folders.

## License
MIT

---

Created by Sahar Iqbal Malik.