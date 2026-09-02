# Workshift - Brand Book & Design System

> **Jedyne źródło prawdy** dla tożsamości marki, designu i komunikacji.
> Wersja **2.0** · lipiec 2026 · zastępuje `Workshift-Brand-Bible.docx` (v1.0) i `brand.md`.
>
> 🇬🇧 Wersja angielska: [`docs/brand/BRAND.en.md`](docs/brand/BRAND.en.md) - **ten plik jest normatywny**, tamten to
> tłumaczenie dla niepolskojęzycznych wykonawców i agencji. Copy marki (tagline, nagłówki,
> zakazane zwroty) celowo **nie jest** tam przetłumaczone - przy zmianie treści zaktualizuj oba.
>
> **Hierarchia prawdy przy sprzeczności:**
> 1. `src/index.css` (`@theme` + `:root`) - tokeny kolorów, radiusów, fontów. Zmieniasz kolor? Tylko tu.
> 2. `public/brand-assets/` - pliki logo. Zmieniasz logo? Tylko tu.
> 3. **Ten dokument** - reguły, znaczenia, tone of voice, wszystko czego kod nie wyraża.
>
> Mapa wszystkich plików marki (co aktualne, co legacy): [sekcja 8](#8-mapa-plików).

---

## Spis treści

0. [TL;DR dla agentów AI](#0-tldr-dla-agentów-ai)
1. [Marka](#1-marka)
2. [Logo](#2-logo)
3. [Visual Identity](#3-visual-identity)
4. [Komponenty UI](#4-komponenty-ui)
5. [Tone of Voice](#5-tone-of-voice)
6. [Materiały marketingowe](#6-materiały-marketingowe)
7. [Kampanie płatne](#7-kampanie-płatne)
8. [Mapa plików](#8-mapa-plików)

---

## 0. TL;DR dla agentów AI

Skompresowana wersja. Wystarczy do 90% zadań - po szczegóły schodź niżej.

**Marka:** boutique AI consulting dla polskich MŚP. Jakub Bednarz, Poznań, kontakt@workshift.pl.
**Tagline:** „Wdrażamy AI, które po prostu działa". **Trueline:** „Przebudowa bez burzenia" - używany publicznie, m.in. jako nagłówek sekcji procesu.

**Paleta - tylko te kolory:**
`#E6E8DD` sage (tło) · `#9CE069` lime (akcent/CTA) · `#000000` czarny (tekst i ciemne sekcje) · `#595959` muted-dark · `#AAAAAA` muted-light · `#FFFFFF` białe karty · `#DD453D` błędy.

**Fonty - tylko dwa:** Inter (wszystko) + IBM Plex Mono (wyłącznie liczby i etykiety techniczne). Self-hostowane z `public/fonts/`.

**Sześć reguł, które łamie się najczęściej:**
1. **Nagłówki mają `font-weight: 400`**, nie bold. Bold jest zarezerwowany wyłącznie dla wordmarku logo (700).
2. **Jeden akcent lime na widok.** Lime = akcja. Kilka lime = wizualny szum i zero hierarchii.
3. **Tło: sage albo czarne albo białe - nie mieszaj na jednej grafice.**
4. **Typografia: zawsze dywiz `-`, nigdy pauza `-` ani półpauza `-`.** Dotyczy UI, maili, dokumentów, copy. Tekst z LLM-a lub bazy normalizuj przy renderowaniu.
5. **Rezultat, nie technologia.** Klient kupuje „pierwszą linię obsługi działającą o 3 w nocy", nie „agenta AI".
6. **Konkretna liczba zamiast przymiotnika.** `18,7%` bije „prawie 20%", które bije „znacznie".

**ZAKAZ (legacy, usunięte w v1.0 systemu):** pomarańcz `#ee703d`, granat `#0A2540`, róż `#cc7cab`, fiolet `#8530d1`, font Satoshi, font Plus Jakarta Sans.
**ZAKAZ (klisze AI):** roboty, mózgi, chipy, sieci neuronowe, niebiesko-fioletowe gradienty „tech", stockowi uśmiechnięci biznesmeni.

---

## 1. Marka

### Kim jesteśmy

**Workshift** to boutique AI consulting dla polskich MŚP. Nie technologia na pokaz - konkretne wyniki bez rocznych transformacji.

- **Założyciel:** Jakub Bednarz
- **Kontakt:** kontakt@workshift.pl | Poznań
- **Tagline (zewnętrzny):** *Wdrażamy AI, które po prostu działa*
- **Trueline:** *Przebudowa bez burzenia* - używany publicznie. Jest nagłówkiem sekcji „Jak pracujemy" na stronie od marca 2026 i wolno go stawiać w materiałach. Do lipca 2026 ten dokument opisywał go jako „nie do materiałów"; był to artefakt konsolidacji v2.0, nie decyzja - patrz commit `33aa059`.

### Onliness Statement

> Workshift to jedyna firma wdrożeniowa AI w Polsce, która **przesuwa proces, a nie przewraca go** - dając MŚP mierzalne wyniki w tygodniach, nie miesiącach.

To zdanie jest testem pozycjonowania: jeśli materiał marketingowy dałoby się podpisać nazwą konkurencji bez zmiany sensu, materiał jest do przepisania.

### Misja

> „Wdrażamy pragmatyczne innowacje AI dla ambitnych polskich MŚP."

### Wartości marki

| # | Wartość | Co to znaczy |
|---|---------|--------------|
| 1 | **Pragmatyzm** | Żadnych buzzwordów. Tylko rozwiązania, które działają w poniedziałek rano |
| 2 | **Mierzalne rezultaty** | Zawsze konkretne liczby (+32% czasu, 45+ godzin miesięcznie) |
| 3 | **Prostota wdrożenia** | Bez chaosu, bez przestojów, bez rocznych projektów |
| 4 | **Transfer wiedzy** | Zostawiamy wiedzę, nie zależność. Klient umie obsługiwać sam |
| 5 | **Ludzkie podejście** | Rozumiemy biznes najpierw, technologia jest narzędziem |

### Grupa docelowa

**Właściciele i decydenci polskich MŚP (6-150 osób), wiek 30-60.** Nie deweloperzy, nie specjaliści IT.

Branże priorytetowe:
- Kancelarie prawne, biura rachunkowe, consulting
- E-commerce
- Produkcja i logistyka
- Usługi B2B, agencje (rekrutacyjne, marketingowe), działy HR

**Bóle, którymi żyją:** ręczne przepisywanie danych między systemami, nieczytelne skany przepisywane ręcznie, powtarzalne pytania klientów, wolna pierwsza odpowiedź na zapytanie, raporty sklejane dniami w Excelu, przekonanie że automatyzacja jest droga.

**Czego szukają:** oszczędność czasu, mniejsze koszty operacyjne, przewaga nad konkurencją - bez technologicznego ryzyka.

> **Insight z kampanii v1 (lipiec 2026):** najlepiej reagowały kobiety 35-54 (właścicielki, office managerki, główne księgowe) na placemencie Reels. Segment 55-64 był najtańszy. Nie ekstrapoluj tego na inne kanały bez własnych danych.

### Usługi

1. **Automatyzacja procesów** - integracja narzędzi, które firma już ma, w jeden workflow
2. **Audyt i Strategia AI** - identyfikacja strat czasu, typowo ~32% do odzyskania
3. **Szkolenia AI** - prompt engineering, bezpieczeństwo AI, narzędzia GenAI
4. **Agenci AI** - automatyczna pierwsza linia obsługi 24/7
5. **Kreacje reklamowe AI** - setki kreacji w dni zamiast miesięcy

Model: **à la carte** - każda usługa dostępna osobno.
**Oferta wejściowa (lead offer):** bezpłatna 30-minutowa rozmowa diagnostyczna.

---

## 2. Logo

### 2.1 Znaczenie - dlaczego tak wygląda

Sygnet to **trzy pochylone równoległoboki ułożone pionowo**. Środkowy jest przesunięty w prawo i jako jedyny wypełniony pełnym kolorem.

> Trzy warstwy = procesy klienta.
> Środkowa się przesuwa = nasza interwencja.
> Reszta stabilna = zero przestojów.

Logo jest wizualną obietnicą marki - to ten sam komunikat co trueline „przebudowa bez burzenia". Znajomość tej metafory jest obowiązkowa przy projektowaniu materiałów: układ warstwowy z jednym przesuniętym elementem to nasz podstawowy motyw wizualny, nie tylko logo.

### 2.2 Konstrukcja

Geometria (viewBox `0 0 512 512`), identyczna we wszystkich wariantach:

```
górny  polygon: 141,141  371,141  333,205  103,205   → wypełnienie tłumione
środek polygon: 192,237  422,237  384,301  154,301   → wypełnienie akcentowe
dolny  polygon: 141,333  371,333  333,397  103,397   → wypełnienie tłumione
```

**Środkowy pasek - gradient akcentowy (obowiązkowy):**
`linear-gradient(90deg, #9CE069 0%, #81c44e 100%)`

**Paski górny i dolny - tłumione, zależnie od tła:**

| Tło | Wypełnienie górnego i dolnego | Wordmark |
|---|---|---|
| Jasne (sage / białe) | `#000000` opacity `0.15 → 0.05` | `#000000` |
| Ciemne (czarne) | `#FFFFFF` opacity `0.30 → 0.10` | `#FFFFFF` |

**Wordmark:** „Workshift", Inter 700, `letter-spacing: -0.04em`, mixed case.

### 2.3 Warianty i pliki

| Wariant | Plik | Rozmiar |
|---|---|---|
| Lockup na jasnym tle | `public/brand-assets/logo-light.{svg,png}` | 1200×400 |
| Lockup na ciemnym tle | `public/brand-assets/logo-dark.{svg,png}` | 1200×400 |
| Sam sygnet | `public/brand-assets/logo-icon.{svg,png}` | 512×512 |
| Favicon | `public/favicon.svg` + `favicon-96x96.png`, `favicon.ico`, `apple-touch-icon.png` | - |

Paczka do wysyłki na zewnątrz (agencje, partnerzy): `public/Workshift_Brand_Assets.zip`.

> **Uwaga o duplikacie:** katalog `Workshift_logo/` w rootcie projektu zawiera te same trzy SVG pod polskimi nazwami. Zweryfikowane: identyczna geometria i identyczne kolory. To eksport roboczy, **nie** osobna wersja marki - przy edycji zawsze zmieniaj `public/brand-assets/` i regeneruj resztę.

### 2.4 Zasady użycia

- **Przestrzeń ochronna:** minimum wysokość litery „W" z każdej strony (odpowiednik ~50% szerokości sygnetu).
- **Minimalna wielkość:** 24px dla samego sygnetu, 32px dla lockupu z wordmarkiem, 120px szerokości dla pełnego lockupu w druku.
- **Pozycja na grafikach:** lewy górny lub lewy dolny róg, min. 20px marginesu.

**Zakaz:**
- Nie zmieniaj kąta pochylenia równoległoboków
- Nie przesuwaj paska górnego ani dolnego (przesunięty jest **tylko** środkowy - to cały sens znaku)
- Nie rozciągaj proporcji, nie obracaj
- Nie zmieniaj gradientu środkowego paska na inny ani nie zastępuj go płaskim kolorem
- Nie dodawaj gradientu, cienia, glow ani 3D do **wordmarku** - wordmark jest zawsze płaski, czarny lub biały
- Nie nakładaj na skomplikowane tło bez kontrastowej podkładki

> **Doprecyzowanie względem v1.x tego dokumentu:** poprzednia wersja zawierała regułę „nie używaj gradientu na logotypie", sprzeczną z plikami produkcyjnymi. Prawidłowo: **gradient lime jest integralną częścią sygnetu**; zakaz dotyczy wordmarku i dodawania jakichkolwiek innych gradientów.

---

## 3. Visual Identity

### 3.1 Paleta kolorów

Wszystkie wartości poniżej są zsynchronizowane z `src/index.css`. Zmiana koloru = zmiana tokenu tam, nie hardcode w komponencie.

#### Kolory główne

| Nazwa | Token (`@theme`) | Hex | Zastosowanie |
|-------|------------------|-----|--------------|
| **Sage** | `--color-sage` | `#E6E8DD` | Domyślne tło strony, sekcji, kart |
| **Lime** | `--color-lime` | `#9CE069` | CTA, przyciski, focus ring, highlight, selekcja tekstu |
| **Lime Deep** | *(tylko w SVG)* | `#81c44e` | Wyłącznie drugi stop gradientu w sygnecie |
| **Dark** | `--color-dark` | `#000000` | Nagłówki, treść, ciemne sekcje |
| **Muted Dark** | `--color-muted-dark` | `#595959` | Opisy drugorzędne, metadane |
| **Muted Light** | `--color-muted-light` | `#AAAAAA` | Placeholder, captions, elementy wyłączone |
| **White** | *(brak tokenu)* | `#FFFFFF` | Karty i modale na tle sage |
| **Destructive** | `--destructive` | `#DD453D` | Błędy, alerty, akcje destrukcyjne |

#### Warstwa semantyczna (shadcn, `:root`)

Projekt korzysta z shadcn/ui, więc obok tokenów markowych istnieje warstwa semantyczna. **Komponenty UI odwołują się do niej, nie do surowych hexów.**

| Zmienna | Wartość | Zmienna | Wartość |
|---|---|---|---|
| `--background` | `#E6E8DD` | `--primary` | `#9CE069` |
| `--foreground` | `#000000` | `--primary-foreground` | `#000000` |
| `--card` / `--popover` | `#FFFFFF` | `--accent` | `#9CE069` |
| `--secondary` | `#FFFFFF` | `--destructive` | `#DD453D` |
| `--muted` / `--muted-foreground` | `#595959` | `--ring` | `#9CE069` |
| `--border` / `--input` | `rgba(0,0,0,0.2)` | `--radius` | `10px` |

#### Legacy-aliasy - nie używaj w nowym kodzie

W `@theme` zostały nazwy z poprzedniego systemu, przemapowane na aktualną paletę wyłącznie dla kompatybilności wstecznej. **Nazwy kłamią - `accent-rose` i `accent-violet` to zielenie.**

| Alias | Realny hex | Czym zastąpić |
|---|---|---|
| `--color-alabaster` | `#E6E8DD` | `--color-sage` |
| `--color-navy`, `--color-navy-dark` | `#000000` | `--color-dark` |
| `--color-accent` | `#9CE069` | `--color-lime` |
| `--color-accent-light` | `#b8ec92` | jasny wariant lime - tła tagów, hover |
| `--color-accent-rose` | `#c5e0a8` | ciepła zieleń - ilustracje |
| `--color-accent-violet` | `#d4e8c4` | chłodna zieleń - ilustracje |
| `--color-accent-purple` | `#7bc44a` | ciemny lime - stany aktywne, ikony |

#### Kiedy używać czego

| Sytuacja | Kolor |
|----------|-------|
| Tło strony / sekcji (domyślne) | Sage `#E6E8DD` |
| Sekcja kontrastowa | Czarny `#000000` |
| Główny przycisk CTA | Lime `#9CE069` |
| Tekst nagłówka i treści | Czarny `#000000` |
| Tekst drugorzędny | Muted Dark `#595959` |
| Etykiety, podpisy | Muted Light `#AAAAAA` |
| Karta / modal na sage | Białe `#FFFFFF` |
| Highlight / selekcja | Lime `#9CE069` z czarnym tekstem |
| Błąd / alert | Destructive `#DD453D` |

> **Zakaz:** pomarańcz `#ee703d`, granat `#0A2540`, brzoskwinia `#f5a273`, róż `#cc7cab`, liliowy `#d5a4e7`, fiolet `#8530d1`, chartreuse `#D2FF00`. To paleta legacy - jeśli widzisz ją w pliku, plik jest nieaktualny.
>
> **Jedyny zatwierdzony wyjątek:** gradient `#A78BFA → #8530D1` w [InteractiveServicesBento.jsx:543](src/components/InteractiveServicesBento.jsx:543). To jedna z ośmiu **mockowych kreacji cudzych marek** w demo usługi, nie powierzchnia marki Workshift. Decyzja Kuby, commit `321c051`. Nie rozszerzaj tego wyjątku i nie kopiuj tych wartości nigdzie indziej.

---

### 3.2 Typografia

#### Kroje pisma

| Rola | Font | Użycie |
|------|------|--------|
| **Główny (sans + display)** | Inter | Nagłówki H1-H6, treść, UI, nawigacja, wordmark |
| **Mono** | IBM Plex Mono | Wyłącznie liczby, metryki, numery kroków, etykiety techniczne |

> **Dlaczego jeden font?** Inter jest wystarczająco ekspresyjny. Spójność kroju nadaje marce spokój i profesjonalizm - dwa różne sans-serify to wizualny hałas.

**Ładowanie:** fonty są **self-hostowane** jako woff2 z `public/fonts/` (`inter-latin`, `inter-latin-ext`, `plex-mono-{400,500}-latin{,-ext}`), z `font-display: swap` i podziałem na zakresy unicode. Warianty `latin-ext` są konieczne dla polskich znaków (ł ą ę ó ś ż ź ć ń). **Nie wprowadzaj z powrotem Google Fonts** - było render-blocking.

> **Wyjątek:** pliki SVG logo w `public/brand-assets/` mają `@import` z Google Fonts w `<defs>`. To celowe - te SVG bywają otwierane poza kontekstem strony (agencje, podgląd w edytorze). Nie kopiuj tego wzorca do komponentów.

#### Hierarchia typograficzna

| Rola | Tailwind | Rozmiar | Weight | Tracking |
|------|----------|---------|--------|----------|
| Hero H1 | `text-[72px]` / `text-[96px]` | 72-96px | 400 | `-3.6px` do `-4px` |
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

#### Zasady

- **Wszystkie nagłówki globalnie: `font-weight: 400`**, `tracking-tight`, kolor `#000000`. Wymuszone w `@layer base` - nie nadpisuj lokalnie.
- Jedyny bold w systemie to wordmark logo (700).
- Selekcja tekstu (`::selection`): tło `#9CE069`, tekst `#000000`.
- Rendering: `antialiased` globalnie, `font-optical-sizing: auto`.
- **Dywiz `-`, nigdy pauza `-` ani półpauza `-`.** Dotyczy każdego tekstu wychodzącego pod marką.

---

### 3.3 Spacing & Layout

#### Border Radius

| Token | Wartość | Użycie |
|-------|---------|--------|
| `--radius-sm` | 4px | Tagi, badges, małe elementy |
| `--radius-md` | 8px | Checkboxy, przyciski xs |
| `--radius-lg` / `--radius` | 10px | **Domyślny** - przyciski, inputy, karty |
| `--radius-xl` | 16px | Duże karty, modale |
| `--radius-2xl` | 20px | Prominentne sekcje |
| `--radius-3xl` | 24px | Duże panele |
| `--radius-4xl` | 80px | Pill shape, nawigacja |

#### Layout

- **Container max-width:** `1320px` (`--container-max-w`)
- **Header max-width:** `1400px`
- **Padding poziomy:** `px-6` (24px desktop) / `px-4` (16px mobile `max-md`)
- **Dolna granica responsywności:** 320px (iPhone SE)

#### Breakpoints (Tailwind)

| Klasa | Px | Urządzenie |
|-------|----|------------|
| `sm:` | 640px | Telefony landscape / małe tablety |
| `md:` | 768px | Tablety |
| `lg:` | 1024px | Laptopy |
| `xl:` | 1280px | Duże monitory |

---

### 3.4 Efekty wizualne

#### Glass Morphism

```
Light glass (.glass-panel):
  background: rgba(230, 232, 221, 0.7)   ← sage 70%
  backdrop-filter: blur(24px)
  border: 1px solid rgba(0,0,0,0.1)
  box-shadow: 0 8px 32px rgba(0,0,0,0.04)

Dark glass (.glass-panel-dark):
  background: rgba(0,0,0,0.7)
  backdrop-filter: blur(24px)
  border: 1px solid rgba(255,255,255,0.1)
  box-shadow: 0 8px 32px rgba(0,0,0,0.2)
```

Użycie: nawigacja, pływające karty, overlaye - daje głębię bez ciężkości cieni.

#### Gradient Divider

```
linear-gradient(90deg, #9CE069 0%, #b8e88a 50%, #E6E8DD 100%)
wysokość 3px · rounded-full · opacity 0.8
```

Separator między głównymi sekcjami strony. Komponent: `GradientDivider`.

#### Gradient Text

Kolory `['#9CE069', '#E6E8DD', '#7bc44a']`, animowane w pętli 8s.
Użycie: słowa kluczowe w hero lub kluczowych statementach - oszczędnie, **max 1-2 na stronę**.

#### Motyw warstw

Wizualne echo logo: nakładające się płaszczyzny, z których jedna jest przesunięta. Hero, karty, separatory.
**Max 2 motywy wizualne naraz w jednej sekcji.**

---

## 4. Komponenty UI

### 4.1 Przyciski (Button)

Komponent: `src/components/ui/Button.jsx` - warianty CVA na prymitywie BaseUI.

| Variant | Wygląd | Kiedy używać |
|---------|--------|--------------|
| `accent` | Lime bg, czarny tekst, cień | **Główne CTA - jeden na widoku** |
| `accent-outline` | Lime border, transparent bg | Drugorzędne CTA obok `accent` |
| `default` | Lime bg (primary) | Przyciski w formularzach |
| `outline` | Border, hover muted bg | Akcje drugorzędne |
| `secondary` | Białe bg | Na ciemnych tłach, akcje neutralne |
| `ghost` | Bez tła, hover muted | Nawigacja, akcje dyskretne |
| `destructive` | Czerwone tło 10% | Usuń, cofnij |
| `link` | Tekst + underline | Linki w treści |

**Rozmiary:** `xs` 24px · `sm` 28px · `default` 32px · `lg` 36px · `icon` / `icon-sm` / `icon-lg` (kwadratowe).

**Focus & accessibility:**
- Focus ring: 3px `#9CE069` przy 50% opacity
- `aria-invalid`: czerwony border i ring
- `disabled`: `pointer-events: none`, opacity 50%

### 4.2 Formularze

**Input** (`src/components/ui/input.jsx`) - wysokość 32px (`h-8`), padding `px-2.5 py-1`, border `rgba(0,0,0,0.2)`, radius 10px, focus = lime ring.

**Textarea** (`src/components/ui/textarea.jsx`) - min-height 64px (`min-h-16`), `field-sizing: content` (auto-resize), poza tym identyczny styl.

### 4.3 Animacje

| Nazwa | Specyfikacja | Kiedy |
|---|---|---|
| **FadeUp** | opacity 0→1, y +30px→0, 0.8s, `cubic-bezier(0.21, 0.47, 0.32, 0.98)`, IntersectionObserver `once` | Wejście każdej głównej sekcji. Nie stackuj wielu naraz |
| **Floating** | translateY + rotate loop, easeInOutSine, 4-12s, amplituda ~12px | **Wyłącznie** dekoracyjne elementy tła. Nigdy na treści ani CTA |
| **TextReveal** | word-by-word reveal z blurem | **Wyłącznie** hero headline. Nie poniżej folda |
| **Scale / Gradient** | - | Dividery, paski akcentu |

**Reguły globalne:**
- `prefers-reduced-motion` → wszystkie animacje skracane do `0.01ms`
- `will-change: transform` na animowanych elementach (akceleracja GPU)
- Smooth scroll: Lenis - **nie nadpisuj `scroll-behavior`**

---

## 5. Tone of Voice

### Cztery przymiotniki

**Konkretny** (język wyników, nie technologii) · **Spokojny** (bez krzyku, bez FOMO, bez „rewolucji AI") · **Partnerski** (obok klienta, nie ponad nim) · **Pewny siebie** (wiemy co robimy, ale bez arogancji).

### Pięć zasad pisania

**1. Konkret zamiast abstrakcji**
Zawsze konkretna liczba, czas, wynik. Nie „usprawniamy procesy" - „odzyskujesz 32% czasu tygodniowo".

**2. Bezpośredniość bez agresji**
Krótkie zdania. Żadnych korporacyjnych eufemizmów. Mówimy jak do partnera w biznesie, nie jak do leada w CRM.

**3. My też jesteśmy w tej grze**
Pierwsza osoba liczby mnogiej („wdrażamy", „wiemy"). Empatia przez wspólne doświadczenie: „Wiemy, o co toczy się gra, bo sami w nią gramy". Nie pouczamy - rozumiemy.

**4. Rezultat, nie technologia**
Klient nie kupuje „agenta AI" - kupuje „pierwszą linię obsługi, która działa o 3 w nocy". W copy konsumenckim **zero nazw stacku**.

**5. Żadnych kompromisów w standardach**
Nie obiecujemy cudów. Obiecujemy konkretne rezultaty, transferowaną wiedzę, brak chaosu. I dotrzymujemy.

### Czego unikamy

| Unikaj | Zamiast tego |
|--------|--------------|
| „Rewolucjonizujemy..." | „Wdrażamy w 4 tygodnie" |
| „Innowacyjne rozwiązanie AI" | „Automatyczne notatki ze spotkań" |
| „Synergiczne podejście" | *(usuń, nie zastępuj)* |
| „State-of-the-art modele" | „GPT-4 + Twoje dane" |
| „Transformacja cyfrowa" | „Jeden workflow zamiast pięciu narzędzi" |
| „Skalowalna platforma" | *(co konkretnie skaluje? powiedz to)* |
| „Skontaktuj się z nami" | „Zacznij od bezpłatnego audytu" |
| Strona bierna („czas jest oszczędzany") | Aktywna („Ty oszczędzasz czas") |

### Przykłady - nagłówki

| ✗ Źle | ✓ Dobrze |
|-------|---------|
| „Innowacyjne AI dla Twojej firmy" | „Wdrażamy AI, które po prostu działa" |
| „Kompleksowe rozwiązania automatyzacji" | „Koniec ręcznego przepisywania danych" |
| „Transformujemy Twój biznes z AI" | „32% czasu tygodniowo z powrotem w Twoje ręce" |
| „Zaawansowane narzędzia dla profesjonalistów" | „Kancelaria prawna: automatyczne notatki, mniej papierkologii" |
| „Skontaktuj się z nami" | „Zacznij od bezpłatnego audytu" |

### Metryki - jak ich używać

- Zawsze konkretna liczba: `+32%`, `45+ godzin`, `4 tygodnie`, `24/7`
- Podaj kontekst: „+32% odzyskanego czasu *przy typowym wdrożeniu automatyzacji*"
- Unikaj zaokrągleń marketingowych: `18,7%` brzmi wiarygodniej niż „prawie 20%"
- Jeśli liczba pochodzi od klienta - podaj źródło (case study, firma)

### Język

- **Materiały klienckie:** polski (strona, oferty, newsletter, social media)
- **Kod i dokumentacja techniczna:** angielski
- **Newsletter „AI Praktycznie":** polski, co dwa tygodnie, jeden praktyczny proces
- **Kontekst:** polskie realia MŚP, RODO, polskie nazwy instytucji
- **Ton:** profesjonalny ale ludzki - Jakub mówi własnym głosem, nie przez corporate mask

---

## 6. Materiały marketingowe

### 6.1 Zasada produkcji: kreacje w kodzie

**Grafiki i wideo reklamowe powstają w kodzie** (HTML / Remotion → render headless Chrome), z fontami z `public/fonts/`. Canva tylko na wyraźne życzenie.

Powód: kod jest wersjonowalny, powtarzalny, generuje warianty seryjnie i gwarantuje zgodność z tokenami. Decyzja z 28.07.2026, po dwóch odrzuconych iteracjach w Canvie.

### 6.2 Social media (LinkedIn)

**Tła dopuszczone:** sage `#E6E8DD` (spójne ze stroną) · czarne `#000000` (mocny kontrast) · białe `#FFFFFF` (czyste, dokumentowe). **Nie mieszaj dwóch na jednej grafice.**

**Akcent:** lime `#9CE069` - zawsze jeden na grafikę.

**Typografia w grafikach:** Inter Bold dla headline'ów, Inter Regular dla treści, IBM Plex Mono dla metryk i liczb.

**Formaty:** post 1200×627 · square 1080×1080 · banner 1584×396.

**Tone:** jeden konkretny insight per post (nie „5 rzeczy o AI") · liczba lub wynik w pierwszym zdaniu · zakończenie pytaniem lub CTA.

### 6.3 Prezentacje (pitch deck, oferty)

- **Tło:** sage lub białe. Bez gradientów tła.
- **Akcent:** lime - nagłówki, highlighty, wykresy. Nigdy kilka kolorów akcentu naraz.
- **Tekst:** czarny `#000000` / muted dark `#595959`
- **Typografia:** H1 slajdu Inter Bold 36-48px · body Inter Regular 16-20px · metryki IBM Plex Mono albo Inter Bold w lime
- **Układ:** jeden główny punkt na slajd, duże liczby jako element hero
- **Zdjęcia:** jasne, minimalistyczne albo czarno-białe

### 6.4 Zakazy w warstwie wizualnej

Nigdy: roboty · mózgi · chipy · sieci neuronowe · niebiesko-fioletowe gradienty „tech" · generyczne ilustracje AI · stockowi uśmiechnięci biznesmeni · neonowe glowy · klisze rodem z banku zdjęć.

---

## 7. Kampanie płatne

### Framework kreacji: „A GDYBY TAK"

Autorski wariant PAS×BAB, zatwierdzony 20.07.2026:

```
1-2 zdania problemu językiem klienta
        ↓
pivot: „A gdyby tak [obietnica]?"
        ↓
rozwiązanie + CTA
```

Hook **„A GDYBY TAK..."** jest wspólnym elementem wszystkich grafik kampanii - duża typografia jako główny nośnik przekazu, dopełnienie zdania zmienia się per kreacja.

### Reguły twarde

- **Zero cen w reklamach** (decyzja z 20.07.2026)
- **Zero nazw stacku** w copy konsumenckim
- Oferta wejściowa: bezpłatna 30-minutowa rozmowa diagnostyczna
- Formularz: instant form, zgoda RODO wymagana przy zostawianiu maila

> Operacyjny stan kampanii, copy decki i harmonogramy żyją w `KAMPANIA-V2-LEADGEN.md`, `KAMPANIA-V3-KONCEPT.md` i `campaign-brief.md` (gitignored). Ten dokument opisuje wyłącznie **reguły marki**, nie stan kampanii.

---

## 8. Mapa plików

Sekcja istnieje po to, żeby nigdy więcej nie było wątpliwości, który plik jest aktualny.

### ✅ Aktualne - używaj

| Plik | Rola |
|------|------|
| `BRAND.md` | **Ten dokument. Jedyny brand book, wersja normatywna.** |
| `docs/brand/BRAND.en.md` | Wersja angielska dla niepolskojęzycznych wykonawców. Copy marki nieprzetłumaczone (celowo) |
| `src/index.css` | **Source of truth dla tokenów** - `@theme` (marka) + `:root` (semantyka shadcn) |
| `public/brand-assets/logo-{light,dark,icon}.{svg,png}` | **Source of truth dla logo** |
| `public/favicon.svg` + warianty PNG/ICO | Favicony (sygnet, paleta lime) |
| `public/fonts/*.woff2` | Self-hostowane Inter + IBM Plex Mono |
| `public/Workshift_Brand_Assets.zip` | Paczka do wysyłki na zewnątrz |
| `docs/brand/design-system.css` | Dokumentacja CSS aktualnego systemu (referencja, nie build) |
| `scripts/fetch-fonts.sh` | Pobiera TTF-y Inter + IBM Plex Mono do `scripts/fonts/` (gitignored) - potrzebne tylko do generowania PDF-a |
| `src/components/ui/` | Komponenty CVA + BaseUI + shadcn |
| `docs/brand/DESIGN.md` | Skrót systemu designu |
| `scripts/generate_brand_pdf.py` | Generator `docs/brand/BRAND.pdf` - odpalaj po zmianie tego dokumentu |

### ⚠️ Pułapka przy edycji

**`scripts/generate_brand_pdf.py` NIE parsuje tego pliku** - trzyma własną kopię treści na sztywno w ~1400 liniach ReportLab. Każdą zmianę merytoryczną w `BRAND.md` musisz przenieść tam ręcznie, inaczej PDF i Markdown się rozjadą. Dokładnie tak powstał rozjazd v1.1 (PDF) vs v2.0 (Markdown).

Kolejność przy zmianie: `BRAND.md` → lustrzana zmiana w `docs/brand/BRAND.en.md` → ręczne przeniesienie do generatora → `python3 scripts/generate_brand_pdf.py` → wizualna kontrola PDF-a.

Trzy kopie tej samej treści to dług, którego świadomie nie spłacam teraz (PDF wymagałby przepisania generatora na parser Markdown). Dopóki istnieje, jedyną obroną jest ta lista kroków.

### 📁 Robocze / lokalne

| Plik | Status |
|------|--------|
| `Workshift_logo/` | Eksport roboczy - duplikat `public/brand-assets/`, identyczna treść. Nie edytuj tutaj |
| `brand-profile.json` | Brand DNA dla narzędzi kampanijnych (`/ads`). **Gitignored** - lokalny |
| `campaign-brief.md`, `KAMPANIA-*.md` | Strategia kampanii. **Gitignored** |

### ⛔ LEGACY - zarchiwizowane 28.07.2026

Cały system marki v1.0 leży w **`_archive/brand-v1/`** (z własnym README wyjaśniającym różnice). Nie używaj, nie cytuj, nie kopiuj:

| Plik w archiwum | Dlaczego |
|------|----------|
| `Workshift-Brand-Bible.docx` | v1.0 (marzec 2026): navy `#0A2540`, font Satoshi + Plus Jakarta Sans, gradient pomarańcz→fiolet, jawny zakaz Intera. **Cały system zastąpiony.** Jedyne, co przetrwało: metafora sygnetu i onliness statement - oba są już w tym dokumencie |
| `workshift-c1-parallelogram-export/` + `.zip` | Eksport logo do Brand Bible v1.0 - stara paleta gradientu (`#ee703d → #cc7cab → #8530d1`). **Geometria ta sama, kolory nieaktualne** - stąd brała się pomyłka |

Poza archiwum, usunięte z kodu (commity `33aa059`, `321c051`):

| Plik | Dlaczego |
|------|----------|
| `src/components/ui/BrandSymbol.jsx` | ✅ Usunięty. Martwy kod - zero użyć, pełna paleta legacy |
| `src/components/ScrollScatterSection.jsx` | ✅ Usunięty. Zero importerów, ale Tailwind v4 skanuje system plików, nie graf modułów - martwy komponent nadal generował utility `text-[<zakazany-hex>]` w CSS |
| `src/components/TestimonialsSection.jsx` | ✅ Naprawiony, nie usunięty. `#8530d1` i `#22c55e` → `#9CE069` (żywe i widoczne: tagi, cudzysłów, gradient na zdjęciu) |
| `brand.md` (mała litera) | ✅ Usunięty z indeksu gita. Skrót dla agentów AI wchłonięty do [sekcji 0](#0-tldr-dla-agentów-ai); nazwa kolidowała z `BRAND.md` na systemach case-insensitive |

**Stan palety legacy w `src/`:** 6 z 7 zakazanych hexów wyczyszczonych; został wyłącznie zatwierdzony wyjątek w `InteractiveServicesBento.jsx` (patrz [sekcja 3.1](#31-paleta-kolorów)). Zero użyć legacy-aliasów tokenów poza definicjami w `src/index.css`.

> **Lekcja z audytu:** o tym, co jest widoczne dla użytkownika, rozstrzyga `npm run build` + grep po `dist/`, nie sam grep po `src/`. Tailwind v4 skanuje system plików, więc martwy komponent wciąż generuje CSS; Rollup z kolei wycina nieużywane wartości JS. Zero importerów = usuń plik, nie przemaluj go.

### Procedura zmiany marki

1. Kolor / radius / font → **wyłącznie** `src/index.css`
2. Logo → **wyłącznie** `public/brand-assets/`, potem przerenderuj PNG i zsynchronizuj `public/favicon.svg`
3. Reguła, znaczenie, ton, zakaz → **ten plik**
4. Po zmianie tego pliku: `python scripts/generate_brand_pdf.py` → odświeżony `docs/brand/BRAND.pdf`

---

*Workshift Brand Book · v2.0 · lipiec 2026*
*Konsoliduje: `BRAND.md` v1.0 (kwiecień 2026), `brand.md` v1.1 (maj 2026), `Workshift-Brand-Bible.docx` v1.0 (marzec 2026).*
