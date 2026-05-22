# Agent Context: workshift-landing

> **Last updated**: 2026-04-28
> **Project**: High-conversion landing page for Workshift — AI Automation Agency

---

## 1. Project Goal

Premium landing page for **Workshift** (AI Automation Agency). Focus: outcome-based messaging, dark aesthetic with lime-green accents, direct conversion paths (WhatsApp, contact form, newsletter).

## 2. Tech Stack

### Core
- **Vite 7** + **React 19** + JSX (no TypeScript)
- **React Router v7** (HashRouter)
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Framer Motion** + **GSAP** + **Lenis** (animations)
- **shadcn/ui** components (via `components.json`)

### Backend (Vercel Serverless)
- **Resend API** — transactional email + newsletter audience management
- **Vercel Functions** — `/api/*.js` (Node.js runtime)
- Stateless HMAC-based double opt-in (no DB)

### Analytics (block-by-default consent model)
- **Vercel Analytics** + **Speed Insights** — cookieless, always-on
- **Google Analytics 4** (`G-B6VJVVFPLR`) — cookied, loaded after consent
- **Microsoft Clarity** (`wifxjjszyz`) — cookied, loaded after consent
- **Custom events**: `contact_form_submit`, `newsletter_signup`, `whatsapp_click`, `calendar_open`, `service_card_click`, `blog_read_complete`
- **RODO consent banner**: 3 ścieżki (zgoda/tylko niezbędne/wybierz), re-openable via footer link

### Dev
- ESLint, Puppeteer (screenshots), Python scripts (brand PDF, carousel)

## 3. Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## 4. Architecture

```
src/
├── App.jsx              # Router + layout
├── components/
│   ├── HeroTypographic.jsx
│   ├── InteractiveServicesBento.jsx
│   ├── ContactSection.jsx
│   ├── NewsletterSection.jsx
│   ├── ConsentBanner.jsx   # Cookie consent (block-by-default)
│   ├── LenisProvider.jsx    # Smooth scroll
│   └── ...
├── pages/
│   ├── BlogListPage.jsx
│   ├── BlogPostPage.jsx
│   ├── ServicePage.jsx
│   ├── PrivacyPolicyPage.jsx
│   ├── ThankYouPage.jsx
│   └── NotFoundPage.jsx
├── data/
│   ├── services.js      # Service definitions
│   └── blogPosts.js     # Blog content
├── lib/
│   ├── analytics.js     # Custom event tracking
│   └── consent.js       # Dynamic script loading
├── utils/
│   ├── cn.js            # Tailwind class merging
│   └── webgl.js
api/
├── send-email.js           # Contact form → Resend (POST)
├── subscribe-newsletter.js # Newsletter signup → DOI email (POST)
├── confirm-newsletter.js   # DOI token verify → Resend audience (GET)
├── resend-webhook.js       # Svix-verified event webhook
└── _lib/
    ├── doi.js              # signToken / verifyToken (HMAC-SHA256)
    └── welcomeEmail.js     # Welcome email builder (table-based, Outlook compat)
```

## 5. API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/send-email` | Contact form → resend.emails.send() |
| POST | `/api/subscribe-newsletter` | Newsletter → DOI email with HMAC token |
| GET | `/api/confirm-newsletter?token=...` | Verify DOI token → resend.contacts.create() → welcome email → redirect 302 |
| POST | `/api/resend-webhook` | Resend events (svix signature verification) |

### Key design decisions
- **Stateless DOI**: No database. Token = `base64url(JSON{email,exp}).hexHMAC`. 24h expiry. Verified via `crypto.timingSafeEqual`.
- **Idempotency**: `contact-form/{email}/{timestamp}` (contact), `welcome/{email}` (welcome mail). Resend 422 "contact exists" = success.
- **Welcome email only for net-new contacts** — skip when Resend returns 422.
- **SPA fallback**: `vercel.json` rewrites `/(.*)` → `/index.html`. Vercel route priority ensures `/api/*` resolves to serverless.

## 6. Email & DNS

- **From**: `kontakt@workshift.pl` (Cyberfolks hosting, email only)
- **Resend sender**: verified domain `workshift.pl`
- **DNS fix (2026-04-27)**: Vercel wildcard ALIAS `*` killed MX → `mail.workshift.pl` → changed MX to `s148.cyber-folks.pl`
- **SPF**: `include:_spf.resend.com`

## 7. Design

- **Color scheme**: Dark background (#0a0a0a range), lime green (#a3ff12 or similar) accents
- **Typography**: System fonts, Polish typography rules (hyphen `-` not em-dash `—` per PWN)
- **Brand assets**: `public/brand-assets/` (logos in dark/light/icon variants)
- **Favicon**: Full set (16-512px) + SVG + site.webmanifest
- **Design system**: `DESIGN.md`, `BRAND.md`, `design-system.css`

## 8. Git History (recent)

```
8904c33 fix(analytics): update Clarity tag ID
d1259e5 refactor(welcome-email): bigger hero, deliverability ask, PL typography
d5d3169 fix(welcome-email): avatar + image padding
e695dc4 feat(newsletter): welcome email with 3 latest blog posts
c6e734b refactor(consent): tighter copy, compact layout
d5b20d2 feat(consent): RODO cookie banner block-by-default
42686c8 feat(analytics): Vercel Analytics + Speed Insights + GA4 + Clarity
e0862a4 fix(api): contact form multi-recipient + emailId logging
2d713db fix: SPA fallback + 404 page
53618a3 feat: migrate email/newsletter from PHP to Resend serverless
```

## 9. Open Items

- [ ] **Verify analytics**: hard reload + accept consent → check GA4 Realtime (10-30s) + Clarity (30min-2h)
- [ ] **Cleanup PHP files**: `public/send_email.php`, `public/subscribe_newsletter.php`, `public/confirm_newsletter.php` — dead code
- [ ] **Cleanup DNS**: old `send` TXT (Amazon SES) + `send` MX in Vercel DNS
- [ ] **Optional**: change `RESEND_FROM_EMAIL` to `formularz@workshift.pl`
- [ ] **Newsletter content**: add `src/data/newsletterIssues.js` for regular editions
- [ ] **ROI Calculator**: interactive savings calculator on landing page
- [ ] **"Klienci" section**: case study component

## 10. Environment Variables

Required in `.env.local` (gitignored):
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`
- `RESEND_FROM_EMAIL`
- `RESEND_NOTIFY_TO`
- `RESEND_DOI_SECRET`
- `RESEND_CONFIRM_URL`
- `RESEND_DOI_REDIRECT_URL`
- `RESEND_WEBHOOK_SECRET`
