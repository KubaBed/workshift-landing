# Workshift Landing Page

## Project Overview
A React + Vite landing page for Workshift, featuring animated sections, GSAP/Framer Motion animations, Three.js visuals, and Tailwind CSS v4 styling.

## Tech Stack
- **Framework**: React 19 with Vite 7
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Animation**: Framer Motion, GSAP
- **3D**: Three.js
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure
- `src/` - React source files
  - `components/` - All page section components (Hero variants V1-V5 + active HeroTypographic C, About, Contact, etc.)
    - `HeroTypographic.jsx` - **Active main hero** (Variant C: split layout, word-reveal animation, stats)
    - `HeroParticleSphere.jsx` - Three.js particle sphere used by HeroTypographic
  - `components/ui/` - Reusable UI components (Logo, GradientDivider)
  - `App.jsx` - Main app component
  - `main.jsx` - Entry point
  - `index.css` - Global styles
- `public/` - Static assets (images, AI icons, video)
- `files/` - SVG assets
- `workshift-logo-export/` - Brand logo assets (SVG, PNG in various sizes)
- `workshift-visual-brand-bible.html` - Visual brand guide

## Development
- Run: `npm run dev` (port 5000)
- Build: `npm run build`

## Deployment
- Type: Static site
- Build command: `npm run build`
- Output directory: `dist`
