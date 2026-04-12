# Workshift — Brand Book & Design System

> **Source of truth** dla tożsamości marki, designu i komunikacji.
> Używaj tego dokumentu przy tworzeniu nowych podstron, materiałów marketingowych i treści.
> Stan: finalna wersja (zamknięty etap projektowy, kwiecień 2026).

---

## Spis treści

1. [Marka](#1-marka)
2. [Visual Identity](#2-visual-identity)
3. [Komponenty UI](#3-komponenty-ui)
4. [Tone of Voice](#4-tone-of-voice)
5. [Materiały marketingowe](#5-materiały-marketingowe)

---

## 1. Marka

### Kim jesteśmy

**Workshift** to boutique AI consulting dla polskich MŚP. Nie technologia na pokaz — konkretne wyniki bez rocznych transformacji.

- **Założyciel:** Jakub Bednarz
- **Kontakt:** hello@workshift.pl | Warszawa
- **Tagline:** *Wdrażamy AI, które po prostu działa*
- **Filozofia:** Przebudowa bez burzenia — precyzyjne zmiany, nie rewolucja

### Misja

> „Wdrażamy pragmatyczne innowacje AI dla ambitnych Polskich MŚP."

### Wartości marki

| # | Wartość | Co to znaczy |
|---|---------|--------------|
| 1 | **Pragmatyzm** | Żadnych buzzwordów. Tylko rozwiązania, które działają w poniedziałek rano |
| 2 | **Mierzalne rezultaty** | Zawsze konkretne liczby (+32% czasu, 45+ godzin miesięcznie) |
| 3 | **Prostota wdrożenia** | Bez chaosu, bez przestojów, bez rocznych projektów |
| 4 | **Transfer wiedzy** | Zostawiamy wiedzę, nie zależność. Klient umie obsługiwać sam |
| 5 | **Ludzkie podejście** | Rozumiemy biznes najpierw, technologia jest narzędziem |

### Grupa docelowa

**Właściciele i managerowie polskich MŚP** — nie deweloperzy, nie specjaliści IT.

Branże priorytetowe:
- Kancelarie prawne i consultingowe
- Agencje rekrutacyjne i działy HR
- E-Commerce
- Agencje reklamowe i marketingowe

**Czego szukają:** oszczędność czasu, mniejsze koszty operacyjne, przewaga nad konkurencją — bez technologicznego ryzyka.

### Usługi

1. **Automatyzacja procesów** — integracja narzędzi w jeden workflow
2. **Audyt i Strategia AI** — identyfikacja strat czasu, typowo ~32% do odzyskania
3. **Szkolenia AI** — prompt engineering, bezpieczeństwo AI, GenAI tools
4. **Agenci AI** — automatyczna pierwsza linia obsługi 24/7
5. **Kreacje reklamowe AI** — setki kreacji w dni zamiast miesięcy

Model: **à la carte** — każda usługa dostępna osobno.

---

## 2. Visual Identity

### 2.1 Paleta kolorów

#### Kolory główne

| Nazwa | Token | Hex | Swatch | Zastosowanie |
|-------|-------|-----|--------|--------------|
| **Sage** | `color-sage` | `#E6E8DD` | ████ | Główne tło strony, sekcje, karty |
| **Lime** | `color-lime` | `#9CE069` | ████ | CTA, przyciski, focus ring, highlight |
| **Dark** | `color-dark` | `#000000` | ████ | Nagłówki, treść, struktury |
| **Muted Dark** | `color-muted-dark` | `#595959` | ████ | Opisy drugorzędne, metadane |
| **Muted Light** | `color-muted-light` | `#AAAAAA` | ████ | Placeholder, captions, wyłączone |
| **White** | *(brak tokenu)* | `#FFFFFF` | ████ | Karty, modale — na tle sage |

#### Warianty Lime

| Nazwa | Token | Hex | Zastosowanie |
|-------|-------|-----|--------------|
| Accent Light | `color-accent-light` | `#b8ec92` | Tła tagów, hover stany, jasne akcenty |
| Accent Rose | `color-accent-rose` | `#c5e0a8` | Ciepły zielony — ilustracje, karty |
| Accent Violet | `color-accent-violet` | `#d4e8c4` | Chłodny zielony — ilustracje, karty |
| Accent Purple | `color-accent-purple` | `#7bc44a` | Ciemny lime — aktywne stany, ikony |

#### Kiedy używać czego

| Sytuacja | Kolor |
|----------|-------|
| Tło strony / sekcji | Sage `#E6E8DD` |
| Główny przycisk CTA | Lime `#9CE069` |
| Tekst nagłówka | Dark `#000000` |
| Tekst treści | Dark `#000000` |
| Tekst drugorzędny | Muted Dark `#595959` |
| Etykiety, podpisy | Muted Light `#AAAAAA` |
| Karta / modal | White `#FFFFFF` |
| Highlight / selekcja | Lime `#9CE069` na czarnym tekście |
| Błąd / alert | `#DD453D` |

> **Zakaz:** Nie używaj pomarańczu (`#ee703d`), granatowego (`#0A2540`), ani fontu Satoshi. To elementy legacy systemu.

---

### 2.2 Typografia

#### Kroje pisma

| Rola | Font | Użycie |
|------|------|--------|
| **Główny (sans)** | Inter | Nagłówki H1–H6, treść, UI, nawigacja |
| **Display** | Inter | Duże nagłówki hero i sekcji (ta sama rodzina) |
| **Mono** | IBM Plex Mono | Numery kroków, metryki, etykiety techniczne |

> **Dlaczego jeden font?** Inter jest wystarczająco ekspresyjny. Spójność kroju nadaje marce spokój i profesjonalizm — dwa różne sans-serify to wizualny hałas.

#### Hierarchia typograficzna

| Rola | Tailwind | Rozmiar | Weight | Tracking |
|------|----------|---------|--------|----------|
| Hero H1 | `text-[72px]` / `text-[96px]` | 72–96px | 400 | `-3.6px` do `-4px` |
| Section H2 | `text-4xl` / `text-5xl` | 36–48px | 400 | `tracking-tight` |
| Subsection H3 | `text-2xl` / `text-3xl` | 24–30px | 400 | `tracking-tight` |
| H4–H6 | `text-xl` / `text-lg` | 18–20px | 400 | `tracking-tight` |
| Body large | `text-lg` | 18px | 400 | normal |
| Body default | `text-base` | 16px | 400 | normal |
| Body small | `text-sm` | 14px | 400 | normal |
| Caption | `text-xs` | 12px | 400 | normal |
| Label / Nav | `text-sm` | 14px | 500 | normal |
| Mono accent | `font-mono text-sm` | 14px | 400 | normal |

#### Zasady

- Wszystkie nagłówki globalnie: `font-weight: 400`, `tracking-tight`, kolor `#000000`
- Logo/wordmark: `font-bold`, `text-xl`, `tracking-[-0.04em]`
- Selekcja tekstu (::selection): `background: #9CE069`, `color: #000000`
- Rendering: `antialiased` globalnie, `font-optical-sizing: auto`

---

### 2.3 Spacing & Layout

#### Border Radius

| Token | Wartość | Użycie |
|-------|---------|--------|
| `--radius-sm` | 4px | Tagi, badges, małe elementy |
| `--radius-md` | 8px | Checkboxy, przyciski xs |
| `--radius-lg` | 10px | Przyciski, inputy, karty (standard) |
| `--radius-xl` | 16px | Duże karty, modale |
| `--radius-2xl` | 20px | Prominentne sekcje |
| `--radius-3xl` | 24px | Duże panele |
| `--radius-4xl` | 80px | Pill shape, nawigacja |

#### Layout

- **Container max-width:** `1320px`
- **Header max-width:** `1400px`
- **Padding poziomy:** `px-6` (24px desktop) / `px-4` (16px mobile `max-md`)
- **Grid:** Rendani editorial grid — globalne linie marginesów

#### Breakpoints (Tailwind)

| Klasa | Px | Urządzenie |
|-------|----|------------|
| `sm:` | 640px | Telefony landscape / małe tablety |
| `md:` | 768px | Tablety |
| `lg:` | 1024px | Laptopy |
| `xl:` | 1280px | Duże monitory |

---

### 2.4 Efekty wizualne

#### Glass Morphism

```
Light glass (.glass-panel):
  background: rgba(230, 232, 221, 0.7)  ← sage 70%
  backdrop-filter: blur(24px)
  border: 1px solid rgba(0,0,0,0.1)
  box-shadow: 0 8px 32px rgba(0,0,0,0.04)

Dark glass (.glass-panel-dark):
  background: rgba(0,0,0,0.7)
  backdrop-filter: blur(24px)
  border: 1px solid rgba(255,255,255,0.1)
  box-shadow: 0 8px 32px rgba(0,0,0,0.2)
```

Użycie: nawigacja, pływające karty, overlaye — nadaje głębi bez ciężkości cieni.

#### Gradient Divider

```
Gradient: linear-gradient(90deg, #9CE069 0%, #b8e88a 50%, #E6E8DD 100%)
Wysokość: 3px, rounded-full
Opacity: 0.8
```

Użycie: separator między głównymi sekcjami strony (jest komponentem `GradientDivider`).

#### Gradient Text

Kolory: `['#9CE069', '#E6E8DD', '#7bc44a']` — animowane przez 8s loop.
Użycie: słowa kluczowe w hero lub kluczowych statements — oszczędnie, max 1–2 na stronę.

---

## 3. Komponenty UI

### 3.1 Przyciski (Button)

Komponent: `src/components/ui/Button.jsx` — CVA variants + BaseUI primitive.

#### Warianty

| Variant | Wygląd | Kiedy używać |
|---------|--------|--------------|
| `accent` | Lime bg, czarny tekst, cień | **Główne CTA** — jeden na widoku |
| `accent-outline` | Lime border, transparent bg | Drugorzędne CTA obok `accent` |
| `default` | Lime bg (primary) | Przyciski w kontekście UI/formularzy |
| `outline` | Border, hover muted bg | Akcje drugorzędne |
| `secondary` | Białe bg | Na ciemnych tłach, akcje neutralne |
| `ghost` | Bez tła, hover muted | Nawigacja, akcje dyskretne |
| `destructive` | Czerwone tło 10% | Usuń, cofnij — niebezpieczne akcje |
| `link` | Tylko tekst + underline | Linki w treści |

#### Rozmiary

| Size | Wysokość | Użycie |
|------|----------|--------|
| `xs` | 24px | Gęste UI, tabele, badges |
| `sm` | 28px | Sidebar, kompaktowe panele |
| `default` | 32px | Standard — większość przypadków |
| `lg` | 36px | Hero CTA, prominentne akcje |
| `icon` / `icon-sm` / `icon-lg` | kwadratowe | Przyciski z ikoną bez tekstu |

#### Focus & Accessibility

- Focus ring: 3px `#9CE069` z 50% opacity
- `aria-invalid`: czerwony border i ring (destructive)
- `disabled`: `pointer-events: none`, opacity 50%

---

### 3.2 Formularze

**Input** (`src/components/ui/input.jsx`)
- Wysokość: 32px (`h-8`)
- Padding: `px-2.5 py-1`
- Border: `rgba(0,0,0,0.2)`, radius `lg` (10px)
- Focus: lime ring z opacity

**Textarea** (`src/components/ui/textarea.jsx`)
- Min-height: 64px (`min-h-16`)
- `field-sizing: content` — auto-resize
- Identyczny styl jak Input

---

### 3.3 Animacje

#### FadeUp — wejście sekcji

```
Initial:  opacity: 0, y: +30px
Final:    opacity: 1, y: 0
Duration: 0.8s
Easing:   cubic-bezier(0.21, 0.47, 0.32, 0.98)
Trigger:  IntersectionObserver, once: true
```

**Zasada:** Każda główna sekcja strony wchodzi przez FadeUp. Nie stackuj wielu FadeUp jednocześnie.

#### Floating — elementy dekoracyjne

```
Metoda:   translateY + rotate loop
Easing:   easeInOutSine
Duration: 4s–12s (zróżnicowane)
Amplituda: ~12px
```

**Zasada:** Tylko elementy dekoracyjne tła — nigdy na treści ani elementach interaktywnych.

#### TextReveal — hero headline

```
Metoda: Word-by-word reveal z efektem blur
```

**Zasada:** Tylko hero headline. Nie stosuj w sekcjach poniżej fold.

#### Reguły globalne

- `prefers-reduced-motion`: wszystkie animacje skracane do `0.01ms`
- `will-change: transform` na animowanych elementach (GPU acceleration)
- Smooth scroll: Lenis — nie nadpisuj `scroll-behavior`

---

## 4. Tone of Voice

### Zasady pisania

**1. Konkret zamiast abstrakcji**
Zawsze konkretna liczba, czas, wynik. Nie "usprawniamy procesy" — "odzyskujesz 32% czasu tygodniowo".

**2. Bezpośredniość bez agresji**
Krótkie zdania. Żadnych korporacyjnych eufemizmów. Mówimy jak do partnera w biznesie, nie jak do leadu w CRM.

**3. My też jesteśmy w tej grze**
Empatia przez wspólne doświadczenie: "Wiemy, o co toczy się gra, bo sami w nią gramy." Nie pouczamy — rozumiemy.

**4. Rezultat, nie technologia**
Klient nie kupuje "agenta AI" — kupuje "pierwszą linię obsługi, która działa o 3 w nocy". Technologia jest w tle.

**5. Żadnych kompromisów w standardach**
Nie obiecujemy cudów. Obiecujemy: konkretne rezultaty, transferowaną wiedzę, brak chaosu. I dotrzymujemy.

---

### Czego unikamy

| Unikaj | Zamiast tego |
|--------|--------------|
| "Rewolucjonizujemy..." | "Wdrażamy w 4 tygodnie" |
| "Innowacyjne rozwiązanie AI" | "Automatyczne notatki ze spotkań" |
| "Synergiczne podejście" | *(usuń, nie zastępuj)* |
| "State-of-the-art modele" | "GPT-4 + Twoje dane" |
| "Transformacja cyfrowa" | "Jeden workflow zamiast pięciu narzędzi" |
| "Skalowalna platforma" | *(co konkretnie skaluje? powiedz to)* |
| Pasywny strona zwrotna | Aktywna ("Ty oszczędzasz" nie "Czas jest oszczędzany") |

---

### Przykłady — nagłówki

| ✗ Źle | ✓ Dobrze |
|-------|---------|
| "Innowacyjne AI dla Twojej firmy" | "Wdrażamy AI, które po prostu działa" |
| "Kompleksowe rozwiązania automatyzacji" | "Koniec ręcznego przepisywania danych" |
| "Transformujemy Twój biznes z AI" | "32% czasu tygodniowo z powrotem w Twoje ręce" |
| "Zaawansowane narzędzia dla profesjonalistów" | "Kancelaria prawna: automatyczne notatki, mniej papierkologii" |
| "Skontaktuj się z nami" | "Zacznij od bezpłatnego audytu" |

---

### Metryki — jak je używać

- Zawsze konkretna liczba: `+32%`, `45+ godzin`, `4 tygodnie`, `24/7`
- Podaj kontekst: `+32% odzyskanego czasu *przy typowym wdrożeniu automatyzacji*`
- Unikaj zaokrągleń "marketingowych": `18.7%` brzmi wiarygodniej niż `"prawie 20%"`
- Jeśli liczba pochodzi od klienta — podaj źródło (case study, nazwisko)

---

### Język

- **Materiały klienckie:** Polski (strona, oferty, newsletter, social media)
- **Kod i dokumentacja techniczna:** Angielski
- **Newsletter "AI Praktycznie":** Polski, co dwa tygodnie, jeden praktyczny proces
- **Ton:** Profesjonalny ale ludzki — Jakub mówi własnym głosem, nie przez corporate mask

---

## 5. Materiały marketingowe

### 5.1 Social media (LinkedIn)

**Kolory tła dopuszczone:**
- Sage `#E6E8DD` — główne tło grafik (spójne ze stroną)
- Czarne `#000000` — mocne, kontrastowe grafiki
- Białe `#FFFFFF` — czyste, dokumentowe grafiki

**Kolor akcentu:** Lime `#9CE069` — zawsze jeden akcent na grafikę, nie więcej.

**Typografia w grafikach:**
- Inter Bold dla headlinów
- Inter Regular dla treści
- IBM Plex Mono dla metryk i liczb

**Tone:**
- Jeden konkretny insight per post (nie "5 rzeczy o AI")
- Liczba lub wynik w pierwszym zdaniu
- Zakończenie pytaniem lub wezwaniem do działania

---

### 5.2 Prezentacje (pitch deck, oferty)

**Paleta slajdów:**
- Tło: Sage `#E6E8DD` lub białe
- Akcent: Lime `#9CE069` (nagłówki, highlights, wykresy)
- Tekst: Czarny `#000000` / Muted Dark `#595959`
- Unikaj: gradientów tła, wielu kolorów akcent naraz

**Typografia:**
- H1 slajdu: Inter Bold, 36–48px
- Body slajdu: Inter Regular, 16–20px
- Metryki: IBM Plex Mono lub Inter Bold z Lime accent

**Zasada układu:**
- Jeden główny punkt na slajd
- Duże liczby / metryki jako hero element
- Zdjęcia / ilustracje: jasne, minimalistyczne lub czarno-białe

---

### 5.3 Banery i grafiki reklamowe

**Formaty:**
- LinkedIn banner: 1584 × 396px
- LinkedIn post: 1200 × 627px
- Social square: 1080 × 1080px

**Reguły:**
- Logo: zawsze lewy górny lub dolny róg, min. 20px margines
- CTA: jeden, wyróżniony Lime buttonem lub boldowanym tekstem
- Tło: sage lub czarne — nie mieszaj na jednej grafice
- Zdjęcia: neutralne, profesjonalne, bez stockowych "uśmiechniętych biznesmenów"

---

### 5.4 Logo i identyfikacja

**Logo wordmark:**
- Font: Inter Bold
- Tracking: `-0.04em`
- Kolor: Czarny na jasnym tle / Biały na ciemnym tle
- Wariant zielony (Lime): tylko na specjalnych akcjach

**Przestrzeń ochronna:** minimum równa wysokości litery "W" ze wszystkich stron.

**Zakaz:**
- Nie rozciągaj proporcji
- Nie nakładaj na skomplikowane tła bez kontrastowego tła pod logo
- Nie używaj gradient na logotypie

---

*Dokument wygenerowany: kwiecień 2026 | Wersja: 1.0 (finalna)*
*Pliki techniczne: `design-system.css` (CSS reference), `src/index.css` (Tailwind tokens)*
