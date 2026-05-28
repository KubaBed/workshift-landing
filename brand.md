# Workshift — Brand (skrót dla agentów AI)

> Lekki plik referencyjny. Pełna wersja: `BRAND.md` + `BRAND.pdf`.
> Source of truth dla design tokens: `src/index.css` (Tailwind v4 @theme).

## TL;DR — co to za marka

- **Co:** boutique AI consulting dla polskich MŚP
- **Kto pisze:** Jakub Bednarz (Poznań), kontakt@workshift.pl
- **Język marki:** polski (kod i dokumentacja techniczna — angielski)
- **Tagline:** „Wdrażamy AI, które po prostu działa"
- **Filozofia:** przebudowa bez burzenia — konkretne wyniki, nie roczne transformacje

---

## Tożsamość — co robimy / dla kogo

**Klient:** właściciel / manager polskiej MŚP. **Nie** deweloper, **nie** specjalista IT.

**Branże:** kancelarie prawne · agencje HR/rekrutacja · e-commerce · agencje marketingowe.

**Usługi (à la carte):**
1. Automatyzacja procesów
2. Audyt i Strategia AI
3. Szkolenia AI
4. Agenci AI
5. Kreacje reklamowe AI

**Wartości:** pragmatyzm · mierzalne rezultaty · prostota wdrożenia · transfer wiedzy · ludzkie podejście.

---

## Design tokens — paleta (tylko te kolory)

| Token | Hex | Użycie |
|---|---|---|
| `color-sage` | `#E6E8DD` | tło strony i sekcji |
| `color-lime` | `#9CE069` | CTA, akcent, focus ring, selekcja tekstu |
| `color-dark` | `#000000` | nagłówki, treść |
| `color-muted-dark` | `#595959` | tekst drugorzędny, opisy |
| `color-muted-light` | `#AAAAAA` | captions, placeholder, wyłączone |
| `white` | `#FFFFFF` | karty, modale na tle sage |
| `destructive` | `#DD453D` | błędy, alerty |

**Warianty Lime (sparingly):** `#b8ec92` (light), `#c5e0a8` (rose), `#d4e8c4` (violet), `#7bc44a` (purple).

**ZAKAZ:** pomarańcz `#ee703d`, granat `#0A2540`, font Satoshi — to legacy, usunięte w v1.0.

**Reguła:** jeden akcent Lime na widok / grafikę. Lime sygnalizuje akcję — kilka Lime to wizualny szum.

---

## Typografia (tylko 2 fonty)

- **Inter** — wszystko: nagłówki, treść, UI, nawigacja, logo
- **IBM Plex Mono** — wyłącznie liczby, metryki, etykiety techniczne, numery sekcji

| Rola | Rozmiar | Weight | Tracking |
|---|---|---|---|
| Hero H1 | 72–96px | 400 | −3.6 do −4px |
| H2 | 36–48px | 400 | tracking-tight |
| H3 | 24–30px | 400 | tracking-tight |
| H4–H6 | 18–20px | 400 | tracking-tight |
| Body | 16px | 400 | normal |
| Caption | 12px | 400 | normal |
| Label / Nav | 14px | 500 | normal |
| Logo wordmark | 20px+ | 700 | −0.04em |

**Zasada nadrzędna:** nagłówki mają **font-weight 400** (nie bold). Tylko logo jest 700.

---

## Layout & spacing

- Container max-width: **1320px** (header: 1400px)
- Padding poziomy: `px-6` desktop / `px-4` mobile
- Border radius: `lg = 10px` (default), `xl = 16px` (duże karty), `4xl = 80px` (pill / nav)
- Breakpoints Tailwind: `md` 768px · `lg` 1024px · `xl` 1280px

**Glass morphism** (`.glass-panel`): tło sage 70% opacity + backdrop-blur 24px + border 1px. Dla nawigacji i overlayów.

**Gradient divider:** `linear-gradient(90deg, #9CE069 0%, #b8e88a 50%, #E6E8DD 100%)`, 3px, rounded-full — separator między sekcjami.

---

## Komponenty UI (`src/components/ui/`)

**Przyciski — warianty (CVA + BaseUI):**

| Variant | Kiedy |
|---|---|
| `accent` | główne CTA — **jeden na widok** |
| `accent-outline` | drugorzędne CTA obok `accent` |
| `default` | primary w formularzach |
| `outline` | akcje drugorzędne |
| `secondary` | na ciemnym tle |
| `ghost` | nawigacja, akcje dyskretne |
| `destructive` | usuń / cofnij |
| `link` | linki w treści |

**Rozmiary:** `xs=24px`, `sm=28px`, `default=32px`, `lg=36px`. Min. touch target: 32px.

**Inputy:** wysokość 32px, padding `px-2.5 py-1`, border `rgba(0,0,0,0.2)`, radius 10px, focus = lime ring opacity 50%.

---

## Animacje (tylko te)

| Nazwa | Kiedy używać |
|---|---|
| **FadeUp** | wejście każdej głównej sekcji (opacity 0→1, y +30→0, 0.8s) |
| **Floating** | dekoracyjne elementy tła — **nigdy na treści/CTA** |
| **TextReveal** | wyłącznie hero headline |
| **Scale/Gradient** | dividery, paski akcent |

**Reguła globalna:** `prefers-reduced-motion` → wszystkie animacje 0.01ms. Smooth scroll: Lenis (nie nadpisuj `scroll-behavior`).

---

## Tone of Voice — 5 zasad pisania

1. **Konkret zamiast abstrakcji** — zawsze liczba, czas, wynik. Nie „usprawniamy procesy" — „odzyskujesz 32% czasu tygodniowo".
2. **Bezpośredniość bez agresji** — krótkie zdania. Mówimy jak do partnera w biznesie, nie jak do leadu w CRM.
3. **My też w tej grze** — pierwsza osoba liczby mnogiej („wdrażamy", „wiemy"), partnerstwo zamiast pouczania.
4. **Rezultat, nie technologia** — klient nie kupuje „agenta AI", kupuje „pierwszą linię obsługi działającą o 3 w nocy".
5. **Żadnych kompromisów w standardach** — obiecujemy konkrety, transfer wiedzy, brak chaosu. I dotrzymujemy.

---

## ✗ Czego nigdy nie pisać / ✓ czym zastąpić

| ✗ | ✓ |
|---|---|
| „Rewolucjonizujemy..." | „Wdrażamy w 4 tygodnie" |
| „Innowacyjne rozwiązanie AI" | „Automatyczne notatki ze spotkań" |
| „Synergiczne podejście" | *(usuń, nie zastępuj)* |
| „State-of-the-art modele" | „GPT-4 + Twoje dane" |
| „Transformacja cyfrowa" | „Jeden workflow zamiast pięciu narzędzi" |
| „Skalowalna platforma" | *(co konkretnie skaluje? powiedz to)* |
| „Skontaktuj się z nami" | „Zacznij od bezpłatnego audytu" |
| Strona bierna („czas jest oszczędzany") | Aktywna („Ty oszczędzasz czas") |

---

## Metryki — jak je używać

- Zawsze konkretna liczba: **+32%**, **45+ godzin**, **4 tygodnie**, **24/7**
- Podaj kontekst: „+32% odzyskanego czasu *przy typowym wdrożeniu automatyzacji*"
- Unikaj zaokrągleń marketingowych: `18.7%` brzmi wiarygodniej niż „prawie 20%"
- Jeśli liczba pochodzi od klienta — podaj źródło (case study, firma)

---

## Logo

- **Znak:** trzy parallelogramy poziomo, środkowy zawsze w Lime `#9CE069`
- **Wordmark:** „Workshift" w Inter Bold, tracking −0.04em
- **Na jasnym tle:** wordmark `#000000`
- **Na ciemnym tle:** wordmark `#FFFFFF`
- **Przestrzeń ochronna:** min. wysokość litery „W" ze wszystkich stron
- **Min. wysokość:** 24px (icon) / 32px (z wordmarkiem)

**Zakaz:** nie rozciągaj proporcji · nie obracaj · nie zmieniaj kolorów · nie używaj gradientu · nie nakładaj na skomplikowane tła.

Pliki: `public/brand-assets/logo-{light,dark,icon}.{svg,png}`.

---

## Materiały marketingowe — szybkie zasady

**LinkedIn / social:**
- Tło: sage lub czarne lub białe (nie mieszaj na jednej grafice)
- Akcent: Lime — jeden na grafikę
- Font: Inter (Bold nagłówek, Regular treść), IBM Plex Mono dla metryk
- Format post: 1200×627, square: 1080×1080, banner: 1584×396
- Treść: jeden konkretny insight per post (nie „5 rzeczy o AI"), liczba w pierwszym zdaniu, CTA na końcu

**Prezentacje / pitch deck:**
- Tło slajdu: sage lub białe (nie gradienty)
- Jeden punkt na slajd, duże liczby jako hero element
- Zdjęcia: jasne, minimalistyczne lub czarno-białe (bez stockowych „uśmiechniętych biznesmenów")

---

## Pliki / source of truth

| Plik | Co zawiera |
|---|---|
| `src/index.css` | **Source of truth** — Tailwind v4 @theme tokens (jedyne miejsce do zmiany kolorów/radiusów) |
| `design-system.css` | CSS reference / dokumentacja aktualnego systemu |
| `BRAND.md` | Pełna wersja brand booka (długa) |
| `brand.md` | Ten plik — wersja lekka dla agentów AI |
| `BRAND.pdf` | Brand book PDF z wizualizacjami (dla agencji) |
| `scripts/generate_brand_pdf.py` | Generator PDF — odpalaj po zmianach BRAND.md |
| `src/components/ui/` | Komponenty CVA + BaseUI |
| `public/brand-assets/` | Logo (light/dark/icon) — SVG i PNG |
| `design-system-legacy.css` | ⚠️ LEGACY (Satoshi/Orange/Navy) — **NIE używać** |

---

## Pierwsze kroki przy nowym materiale

1. **Tło:** sage `#E6E8DD` (default) lub black `#000000`. Nie mieszaj.
2. **Jeden** akcent Lime na widok — to ma być CTA albo kluczowa metryka.
3. **Typografia:** tylko Inter. IBM Plex Mono tylko dla liczb i etykiet technicznych.
4. **Nagłówki:** `tracking-tight`, `font-weight: 400` (nie bold).
5. **Treść:** pierwsza osoba liczby mnogiej („wdrażamy", „wiemy"). Krótkie zdania.
6. **Metryki:** konkretne — **+32%**, **45+ godzin**, **4 tygodnie** — nie „znacznie", „bardzo".

---

*Workshift Brand · v1.1 · maj 2026*
