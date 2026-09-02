# Agent Context: workshift-landing

> **Last updated**: 2026-08-30
> **Project**: High-conversion landing page for Workshift — AI Automation Agency
>
> **📌 Aktywny handoff (2026-07-13):** kampania „Mikro-audyt AI" + posty social z bloga —
> stan, ID kont Meta, skrypty i następne kroki opisane w
> [`HANDOFF-2026-07-13-kampania-social.md`](HANDOFF-2026-07-13-kampania-social.md).
> Przeczytaj go przy wznawianiu tematu kampanii/social.

---

## 1. Project Goal

Premium landing page for **Workshift** (AI Automation Agency). Focus: outcome-based messaging, dark aesthetic with lime-green accents, direct conversion paths (WhatsApp, contact form, newsletter).

## 2. Tech Stack

### Core
- **Vite 7** + **React 19** + JSX (no TypeScript)
- **React Router v7** (BrowserRouter - prawdziwe ścieżki, nie `/#/`; na tym stoi SEO)
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
| `npm run seo:html` | Sam post-build SEO (bez `vite build`) - szybki test generatora |

> `npm run build` = `vite build` + `scripts/build-seo-html.mjs`. Ten drugi krok jest
> **obowiązkowy** - bez niego każdy URL dostaje ten sam `<head>` i pustą treść dla crawlerów.
> Build **przerywa się**, gdy tytuł trasy przekroczy 60 znaków (dopisz `seoTitle` do wpisu).

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
- **Favicon**: `favicon-96x96.png` + `favicon.svg` + `apple-touch-icon.png` + site.webmanifest
- **Design system**: `BRAND.md` (normatywny), `docs/brand/DESIGN.md`, `docs/brand/design-system.css`

## 8. Git History (recent)

```
78f28e8 Merge PR #12: fix(seo) - treść i linki w fallbacku + krótsze tytuły
630344f fix(seo): fallback z realnej treści strony, 0 orphanów, tytuły <= 60 znaków
55877ed feat(seo): treść per trasa w statycznym fallbacku + czystka pauz
55ea06b feat(seo): meta i canonical per trasa + generowana sitemapa
7b414f4 feat: /showcase, wpisy bloga i wariant pion
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
- [x] **Cleanup PHP files** - done 2026-05-03 (`f02ee6c`) + `config.env.php`/`.htaccess` 2026-09-03
- [ ] **Cleanup DNS**: old `send` TXT (Amazon SES) + `send` MX in Vercel DNS
- [ ] **Optional**: change `RESEND_FROM_EMAIL` to `formularz@workshift.pl`
- [ ] **Newsletter content**: add `src/data/newsletterIssues.js` for regular editions
- [ ] **"Klienci" section**: case study component
- [ ] **Opis `/uslugi/kreacje`**: najkrótsze copy w serwisie (291 wyrazów w fallbacku wobec
      320-412 na pozostałych usługach). Audyt tego nie zgłasza, ale to najsłabsza strona usługi -
      fix to rozszerzenie `expandedDescription` / `innerCards` w `services.js`, fallback pójdzie za tym

> **ROI Calculator** - zrobione, `/kalkulator` (`src/pages/KalkulatorStratPage.jsx`,
> dane w `src/data/kalkulator.js`).

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
