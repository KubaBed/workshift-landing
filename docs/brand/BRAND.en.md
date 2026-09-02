# Workshift - Brand Book & Design System (EN)

> **English edition** of [`BRAND.md`](BRAND.md). Version **2.0** · July 2026.
>
> ⚠️ **The Polish edition is normative.** This translation exists so that non-Polish-speaking
> designers, contractors and agencies can work with the system. Where the two disagree,
> `BRAND.md` wins - and the disagreement is a bug, so please report it.
>
> **Brand copy is NOT translated.** Taglines, headlines, forbidden phrases and tone-of-voice
> examples appear in Polish verbatim, with an English gloss in *italics* underneath or in
> brackets. Those strings are approved brand assets; an English paraphrase of them is not.
> Workshift sells into the Polish SME market - all customer-facing copy ships in Polish.
>
> **Order of truth when sources conflict:**
> 1. `src/index.css` (`@theme` + `:root`) - colour, radius and font tokens. Changing a colour? Only here.
> 2. `public/brand-assets/` - logo files. Changing the logo? Only here.
> 3. **`BRAND.md`** - rules, meanings, tone of voice, everything the code cannot express.
> 4. This file - the English mirror of #3.

---

## Table of contents

0. [TL;DR for AI agents](#0-tldr-for-ai-agents)
1. [Brand](#1-brand)
2. [Logo](#2-logo)
3. [Visual identity](#3-visual-identity)
4. [UI components](#4-ui-components)
5. [Tone of voice](#5-tone-of-voice)
6. [Marketing materials](#6-marketing-materials)
7. [Paid campaigns](#7-paid-campaigns)
8. [File map](#8-file-map)

---

## 0. TL;DR for AI agents

The compressed version. Enough for 90% of tasks - drop down for detail.

**Brand:** boutique AI consulting for Polish SMEs. Jakub Bednarz, Poznań, kontakt@workshift.pl.
**Tagline:** „Wdrażamy AI, które po prostu działa" *(We deploy AI that simply works)*.
**Trueline (internal, never customer-facing):** „Przebudowa bez burzenia" *(Remodel without demolition)*.

**Palette - these colours only:**
`#E6E8DD` sage (background) · `#9CE069` lime (accent/CTA) · `#000000` black (text and dark sections) · `#595959` muted-dark · `#AAAAAA` muted-light · `#FFFFFF` white cards · `#DD453D` errors.

**Typefaces - only two:** Inter (everything) + IBM Plex Mono (numbers and technical labels only). Self-hosted from `public/fonts/`.

**The six rules people break most often:**
1. **Headings are `font-weight: 400`**, not bold. Bold is reserved exclusively for the logo wordmark.
2. **One lime accent per view.** Lime means action. Several limes means visual noise and zero hierarchy.
3. **Background: sage or black or white - never mixed within one graphic.**
4. **Typography: always the hyphen `-`, never an em dash `—` or en dash `–`.** Applies to UI, email, documents and copy. Normalise text coming from an LLM or a database at render time.
5. **Outcome, not technology.** The client buys „a first line of support that works at 3am", not „an AI agent".
6. **A concrete number beats an adjective.** `18.7%` beats „almost 20%", which beats „significantly".

> Rule 4 is a Polish typographic convention the founder applies across everything the brand ships. Keep it in English-language material too, so the two editions stay consistent.

**FORBIDDEN (legacy, removed in system v1.0):** orange `#ee703d`, navy `#0A2540`, rose `#cc7cab`, violet `#8530d1`, the Satoshi typeface, the Plus Jakarta Sans typeface.
**FORBIDDEN (AI clichés):** robots, brains, chips, neural networks, blue-purple "tech" gradients, stock photos of smiling businesspeople.

---

## 1. Brand

### Who we are

**Workshift** is boutique AI consulting for Polish SMEs. Not technology for show - concrete results without year-long transformations.

- **Founder:** Jakub Bednarz
- **Contact:** kontakt@workshift.pl | Poznań, Poland
- **Tagline (external):** „Wdrażamy AI, które po prostu działa"
  *We deploy AI that simply works*
- **Trueline (internal, keep out of customer-facing material):** „Przebudowa bez burzenia"
  *Remodel without demolition*

### Onliness statement

> Workshift is the only AI implementation firm in Poland that **shifts the process rather than overturning it** - delivering SMEs measurable results in weeks, not months.

This sentence is the positioning test: if a piece of marketing could be signed with a competitor's name without changing its meaning, rewrite it.

### Mission

> „Wdrażamy pragmatyczne innowacje AI dla ambitnych polskich MŚP."
> *We deploy pragmatic AI innovation for ambitious Polish SMEs.*

### Brand values

| # | Value | What it means in practice |
|---|-------|---------------------------|
| 1 | **Pragmatism** | No buzzwords. Only solutions that work on Monday morning |
| 2 | **Measurable results** | Always concrete numbers (+32% of time, 45+ hours per month) |
| 3 | **Simple deployment** | No chaos, no downtime, no year-long projects |
| 4 | **Knowledge transfer** | We leave knowledge behind, not dependency. The client can run it alone |
| 5 | **A human approach** | We understand the business first; technology is the instrument |

### Target audience

**Owners and decision-makers at Polish SMEs (6-150 employees), aged 30-60.** Not developers, not IT specialists.

Priority sectors:
- Law firms, accounting practices, consultancies
- E-commerce
- Manufacturing and logistics
- B2B services and agencies (recruitment, marketing), HR departments

**The pains they live with:** re-typing data between systems by hand, illegible document scans transcribed manually, repetitive customer questions, slow first response to enquiries, reports glued together in Excel over days, the belief that automation is expensive.

**What they are looking for:** time savings, lower operating costs, an edge over competitors - without technology risk.

> **Insight from campaign v1 (July 2026):** the strongest response came from **women aged 35-54** - owners, office managers, head bookkeepers - on the Reels placement. The 55-64 segment was the cheapest. Do not extrapolate this to other channels without your own data.

### Services

1. **Process automation** - integrating the tools the company already owns into a single workflow
2. **AI audit and strategy** - identifying lost time, typically ~32% recoverable
3. **AI training** - prompt engineering, AI safety, GenAI tooling
4. **AI agents** - an automated 24/7 first line of support
5. **AI ad creative** - hundreds of creatives in days instead of months

Model: **à la carte** - every service available on its own.
**Lead offer:** a free 30-minute diagnostic call.

---

## 2. Logo

### 2.1 Meaning - why it looks like this

The mark is **three slanted parallelograms stacked vertically**. The middle one is shifted to the right and is the only one filled with full colour.

> Three layers = the client's processes.
> The middle one shifts = our intervention.
> The rest stays put = zero downtime.

The logo is a visual promise of the brand - the same message as the trueline, „remodel without demolition". Knowing this metaphor is mandatory when designing material: a layered composition with exactly one displaced element is our primary visual motif, not just the logo.

### 2.2 Construction

Geometry (viewBox `0 0 512 512`), identical across all variants:

```
top    polygon: 141,141  371,141  333,205  103,205   → muted fill
middle polygon: 192,237  422,237  384,301  154,301   → accent fill
bottom polygon: 141,333  371,333  333,397  103,397   → muted fill
```

**Middle bar - accent gradient (mandatory):**
`linear-gradient(90deg, #9CE069 0%, #81c44e 100%)`

**Top and bottom bars - muted, depending on the background:**

| Background | Top and bottom fill | Wordmark |
|---|---|---|
| Light (sage / white) | `#000000` at opacity `0.15 → 0.05` | `#000000` |
| Dark (black) | `#FFFFFF` at opacity `0.30 → 0.10` | `#FFFFFF` |

**Wordmark:** "Workshift", Inter 700, `letter-spacing: -0.04em`, mixed case.

### 2.3 Variants and files

| Variant | File | Size |
|---|---|---|
| Lockup on light | `public/brand-assets/logo-light.{svg,png}` | 1200×400 |
| Lockup on dark | `public/brand-assets/logo-dark.{svg,png}` | 1200×400 |
| Mark alone | `public/brand-assets/logo-icon.{svg,png}` | 512×512 |
| Favicon | `public/favicon.svg` + `favicon-96x96.png`, `favicon.ico`, `apple-touch-icon.png` | - |

Package for external parties (agencies, partners): `public/Workshift_Brand_Assets.zip`.

> **Note on the duplicate:** the `Workshift_logo/` directory in the project root holds the same three SVGs under Polish filenames. Verified: identical geometry and identical colours. It is a working export, **not** a separate brand version - always edit `public/brand-assets/` and regenerate from there.

### 2.4 Usage rules

- **Clear space:** at least the height of the letter "W" on every side (roughly 50% of the mark's width).
- **Minimum size:** 24px for the mark alone, 32px for the lockup with wordmark, 120px wide for the full lockup in print.
- **Placement on graphics:** top-left or bottom-left corner, minimum 20px margin.

**Prohibited:**
- Do not stretch the proportions, do not rotate
- Do not change the slant angle of the parallelograms
- Do not move the top or bottom bar - **only** the middle one is displaced, and that is the entire point of the mark
- Do not replace the middle bar's gradient with a flat colour or a different gradient
- Do not add gradient, shadow, outline, glow or 3D to the **wordmark** - the wordmark is always flat, black or white
- Do not place the logo over a busy background without a contrasting plate beneath it

> **Clarification versus v1.x of this document:** an earlier version carried the rule "do not use a gradient on the logo", which contradicted the production files. Correctly: **the lime gradient is an integral part of the mark**; the prohibition covers the wordmark and the addition of any other gradient.

---

## 3. Visual identity

### 3.1 Colour palette

Every value below is synchronised with `src/index.css`. Changing a colour means changing the token there, not hard-coding it in a component.

#### Core colours

| Name | Token (`@theme`) | Hex | Use |
|------|------------------|-----|-----|
| **Sage** | `--color-sage` | `#E6E8DD` | Default page, section and card background |
| **Lime** | `--color-lime` | `#9CE069` | CTA, buttons, focus ring, highlight, text selection |
| **Lime Deep** | *(SVG only)* | `#81c44e` | The second gradient stop in the mark, nothing else |
| **Dark** | `--color-dark` | `#000000` | Headings, body copy, dark sections |
| **Muted Dark** | `--color-muted-dark` | `#595959` | Secondary descriptions, metadata |
| **Muted Light** | `--color-muted-light` | `#AAAAAA` | Placeholders, captions, disabled elements |
| **White** | *(no token)* | `#FFFFFF` | Cards and modals on sage |
| **Destructive** | `--destructive` | `#DD453D` | Errors, alerts, destructive actions |

#### Semantic layer (shadcn, `:root`)

The project uses shadcn/ui, so a semantic layer sits alongside the brand tokens. **UI components reference the semantic layer, not raw hex values.**

| Variable | Value | Variable | Value |
|---|---|---|---|
| `--background` | `#E6E8DD` | `--primary` | `#9CE069` |
| `--foreground` | `#000000` | `--primary-foreground` | `#000000` |
| `--card` / `--popover` | `#FFFFFF` | `--accent` | `#9CE069` |
| `--secondary` | `#FFFFFF` | `--destructive` | `#DD453D` |
| `--muted` / `--muted-foreground` | `#595959` | `--ring` | `#9CE069` |
| `--border` / `--input` | `rgba(0,0,0,0.2)` | `--radius` | `10px` |

#### Legacy aliases - do not use in new code

`@theme` still carries names from the previous system, remapped onto the current palette purely for backwards compatibility. **The names lie - `accent-rose` and `accent-violet` are greens.**

| Alias | Actual hex | Use instead |
|---|---|---|
| `--color-alabaster` | `#E6E8DD` | `--color-sage` |
| `--color-navy`, `--color-navy-dark` | `#000000` | `--color-dark` |
| `--color-accent` | `#9CE069` | `--color-lime` |
| `--color-accent-light` | `#b8ec92` | light lime - tag backgrounds, hover |
| `--color-accent-rose` | `#c5e0a8` | warm green - illustrations |
| `--color-accent-violet` | `#d4e8c4` | cool green - illustrations |
| `--color-accent-purple` | `#7bc44a` | dark lime - active states, icons |

#### Which colour, when

| Situation | Colour |
|-----------|--------|
| Page / section background (default) | Sage `#E6E8DD` |
| Contrasting section | Black `#000000` |
| Primary CTA button | Lime `#9CE069` |
| Heading and body text | Black `#000000` |
| Secondary text | Muted Dark `#595959` |
| Labels, captions | Muted Light `#AAAAAA` |
| Card / modal on sage | White `#FFFFFF` |
| Highlight / selection | Lime `#9CE069` with black text |
| Error / alert | Destructive `#DD453D` |

> **Forbidden:** orange `#ee703d`, navy `#0A2540`, peach `#f5a273`, rose `#cc7cab`, lilac `#d5a4e7`, violet `#8530d1`, chartreuse `#D2FF00`. That is the legacy palette - if you see it in a file, the file is out of date.
>
> **The one approved exception:** the `#A78BFA → #8530D1` gradient in [InteractiveServicesBento.jsx:543](src/components/InteractiveServicesBento.jsx:543). It is one of eight **mock creatives for other brands** inside a service demo, not a Workshift brand surface. Founder's decision, commit `321c051`. Do not widen this exception and do not copy those values anywhere else.

---

### 3.2 Typography

#### Typefaces

| Role | Typeface | Use |
|------|----------|-----|
| **Primary (sans + display)** | Inter | Headings H1-H6, body, UI, navigation, wordmark |
| **Mono** | IBM Plex Mono | Numbers, metrics, step numbers and technical labels only |

> **Why a single typeface?** Inter is expressive enough on its own. A consistent typeface gives the brand calm and professionalism - two different sans-serifs are visual noise.

**Loading:** the fonts are **self-hosted** as woff2 from `public/fonts/` (`inter-latin`, `inter-latin-ext`, `plex-mono-{400,500}-latin{,-ext}`), with `font-display: swap` and unicode-range splitting. The `latin-ext` variants are required for Polish characters (ł ą ę ó ś ż ź ć ń). **Do not reintroduce Google Fonts** - it was render-blocking.

> **Exception:** the logo SVGs in `public/brand-assets/` carry a Google Fonts `@import` inside `<defs>`. That is deliberate - those files get opened outside the page context (agencies, editor previews). Do not copy that pattern into components.

#### Type scale

| Role | Tailwind | Size | Weight | Tracking |
|------|----------|------|--------|----------|
| Hero H1 | `text-[72px]` / `text-[96px]` | 72-96px | 400 | `-3.6px` to `-4px` |
| Section H2 | `text-4xl` / `text-5xl` | 36-48px | 400 | `tracking-tight` |
| Subsection H3 | `text-2xl` / `text-3xl` | 24-30px | 400 | `tracking-tight` |
| H4-H6 | `text-xl` / `text-lg` | 18-20px | 400 | `tracking-tight` |
| Body large | `text-lg` | 18px | 400 | normal |
| Body default | `text-base` | 16px | 400 | normal |
| Body small | `text-sm` | 14px | 400 | normal |
| Caption | `text-xs` | 12px | 400 | normal |
| Label / Nav | `text-sm` | 14px | 500 | normal |
| Mono accent | `font-mono text-sm` | 14px | 400 | normal |
| Logo wordmark | - | 20px+ | **700** | `-0.04em` |

#### Rules

- **All headings globally: `font-weight: 400`**, `tracking-tight`, colour `#000000`. Enforced in `@layer base` - do not override locally.
- The only bold in the system is the logo wordmark (700).
- Text selection (`::selection`): background `#9CE069`, text `#000000`.
- Rendering: `antialiased` globally, `font-optical-sizing: auto`.
- **Hyphen `-`, never an em dash `—` or en dash `–`.** Applies to every piece of text the brand ships.

---

### 3.3 Spacing and layout

#### Border radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 4px | Tags, badges, small elements |
| `--radius-md` | 8px | Checkboxes, xs buttons |
| `--radius-lg` / `--radius` | 10px | **Default** - buttons, inputs, cards |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 20px | Prominent sections |
| `--radius-3xl` | 24px | Large panels |
| `--radius-4xl` | 80px | Pill shapes, navigation |

#### Layout

- **Container max-width:** `1320px` (`--container-max-w`)
- **Header max-width:** `1400px`
- **Horizontal padding:** `px-6` (24px desktop) / `px-4` (16px mobile `max-md`)
- **Lower responsive bound:** 320px (iPhone SE)

#### Breakpoints (Tailwind)

| Class | Px | Device |
|-------|----|--------|
| `sm:` | 640px | Landscape phones / small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Large monitors |

---

### 3.4 Visual effects

#### Glass morphism

```
Light glass (.glass-panel):
  background: rgba(230, 232, 221, 0.7)   ← sage at 70%
  backdrop-filter: blur(24px)
  border: 1px solid rgba(0,0,0,0.1)
  box-shadow: 0 8px 32px rgba(0,0,0,0.04)

Dark glass (.glass-panel-dark):
  background: rgba(0,0,0,0.7)
  backdrop-filter: blur(24px)
  border: 1px solid rgba(255,255,255,0.1)
  box-shadow: 0 8px 32px rgba(0,0,0,0.2)
```

Use: navigation, floating cards, overlays - depth without the weight of drop shadows.

#### Gradient divider

```
linear-gradient(90deg, #9CE069 0%, #b8e88a 50%, #E6E8DD 100%)
height 3px · rounded-full · opacity 0.8
```

Separator between major page sections. Component: `GradientDivider`.

#### Gradient text

Colours `['#9CE069', '#E6E8DD', '#7bc44a']`, animated on an 8s loop.
Use: key words in the hero or in pivotal statements - sparingly, **max 1-2 per page**.

#### Layer motif

A visual echo of the logo: overlapping planes with exactly one displaced. Hero, cards, separators.
**Max 2 visual motifs at once in any one section.**

---

## 4. UI components

### 4.1 Buttons

Component: `src/components/ui/Button.jsx` - CVA variants on a BaseUI primitive.

| Variant | Appearance | When to use |
|---------|------------|-------------|
| `accent` | Lime background, black text, shadow | **Primary CTA - one per view** |
| `accent-outline` | Lime border, transparent background | Secondary CTA next to `accent` |
| `default` | Lime background (primary) | Buttons inside forms |
| `outline` | Border, muted background on hover | Secondary actions |
| `secondary` | White background | On dark backgrounds, neutral actions |
| `ghost` | No background, muted on hover | Navigation, discreet actions |
| `destructive` | Red background at 10% | Delete, revert |
| `link` | Text + underline | Inline links |

**Sizes:** `xs` 24px · `sm` 28px · `default` 32px · `lg` 36px · `icon` / `icon-sm` / `icon-lg` (square).

**Focus and accessibility:**
- Focus ring: 3px `#9CE069` at 50% opacity
- `aria-invalid`: red border and ring
- `disabled`: `pointer-events: none`, opacity 50%

### 4.2 Form fields

**Input** (`src/components/ui/input.jsx`) - height 32px (`h-8`), padding `px-2.5 py-1`, border `rgba(0,0,0,0.2)`, radius 10px, lime focus ring.

**Textarea** (`src/components/ui/textarea.jsx`) - min-height 64px (`min-h-16`), `field-sizing: content` (auto-resize), otherwise identical styling.

### 4.3 Animation

| Name | Specification | When |
|---|---|---|
| **FadeUp** | opacity 0→1, y +30px→0, 0.8s, `cubic-bezier(0.21, 0.47, 0.32, 0.98)`, IntersectionObserver `once` | Entrance of every major section. Do not stack several at once |
| **Floating** | translateY + rotate loop, easeInOutSine, 4-12s, amplitude ~12px | **Decorative background elements only.** Never on content or CTAs |
| **TextReveal** | word-by-word reveal with blur | **Hero headline only.** Not below the fold |
| **Scale / Gradient** | - | Dividers, accent bars |

**Global rules:**
- `prefers-reduced-motion` → all animation collapses to `0.01ms`
- `will-change: transform` on animated elements (GPU acceleration)
- Smooth scroll: Lenis - **do not override `scroll-behavior`**

---

## 5. Tone of voice

> Everything in this section governs **Polish-language** copy. The Polish examples are the approved assets; the English glosses are there to explain the mechanism, not to be used as copy.

### Four adjectives

**Concrete** (the language of outcomes, not technology) · **Calm** (no shouting, no FOMO, no "AI revolution") · **Partner-like** (beside the client, not above them) · **Self-assured** (we know what we are doing, without arrogance).

### Five writing rules

**1. Concrete over abstract**
Always a number, a duration, a result. Not „usprawniamy procesy" *(we improve processes)* but „odzyskujesz 32% czasu tygodniowo" *(you get 32% of your week back)*.

**2. Direct without aggression**
Short sentences. No corporate euphemisms. We speak the way you speak to a business partner, not to a lead in a CRM.

**3. We are in this game too**
First person plural („wdrażamy", „wiemy" - *we deploy, we know*). Empathy through shared experience: „Wiemy, o co toczy się gra, bo sami w nią gramy" *(We know what is at stake, because we are playing too)*. We do not lecture - we understand.

**4. Outcome, not technology**
The client does not buy „an AI agent" - they buy „a first line of support that works at 3am". In consumer-facing copy, **never name the stack**.

**5. No compromise on standards**
We do not promise miracles. We promise concrete results, transferred knowledge, no chaos. And we deliver.

### What we avoid

Left column: never write this. Right column: write this instead.

| ✗ Avoid | ✓ Instead |
|--------|-----------|
| „Rewolucjonizujemy..." *(We are revolutionising…)* | „Wdrażamy w 4 tygodnie" *(We deploy in 4 weeks)* |
| „Innowacyjne rozwiązanie AI" *(Innovative AI solution)* | „Automatyczne notatki ze spotkań" *(Automatic meeting notes)* |
| „Synergiczne podejście" *(A synergistic approach)* | *(delete it, do not substitute)* |
| „State-of-the-art modele" | „GPT-4 + Twoje dane" *(GPT-4 + your data)* |
| „Transformacja cyfrowa" *(Digital transformation)* | „Jeden workflow zamiast pięciu narzędzi" *(One workflow instead of five tools)* |
| „Skalowalna platforma" *(A scalable platform)* | *(what exactly scales? say that)* |
| „Skontaktuj się z nami" *(Contact us)* | „Zacznij od bezpłatnego audytu" *(Start with a free audit)* |
| Passive voice („czas jest oszczędzany") | Active („Ty oszczędzasz czas" - *you save time*) |

### Examples - headlines

| ✗ Weak | ✓ Strong |
|-------|----------|
| „Innowacyjne AI dla Twojej firmy" | „Wdrażamy AI, które po prostu działa" |
| „Kompleksowe rozwiązania automatyzacji" | „Koniec ręcznego przepisywania danych" |
| „Transformujemy Twój biznes z AI" | „32% czasu tygodniowo z powrotem w Twoje ręce" |
| „Zaawansowane narzędzia dla profesjonalistów" | „Kancelaria prawna: automatyczne notatki, mniej papierkologii" |
| „Skontaktuj się z nami" | „Zacznij od bezpłatnego audytu" |

*Glosses for the strong column, in order: We deploy AI that simply works · No more re-typing data by hand · 32% of your week back in your hands · Law firm: automatic notes, less paperwork · Start with a free audit.*

### Metrics - how to use them

- Always a concrete number: `+32%`, `45+ hours`, `4 weeks`, `24/7`
- Give the context: „+32% odzyskanego czasu *przy typowym wdrożeniu automatyzacji*" (*+32% of time recovered on a typical automation deployment*)
- Avoid marketing rounding: `18.7%` reads as more credible than "almost 20%"
- If the number came from a client, cite the source (case study, company)

### Language

- **Client-facing material:** Polish (website, proposals, newsletter, social media)
- **Code and technical documentation:** English
- **"AI Praktycznie" newsletter:** Polish, fortnightly, one practical process per issue
- **Context:** Polish SME reality, GDPR/RODO, Polish institution names
- **Register:** professional but human - Jakub speaks in his own voice, not through a corporate mask

---

## 6. Marketing materials

### 6.1 Production rule: creative lives in code

**Advertising graphics and video are produced in code** (HTML / Remotion → rendered via headless Chrome), using the fonts in `public/fonts/`. Canva only on explicit request.

Reason: code is versionable and repeatable, it generates variants in bulk, and it guarantees the tokens are respected. Decision of 28 July 2026, after two rejected Canva iterations.

### 6.2 Social media (LinkedIn)

**Permitted backgrounds:** sage `#E6E8DD` (consistent with the site) · black `#000000` (strong contrast) · white `#FFFFFF` (clean, document-like). **Never mix two within one graphic.**

**Accent:** lime `#9CE069` - always exactly one per graphic.

**Typography in graphics:** Inter Bold for headlines, Inter Regular for body, IBM Plex Mono for metrics and numbers.

**Formats:** post 1200×627 · square 1080×1080 · banner 1584×396.

**Tone:** one concrete insight per post (not "5 things about AI") · a number or result in the first sentence · close with a question or a CTA.

### 6.3 Presentations (pitch decks, proposals)

- **Background:** sage or white. No gradient backgrounds.
- **Accent:** lime - headings, highlights, charts. Never several accent colours at once.
- **Text:** black `#000000` / muted dark `#595959`
- **Typography:** slide H1 Inter Bold 36-48px · body Inter Regular 16-20px · metrics IBM Plex Mono or Inter Bold in lime
- **Layout:** one main point per slide, large numbers as the hero element
- **Imagery:** bright, minimal or black-and-white

### 6.4 Visual prohibitions

Never: robots · brains · chips · neural networks · blue-purple "tech" gradients · generic AI illustrations · stock photos of smiling businesspeople · neon glows · anything that reads as clip art.

---

## 7. Paid campaigns

### Creative framework: "A GDYBY TAK"

An in-house variant of PAS×BAB, approved on 20 July 2026. The Polish hook **„A GDYBY TAK..."** translates as *"WHAT IF..."* but **ships in Polish, always**:

```
1-2 sentences of the problem in the client's own words
        ↓
pivot: „A gdyby tak [promise]?"  (What if [promise]?)
        ↓
solution + CTA
```

The hook **„A GDYBY TAK..."** is the shared element across every campaign graphic - set in large type as the primary carrier of the message, with the completion of the sentence changing per creative.

### Hard rules

- **No prices in ads** (decision of 20 July 2026)
- **No stack names** in consumer-facing copy
- Lead offer: a free 30-minute diagnostic call
- Form: instant form, GDPR/RODO consent required whenever an email address is captured

> Live campaign status, copy decks and schedules live in `KAMPANIA-V2-LEADGEN.md`, `KAMPANIA-V3-KONCEPT.md` and `campaign-brief.md` (all gitignored). This document covers **brand rules** only, not campaign state.

---

## 8. File map

This section exists so nobody has to wonder again which file is current.

### ✅ Current - use these

| File | Role |
|------|------|
| `BRAND.md` | **The brand book. Normative.** |
| `docs/brand/BRAND.en.md` | This document - the English mirror of `BRAND.md` |
| `src/index.css` | **Source of truth for tokens** - `@theme` (brand) + `:root` (shadcn semantics) |
| `public/brand-assets/logo-{light,dark,icon}.{svg,png}` | **Source of truth for the logo** |
| `public/favicon.svg` + PNG/ICO variants | Favicons (the mark, lime palette) |
| `public/fonts/*.woff2` | Self-hosted Inter + IBM Plex Mono |
| `public/Workshift_Brand_Assets.zip` | Package for external parties |
| `docs/brand/design-system.css` | CSS documentation of the current system (reference, not part of the build) |
| `scripts/fetch-fonts.sh` | Downloads Inter + IBM Plex Mono TTFs into `scripts/fonts/` (gitignored) - needed only to generate the PDF |
| `src/components/ui/` | CVA + BaseUI + shadcn components |
| `docs/brand/DESIGN.md` | Condensed design system |
| `scripts/generate_brand_pdf.py` | Generates `docs/brand/BRAND.pdf` - run it after changing the brand book |

### ⚠️ Editing trap

**`scripts/generate_brand_pdf.py` does NOT parse the Markdown** - it holds its own hard-coded copy of the content across ~1400 lines of ReportLab. Every substantive change to `BRAND.md` must be carried over there by hand, otherwise the PDF and the Markdown drift apart. That is exactly how the v1.1 (PDF) versus v2.0 (Markdown) split happened.

Order of operations: `BRAND.md` → mirror into `docs/brand/BRAND.en.md` → carry over to the generator by hand → `python3 scripts/generate_brand_pdf.py` → eyeball the PDF.

### 📁 Working / local

| File | Status |
|------|--------|
| `Workshift_logo/` | Working export - duplicate of `public/brand-assets/`, identical content. Do not edit here |
| `brand-profile.json` | Brand DNA for campaign tooling (`/ads`). **Gitignored** - local only |
| `campaign-brief.md`, `KAMPANIA-*.md` | Campaign strategy. **Gitignored** |

### ⛔ LEGACY - archived 28 July 2026

The entire v1.0 brand system sits in **`_archive/brand-v1/`** (with its own README explaining the differences). Do not use it, quote it or copy from it:

| File in the archive | Why |
|------|-----|
| `Workshift-Brand-Bible.docx` | v1.0 (March 2026): navy `#0A2540`, Satoshi + Plus Jakarta Sans, orange→violet gradient, an explicit ban on Inter. **The whole system was replaced.** The only survivors: the mark's metaphor and the onliness statement - both already in this document |
| `workshift-c1-parallelogram-export/` + `.zip` | Logo export for Brand Bible v1.0 - old gradient palette (`#ee703d → #cc7cab → #8530d1`). **Same geometry, obsolete colours** - which is precisely why it kept getting confused for the current files |

Outside the archive, removed from the codebase (commits `33aa059`, `321c051`):

| File | Why |
|------|-----|
| `src/components/ui/BrandSymbol.jsx` | ✅ Deleted. Dead code - zero usages, full legacy palette |
| `src/components/ScrollScatterSection.jsx` | ✅ Deleted. Zero importers, but Tailwind v4 scans the filesystem rather than the module graph - a dead component still emitted `text-[<forbidden-hex>]` utilities into the CSS |
| `src/components/TestimonialsSection.jsx` | ✅ Fixed, not deleted. `#8530d1` and `#22c55e` → `#9CE069` (live and visible: tags, quotation mark, photo gradient) |
| `brand.md` (lowercase) | ✅ Removed from the git index. Its content was folded into [section 0](#0-tldr-for-ai-agents); the filename collided with `BRAND.md` on case-insensitive filesystems |

**State of the legacy palette in `src/`:** 6 of 7 forbidden hex values cleared; only the approved exception in `InteractiveServicesBento.jsx` remains (see [section 3.1](#31-colour-palette)). Zero usages of the legacy token aliases outside their definitions in `src/index.css`.

> **Lesson from the audit:** what is actually user-visible is decided by `npm run build` plus a grep over `dist/`, not by grepping `src/` alone. Tailwind v4 scans the filesystem, so a dead component still generates CSS; Rollup, conversely, strips unused JS values. Zero importers means delete the file, not repaint it.

### How to change the brand

1. Colour / radius / typeface → **only** `src/index.css`
2. Logo → **only** `public/brand-assets/`, then re-render the PNGs and sync `public/favicon.svg`
3. A rule, a meaning, a tone, a prohibition → `BRAND.md`, then mirror here
4. After changing the brand book: `python3 scripts/generate_brand_pdf.py` → refreshed `docs/brand/BRAND.pdf`

---

*Workshift Brand Book · v2.0 · July 2026 · English edition*
*Translation of `BRAND.md` v2.0. The Polish edition is normative; brand copy is intentionally left untranslated.*
