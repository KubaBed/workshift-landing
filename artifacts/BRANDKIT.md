# Workshift — Brand Kit
> Generated with /brandkit (tasteskill.dev) · April 2026
> Based on: BRAND.md, design-system.css, aktualny design strony

---

## Tożsamość marki

| | |
|---|---|
| **Marka** | Workshift |
| **Kategoria** | Boutique AI consulting · B2B · Polska |
| **Tagline** | *Wdrażamy AI, które po prostu działa* |
| **Filozofia** | Przebudowa bez burzenia — precyzja, nie rewolucja |
| **Metafora** | Zmiana biegu — precyzyjny ruch mechaniczny w odpowiednim momencie |
| **Persona** | Partner w biznesie, nie vendor technologii |

---

## Panel 1–3 · Logo System

### Koncepcja znaku

**Metoda:** Negative space + Construction geometry  
**Forma:** Litera `W` zbudowana z dwóch równoległoboków — lewa połowa ciężka (czarna), prawa lżejsza (lime). Razem tworzą strzałkę „shift do przodu". Nawiązanie do nazwy marki i motywu parallelogramu z identyfikacji wizualnej.

```
  ╱╲  ╱╲
 ╱  ╲╱  ╲
╱  SHIFT ╲
```

**Wordmark:** `Workshift` — Inter Bold · tracking `-0.04em` · kolor `#000000`

### Warianty logo

| Wariant | Tło | Kolor znaku | Kiedy |
|---------|-----|-------------|-------|
| Primary | White `#FFFFFF` / Sage `#E6E8DD` | Czarny `#000000` | Domyślny — strona, oferty |
| Reversed | Dark `#000000` | Biały `#FFFFFF` | Ciemne tła, prezentacje nocne |
| Lime accent | Sage `#E6E8DD` | Czarny + Lime lewa połowa `W` | Wyróżnienia, social media |
| Monochrome | Dowolne | 1 kolor (czarny lub biały) | Druk, tłoczenia, haft |
| Icon only | Dowolne | Jak wariant | Favicon, avatar, app icon |

### Przestrzeń ochronna

Minimum = wysokość litery `W` ze wszystkich stron. Nic w tej strefie.

### Zakaz

- Nie rozciągaj proporcji znaku
- Nie nakładaj gradientu na logomark
- Nie umieszczaj na skomplikowanych wzorzystych tłach bez warstwy ochronnej
- Nie stosuj kolorów spoza palety (szczególnie: pomarańcz `#ee703d`, granat `#0A2540`)

---

## Panel 4 · Color System

### Paleta główna

| Swatch | Nazwa | Hex | RGB | Rola |
|--------|-------|-----|-----|------|
| `████` Sage | **Sage** | `#E6E8DD` | 230 · 232 · 221 | Tło strony, sekcje, karty — spokój i przestrzeń |
| `████` Lime | **Lime** | `#9CE069` | 156 · 224 · 105 | CTA, przyciski, focus, selekcja — energia i akcja |
| `████` Dark | **Dark** | `#000000` | 0 · 0 · 0 | Nagłówki, treść, struktura — autorytet |
| `████` Muted | **Muted Dark** | `#595959` | 89 · 89 · 89 | Opisy drugorzędne, metadane — kontekst |
| `████` Light | **Muted Light** | `#AAAAAA` | 170 · 170 · 170 | Captions, placeholder — tylko dekoracyjnie |
| `████` White | **White** | `#FFFFFF` | 255 · 255 · 255 | Karty, modale — czystość |

### Warianty Lime (subtelne akcenty)

| Hex | Opis | Użycie |
|-----|------|--------|
| `#b8ec92` | Accent Light | Tła tagów, hover stany |
| `#c5e0a8` | Accent Rose | Ciepły zielony — ilustracje, karty |
| `#d4e8c4` | Accent Violet | Chłodny zielony — ilustracje, karty |
| `#7bc44a` | Accent Purple | Ciemny lime — aktywne stany, ikony |

### Kombinacje dozwolone

| Para | WCAG | Użycie |
|------|------|--------|
| `#000000` na `#E6E8DD` | AA ✓ | Główna treść na tle sage |
| `#000000` na `#9CE069` | AA ✓ | Tekst w przyciskach CTA |
| `#9CE069` na `#000000` | AA ✓ | Reversed CTA, nocna wersja |
| `#595959` na `#E6E8DD` | AA ✓ | Opisy, subheadline |
| `#000000` na `#FFFFFF` | AAA ✓ | Karty, modale |

### Zakaz kolorów

Nigdy w aktywnym projekcie Workshift:
- Pomarańcz `#ee703d` — legacy, usunięty
- Granat `#0A2540` — legacy, usunięty
- Fiolet, niebieski, czerwień jako akcenty (z wyjątkiem `#DD453D` dla błędów)

---

## Panel 5 · Typography

### Kroje pisma

| Rola | Font | Źródło |
|------|------|--------|
| **Główny** | Inter | Google Fonts / self-hosted |
| **Akcent techniczny** | IBM Plex Mono | Google Fonts / self-hosted |

**Zasada jednego fonta:** Inter jest wystarczająco ekspresyjny. Spójność kroju = spokój i profesjonalizm.

### Hierarchia typograficzna

```
HERO H1 — Inter Regular · 96px · tracking -4px · #000000
"Wdrażamy AI, które po prostu działa."

Section H2 — Inter Regular · 48px · tracking-tight
Automatyzacja. Audyt. Agenci AI.

Subsection H3 — Inter Regular · 30px · tracking-tight
Konkretne wyniki bez rocznych projektów.

Body Large — Inter Regular · 18px · leading 1.6
Identyfikujemy straty czasu, automatyzujemy powtarzalne procesy
i zostawiamy Ci wiedzę — bez zależności od nas.

Body Default — Inter Regular · 16px
Caption / Label — Inter Medium · 14px · #595959

01  MONO ACCENT — IBM Plex Mono Regular · 14px · #595959
    "+32% czasu · 45h/miesiąc · 4 tygodnie wdrożenia"
```

### Zasady

- Wszystkie nagłówki: `font-weight: 400` (nie Bold — Inter regular wystarczy)
- Logo/wordmark: `font-weight: 700`, `letter-spacing: -0.04em`
- `::selection`: `background: #9CE069`, `color: #000000`
- Rendering: `antialiased` globalnie
- IBM Plex Mono **wyłącznie** dla: numerów kroków, metryk, danych technicznych

---

## Panel 6 · Icon System

**Styl:** Line icons · 1.5px stroke · `stroke-linecap: round` · `stroke-linejoin: round`

| Symbol | Ikona | Usługa |
|--------|-------|--------|
| `⇄` | Pętla z strzałkami | Automatyzacja procesów |
| `◎` | Cross-hair / cel | Audyt i Strategia AI |
| `▷` | Play (zawsze aktywny) | Agenci AI 24/7 |
| `⌗` | Siatka wiedzy | Szkolenia AI |
| `✦` | Gwiazda 4-ramienna (precyzyjna) | Kreacje reklamowe AI |

**Prezentacja:** Ikony na białych kartach `border-radius: 10px`, lime dot/ring jako focus point w centrum lub rogach. Nigdy filled — zawsze outline.

**Rozmiary:** 16px · 20px · 24px · 32px · 48px (grid optymalizowany dla każdego)

---

## Panel 7 · Mockup — Landing Page Browser

**Format:** Browser chrome (Safari/Chrome minimal) · 1440px szerokość

```
┌─────────────────────────────────────────────────────┐
│ ○ ○ ○  [                workshift.pl               ]│
├─────────────────────────────────────────────────────┤
│  Workshift                    Usługi  O nas  Kontakt │
│─────────────────────────────────────────────────────│
│                                                      │
│   Wdrażamy AI,                                       │
│   które po prostu działa.                            │
│                                                      │
│   Konkretne wyniki dla polskich MŚP                  │
│   bez rocznych transformacji.                        │
│                                                      │
│   [  Zacznij od bezpłatnego audytu  ]  ← Lime CTA   │
│                                                      │
│ ──────────────── gradient divider ──────────────────│
│  +32% czasu   45h/mies   4 tygodnie   24/7 agenci   │
└─────────────────────────────────────────────────────┘
```

Tło: Sage `#E6E8DD` · Hero: Inter Regular 96px · CTA: Lime `#9CE069` button

---

## Panel 8 · Mockup — Business Card

### Przód (85×55mm)

```
┌─────────────────────────────────┐
│                                  │
│  Workshift                       │
│                                  │
│  Jakub Bednarz                   │
│  Founder & AI Consultant         │
│                                  │
│  hello@workshift.pl              │
│  Poznań, Polska                  │
│                                  │
└─────────────────────────────────┘
```
Tło: Sage `#E6E8DD` · Logo: czarny wordmark · Kontakt: Muted Dark `#595959`

### Tył (85×55mm)

```
┌─────────────────────────────────┐
│                                  │
│                                  │
│   Wdrażamy AI,                   │
│   które po prostu działa.        │
│                                  │
│                                  │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ← Lime 3px pasek
└─────────────────────────────────┘
```
Tło: Czarne `#000000` · Tekst: Biały `#FFFFFF` · Akcent: Lime 3px bottom bar

---

## Panel 9 · Brand Statement

```
─────────────────────────────────────────────
WORKSHIFT
─────────────────────────────────────────────

Wdrażamy AI,
które po prostu działa.

Precyzja. Nie rewolucja.
Wyniki. Nie buzzwordy.
Wiedza. Nie zależność.

—

Boutique AI consulting · Poznań · hello@workshift.pl

─────────────────────────────────────────────
```

---

## Image Generation Prompt

Gotowy prompt do wklejenia w DALL-E 3 / Midjourney / Stable Diffusion XL:

```
Premium brand identity kit board for "Workshift", a boutique AI consulting
firm targeting Polish SMEs. Clean, intentional, expensive-looking.

Canvas: dark charcoal #111111, 3x3 panel grid, 20px clean gutters,
white small-caps IBM Plex Mono panel labels.

Panel 1 — Logo primary: "Workshift" in Inter Bold, letter-spacing -0.04em,
  black text on white card. Geometric W mark from two parallelograms,
  left half solid black, right half lime green #9CE069. Clean, minimal.

Panel 2 — Logo reversed: same mark, white on pure black background.
  Lime #9CE069 right parallelogram.

Panel 3 — Logo variations grid: monochrome black, all-lime, icon mark only
  at 16px, 32px, 64px sizes showing scalability.

Panel 4 — Color system: 6 large rectangular swatches.
  Sage #E6E8DD (largest), Lime #9CE069, Black #000000,
  Muted #595959, Light #AAAAAA, White #FFFFFF.
  Hex codes in IBM Plex Mono 12px below. Clean, no shadows.

Panel 5 — Typography specimen: Inter font at 3 scales.
  "Wdrażamy AI" at 64px weight 400, body text 18px,
  IBM Plex Mono "+32%" accent in muted gray.
  White background, black text, precise baseline grid visible.

Panel 6 — Icon set: 5 line icons (loop-arrows, crosshair, play-triangle,
  grid-hash, 4-point star) on white rounded cards, lime accent dot center.
  Stroke 1.5px, linecap round.

Panel 7 — Browser mockup: minimal browser chrome, sage #E6E8DD background,
  large Inter headline, lime green CTA button, gradient divider,
  4 metric numbers in IBM Plex Mono below.

Panel 8 — Business card pair: front (sage bg, black wordmark, muted contact),
  back (black bg, white tagline, lime 3px bottom bar). Angled slightly.

Panel 9 — Brand manifesto: "WORKSHIFT" in Inter Bold 48px, tagline in
  Inter Regular 24px, on sage background. Lime thin horizontal rule below.
  Minimal. Intentional. Premium.

Style reference: senior brand designer's presentation deck.
No gradients on logomarks, no stock photos, no floating decorations,
no AI-generic layouts. Pure, precise, systematic. Like Pentagram or
Studio Dumbar would present it.
```

---

## Wytyczne wdrożenia

### Strona internetowa

| Element | Token | Wartość |
|---------|-------|---------|
| Tło główne | `--color-sage` | `#E6E8DD` |
| Przycisk CTA | `--color-lime` | `#9CE069` |
| Nagłówki | `--color-dark` | `#000000` |
| Treść body | `--color-dark` | `#000000` |
| Podpisy | `--color-muted-dark` | `#595959` |
| Focus ring | `--ring` | `#9CE069` |
| Container max | — | `1320px` |
| Header max | — | `1400px` |

### Social Media LinkedIn

- Tło: Sage `#E6E8DD` (główne) lub Czarne `#000000` (mocne)
- Akcent: jeden element Lime na grafikę — maksymalnie
- Font: Inter Bold headline + Inter Regular body
- Metryki: IBM Plex Mono
- Format: 1200×627px (post), 1080×1080px (square), 1584×396px (banner)

### Prezentacje / Pitch Deck

- Tło slajdu: Sage lub białe
- H1 slajdu: Inter Bold 40px, czarny
- Body: Inter Regular 18px
- Highlight/metric: Lime accent lub IBM Plex Mono
- Zasada: jeden punkt na slajd, wielka liczba jako hero

---

*Brand Kit wygenerowany: kwiecień 2026 · Workshift v1.0*
*Skill: /brandkit (tasteskill.dev) · Claude Code*
*Dane źródłowe: BRAND.md, design-system.css, design-system-legacy.css*
