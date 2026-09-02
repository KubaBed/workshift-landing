# Workshift — AI Automation Agency Landing Page

High-conversion landing page for **Workshift**, an AI Automation Agency.

## Tech Stack

Vite 7, React 19, React Router v7, Tailwind CSS 4, Framer Motion, GSAP, Lenis, Vercel Functions, Resend API

## Features

- **Conversion-optimized**: WhatsApp, contact form, newsletter with double opt-in
- **Analytics**: Vercel Analytics + GA4 + Microsoft Clarity (RODO-compliant consent banner)
- **Content**: Service bento grid, blog engine, industry cards, testimonials
- **Auto-deploy**: Push to `main` → Vercel production

## Getting Started

```bash
npm install
npm run dev
```

## Repo Layout

```
src/            app source (React, Tailwind tokens in src/index.css)
api/            Vercel Functions (Resend mail, newsletter DOI, offers, Meta CAPI)
public/         served assets (fonts, brand-assets, blog images, prompty-data)
scripts/        build (SEO head/body per route, sitemap) + data/PDF generators
  marketing/    Meta API + social scripts (one-off / dormant)
emails/         react-email templates
lead-magnets/   PDF builders for lead magnets and client offers
docs/brand/     BRAND.en.md, BRAND.pdf, design-system.css, DESIGN.md
docs/seo/       keyword map and SEO/AEO plans
docs/plans/     feature plans
docs/internal/  campaign plans, handoffs, sales notes   (gitignored)
offers/         client offer sources and generated PDFs (gitignored)
assets/blog/    Canva-side blog assets
assets/print/   business cards                          (gitignored)
_archive/       brand v1, reference only
BRAND.md        the normative brand book
```

## Project Docs

- `AGENT_CONTEXT.md` — Agent reference with full architecture
- `WIKI.md` — Development wiki with component/API documentation
- `CLAUDE.md` — Project context for AI assistants
- `docs/brand/DESIGN.md` — Design system specification
- `BRAND.md` — Brand guidelines
