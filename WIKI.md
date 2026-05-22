# Workshift Landing Page — Project Wiki

> **Last updated**: 2026-04-28
> **Stack**: Vite 7 + React 19 + Tailwind CSS 4 + Framer Motion + GSAP + Lenis

## Core Philosophy

**"Outcome-First, Agent-Compatible Architecture"**. Data-driven UI components routed through React Router v7 with a stateless backend (Vercel Functions + Resend API). No database. All state lives in HMAC tokens and Resend's audience API.

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  App.jsx (HashRouter)                            │
├─────────────────────────────────────────────────┤
│  Home Route  │  ServicePage  │  BlogPages        │
│  /           │  /service/:id │  /blog, /blog/:slug│
├──────────────┴───────────────┴───────────────────┤
│  Components                                       │
│  HeroTypographic → InteractiveServicesBento       │
│  → Kontakt → Newsletter → Footer                 │
├──────────────────────────────────────────────────┤
│  Data Layer: src/data/services.js + blogPosts.js  │
├──────────────────────────────────────────────────┤
│  Backend: Vercel Functions (/api/*)               │
│  send-email → subscribe-newsletter                │
│  → confirm-newsletter → resend-webhook            │
├──────────────────────────────────────────────────┤
│  Analytics: Vercel (cookieless) + GA4/Clarity     │
│  Block-by-default, loaded after consent           │
└──────────────────────────────────────────────────┘
```

## Frontend

### Components (`src/components/`)
- **HeroTypographic.jsx** — Split-text reveal with GSAP
- **InteractiveServicesBento.jsx** — Service grid with deep-linking, expand/collapse
- **ContactSection.jsx** — Form with RODO checkbox, submits to `/api/send-email`
- **NewsletterSection.jsx** — Subscribe form → `/api/subscribe-newsletter`
- **ConsentBanner.jsx** — Cookie consent: block-by-default, 3 consent paths, re-openable
- **FloatingWhatsApp.jsx** — WhatsApp CTA button
- **LenisProvider.jsx** — Smooth scrolling wrapper
- **HeroParticleSphere.jsx** — WebGL particle background
- **ScrollScatterSection.jsx** — GSAP scroll-triggered scattered elements
- **TestimonialsSection.jsx** — Client testimonials with photos
- **DataMetricsSection.jsx** — Animated stat counters
- **IndustriesSection.jsx** — Industry cards with images
- **ProcessSection.jsx** — "Jak to działa" workflow steps
- **AboutUsSection.jsx** — Team section with photos

### Pages (`src/pages/`)
- **BlogListPage.jsx** — List of blog posts from `src/data/blogPosts.js`
- **BlogPostPage.jsx** — Individual blog post with meta tags
- **ServicePage.jsx** — Service detail with SEO metadata, redirect logic
- **PrivacyPolicyPage.jsx** — Privacy policy
- **ThankYouPage.jsx** — Post-DOI confirmation page
- **NotFoundPage.jsx** — Custom 404 (sage bg, lime pill, translucent "404" watermark)

### Data files (`src/data/`)
- **services.js** — Array of service objects (id, title, description, icon, details, bento metadata)
- **blogPosts.js** — Array of blog posts (slug, title, category, excerpt, content as HTML)

## Backend

### Resend API Integration (`api/`)
All serverless functions under `/api/*` (Vercel Functions, Node.js runtime).

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `send-email.js` | POST | `{name, email, phone?, company?, message, rodoConsent}` | Sends email via Resend with idempotency |
| `subscribe-newsletter.js` | POST | `{email}` | Sends DOI confirmation email with HMAC link |
| `confirm-newsletter.js` | GET | `?token=...` | Verifies HMAC token, adds to Resend audience, sends welcome email, 302 redirect |
| `resend-webhook.js` | POST | Svix-signed payload | Validates signature, logs events |

### DOI Flow (Stateless)
```
User submits email
  → subscribe-newsletter.js
    → signToken({email, exp: now+24h})
    → send DOI email with confirmation URL
User clicks link
  → confirm-newsletter.js
    → verifyToken(token) via crypto.timingSafeEqual
    → resend.contacts.create({email, audienceId})
    → send welcome email (net-new only, skip on 422)
    → 302 redirect to /#dziekuje-za-zapis
```

### Email Templates
- **Welcome email** (`api/_lib/welcomeEmail.js`): Table-based HTML (Outlook compat), hero card with avatar, 3 latest blog posts, deliverability callout, CTA to contact form. Polish typography (hyphen not em-dash).
- **Contact notification**: Plain HTML with sender details.

## Analytics

### Cookieless (always-on)
- **Vercel Analytics** — page views, traffic sources, custom events
- **Vercel Speed Insights** — Core Web Vitals (RUM)

### Cookied (consent-gated)
- **Google Analytics 4** (`G-B6VJVVFPLR`) — loaded after consent
- **Microsoft Clarity** (`wifxjjszyz`) — heatmaps + session recordings

### Custom Events (`src/lib/analytics.js`)
| Event | Attributes |
|-------|------------|
| `contact_form_submit` | `hasCompany`, `messageLength` |
| `newsletter_signup` | `stage: doi_sent` |
| `whatsapp_click` | `source: floating_button` |
| `calendar_open` | `source: cta_section` |
| `service_card_click` | `serviceId`, `position` |
| `blog_read_complete` | `slug`, `category` |

### Consent Banner (`src/components/ConsentBanner.jsx`)
- Block-by-default: GA4 + Clarity removed from `index.html`, loaded via `src/lib/consent.js`
- Bottom-left fixed, max-w 420px, compact layout
- 3 paths: "Zgoda" / "Tylko niezbędne" / "Wybierz co" (granular toggles)
- Re-openable via "Ustawienia cookies" footer link
- `CONSENT_VERSION = 1` — bump on new categories

## DNS & Infrastructure

- **Domain**: workshift.pl (Cyberfolks for email, Vercel for hosting)
- **MX**: `s148.cyber-folks.pl` (direct, not via wildcard)
- **SPF**: `include:_spf.resend.com`
- **SPA fallback**: `vercel.json` rewrites `/(.*) → /index.html`
- **Critical fix (2026-04-27)**: Vercel ALIAS `*` wildcard killed mail delivery → changed MX to explicit server

## Design System

- **Colors**: Dark (#0a0a0a-base) + Lime green accent (#a3ff12 or similar)
- **Typography**: System fonts, Polish hyphenation standards
- **Brand**: Full asset set in `public/brand-assets/` (SVG + PNG for dark/light/icon)
- **Favicon**: Multi-size set (16-512px) + SVG + site.webmanifest
- **Design docs**: `DESIGN.md`, `BRAND.md`, `BRAND.pdf`

## Development Notes

### Gotchas
- **Vite `public/` directory**: Files served from `/` (not `/public/`). Paths in code: `/blog/img.png` not `/public/blog/img.png`.
- **Em-dashes**: Use standard hyphens `-` in CSS pseudo-elements to avoid encoding issues.
- **No PHP on Vercel**: PHP files in `public/` are dead code from the Brevo era — served as static assets, return 405 on POST.
- **HashRouter**: React Router uses hash routing (`/#/path`) for Vercel static hosting compatibility.

### Session Workflow
1. `npm run dev` → local dev at localhost
2. Make changes in `src/`
3. Verify with browser
4. Build: `npm run build` + `npm run preview`
5. Deploy: push to `main` → auto-deploy on Vercel

### Related Resources
- `/Users/kuba/Projekty/workshift-landing/AGENT_CONTEXT.md` — Quick agent reference
- Obsidian wiki: [[workshift-landing]] — Full project context with concepts
- Related concepts: [[stateless-hmac-doi]], [[vercel-spa-fallback]], [[vercel-dns-wildcard-mail-trap]], [[resend-api]]
