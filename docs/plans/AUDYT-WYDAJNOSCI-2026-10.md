# Audyt wydajności workshift.pl (15.10.2026)

Pomiar laboratoryjny w Chrome DevTools na produkcji (PSI API zwróciło 429, brak klucza).
Mobile = 412x823, Slow 4G, CPU x4. Desktop = 1350x940, Fast 4G. Zimny cache, bez zgody na cookies.
TBT to szacunek z Long Tasks API, nie wynik Lighthouse. CrUX: brak danych dla strony;
dane od prawdziwych użytkowników są w Vercel Speed Insights.

| Strona | FCP | LCP | TBT (szac.) | CLS | Transfer |
|---|---|---|---|---|---|
| `/` mobile | 4,6 s | **6,1 s** | ~570 ms (najdłuższe zadanie 479 ms) | 0 | ~876 KB |
| `/` desktop | 1,1 s | **2,6 s** | ~140 ms | 0 | ~1 MB (z three.js) |
| `/uslugi/automatyzacja` mobile | 4,4 s | **5,4 s** | ~170 ms | 0 | ~569 KB |

Element LCP na `/`: podtytuł hero ("Automatyzujemy żmudną pracę..."). Na mobile 6,06 s z 6,15 s to
opóźnienie renderu (render delay), nie sieć ani serwer (TTFB 89 ms).

PageSpeed Insights (Lighthouse, z kluczem API), produkcja przed paczką 1, mediana z 3 przebiegów na mobile:

| Strona | Wynik | FCP | LCP | TBT | Speed Index | Waga |
|---|---|---|---|---|---|---|
| `/` mobile | 74 | 3,2 s | 5,2 s | 16 ms | 3,8 s | 864 KB |
| `/uslugi/automatyzacja` mobile | 76 | 3,3 s | 4,3 s | 0 ms | 5,1 s | 558 KB |
| `/` desktop (1 przebieg) | 58 | 0,7 s | 1,1 s | **11 158 ms** | 6,3 s | 991 KB |
| `/uslugi/automatyzacja` desktop (1 przebieg) | 98 | 0,6 s | 0,9 s | 42 ms | 1,2 s | 560 KB |

Desktop strony głównej traci punkty przez TBT 11 s: to sfera three.js (punkt 6 niżej), która startuje po `load`
i blokuje wątek główny. PSI nie ma danych CrUX dla workshift.pl (za mały ruch).
Pomiar: `~/.secrets/workshift/PageSpeed_API.env` (klucz w nagłówku `X-goog-api-key`).

## Diagnoza

1. **Nic się nie maluje, dopóki nie przyjdzie i nie wykona się cały główny JS**, a potem tekst hero
   jeszcze wjeżdża animacją. `index.html` chowa statyczny shell SEO (`html.js [data-seo-shell] > *`),
   podtytuł siedzi w `FadeUp` z opóźnieniem 0,6 s i czasem 0,8 s (`HeroTypographic.jsx:141`),
   H1 w `TextReveal` startuje od `opacity: 0` + `blur(5px)` (`TextReveal.jsx:18-22`).
   Luka FCP -> LCP: 1,45 s desktop, 1,53 s mobile.
2. **Ok. 264 KB br JS przed pierwszym malowaniem.** `App.jsx:7-9, 135-138` ładuje eager
   `AnimatedQuoteSection` (120vh wysokości) i `InteractiveServicesBento` (62 KB źródła + `services.js`),
   choć oba są ponad dwa ekrany niżej. `LenisProvider` w `main.jsx` ciągnie gsap + ScrollTrigger
   (~44 KB gzip) na każdą trasę, a Lenis i tak nie wygładza dotyku. framer-motion: 37 miejsc importu,
   ładowany w całości.
3. **Assety z hashem nie były cache'owane** (`cache-control: public, max-age=0, must-revalidate`
   na `/assets/*`, `/fonts/*` i obrazach).
4. **Obrazki:** logo w ukrytym shellu 82 KB (2400x558), 5 logo partnerów w hero 169 KB
   (do 1024 px szerokości przy 28 px wysokości), zdjęcia opinii bez `loading="lazy"`,
   zdjęcie założyciela 251 KB (1365x2048) przy maks. ~420 px szerokości.
5. **Fonty:** 6 plików woff2, 173 KB, bez preloadu, pierwsze żądanie po 2 s na mobile.
6. **Sfera three.js na desktopie** (`HeroParticleSphere.jsx`): ładowanie jest już leniwe (commit `e955a77`),
   ale 2 200 osobnych meshy, `lookAt` na każdym co klatkę i pętla, która nigdy się nie zatrzymuje:
   26-28 fps przy CPU x4, także po przewinięciu 4 000 px dalej.
7. **Leniwe sekcje nie są odroczone:** `lazy()` tylko dzieli kod, jeden `<Suspense>` w `App.jsx:141-151`
   renderuje wszystkie sekcje od razu, więc ich chunki i obrazki pobierają się w oknie LCP.
8. **Powracający użytkownik ze zgodą** dostaje GA4, Clarity, PostHog (64 KB gzip) i piksel Meta
   od razu przy montażu `App`, czyli w oknie LCP.
9. Strona usługi pobiera swój chunk dopiero po wykonaniu `index.js` (łańcuch 2 żądań).
10. Martwe zależności: `@splinetool/*`, `lottie-react`, `retune` (brak importów w `src`).

## Paczka 1: wdrożone 15.10 (bez zmian wizualnych, niezacommitowane)

| Zmiana | Plik | Efekt |
|---|---|---|
| `Cache-Control: immutable` na rok dla `/assets/*`, tydzień + SWR dla `/fonts/*` | `vercel.json` | powracający użytkownik nie pobiera JS/CSS/obrazków drugi raz |
| `manualChunks` jako funkcja: React w `vendor-react`, gsap + ScrollTrigger w `vendor-gsap` | `vite.config.js` | `index` 174,6 -> 103,4 KB gzip; React (60 KB) nie zmienia hasha przy każdym deployu. Pierwsza wizyta bez zmian |
| Logo partnerów: PNG -> WebP 84 px wys. | `src/assets/partners/`, `HeroTypographic.jsx`, `AudytAiPage.jsx` | 163 KB -> 31 KB (logo1 inline jako data URI) |
| Logo w shellu SEO: PNG 80 KB -> WebP 3 KB | `index.html`, `public/brand-assets/logo-dark-96.webp` | -77 KB na każdej trasie, w oknie LCP |
| Zdjęcie założyciela w wersji 900 px | `public/Jakub-Bednarz-900.webp`, `AboutUsSection.jsx`, `AudytAiPage.jsx` | 251 KB -> 46 KB (pełny plik zostaje dla JSON-LD) |
| `loading="lazy"` na zdjęciach opinii | `TestimonialsSection.jsx` | zdjęcia nie konkurują z LCP |
| Skrypty z wcześniejszej zgody startują po `load`, w `requestIdleCallback` | `src/lib/consent.js` | PostHog/GA4/Meta poza oknem LCP u powracających |
| Usunięta tekstura `grainy-gradients.vercel.app/noise.svg` | `InteractiveServicesBento.jsx` | domena zwraca 402 (wyłączony deploy), tekstura i tak się nie wyświetlała; jedno żądanie do obcej domeny mniej |
| Tailwind skanuje tylko `src/` i `index.html` | `src/index.css` | CSS 126,8 -> 123,5 KB; usunięte wyłącznie klasy nieużywane w `src` (sprawdzone diffem selektorów) |

**Po wdrożeniu (#26, 15.10), PSI, mediana z 3 przebiegów mobile:**

| Strona | Wynik | LCP | CLS | Waga | Przed (wynik / LCP / waga) |
|---|---|---|---|---|---|
| `/` mobile | 76 | 4,2 s | 0 | 579 KB | 74 / 5,2 s / 864 KB |
| `/uslugi/automatyzacja` mobile | 60 | 3,5 s | **0,92** w 2 z 3 | 481 KB | 76 / 4,3 s / 558 KB |
| `/` desktop | 58 | 1,05 s | 0 | 706 KB | 58 / 1,1 s / 991 KB (TBT dalej 12 s, sfera) |
| `/uslugi/automatyzacja` desktop | 98 | 0,8 s | 0 | 484 KB | 98 / 0,9 s / 560 KB |

CLS 0,92 na stronie usługi: stopka miała własną granicę `Suspense` obok tras i przy chunku strony
dochodzącym później malowała się pod nagłówkiem. Naprawione w #27 (granica stopki w granicy tras).
Nagłówki na produkcji sprawdzone: `/assets/*` `max-age=31536000, immutable`, `/fonts/*` `max-age=604800`.

Do zweryfikowania po deployu: `curl -sI https://www.workshift.pl/assets/<plik>.js | grep -i cache-control`
ma zwrócić `max-age=31536000, immutable`; pomiar LCP mobile ponownie (ten sam profil co wyżej).

## Paczka 2: do decyzji (zmienia wygląd albo zachowanie)

1. **Hero widoczny od pierwszego malowania** (największy zysk, LCP mobile -1 do -1,5 s): H1, podtytuł
   i CTA bez wejścia z `opacity: 0`; animować tylko elementy dekoracyjne lub sam `transform`.
   Dalszy krok: prawdziwy markup hero w HTML z `build-seo-html.mjs` zamiast chowania shella.
2. **Leniwe `AnimatedQuoteSection` i `InteractiveServicesBento`** (+ montaż sekcji przy zbliżeniu do ekranu,
   IntersectionObserver z `rootMargin`). Uwaga na przewijanie do `#uslugi` (`ScrollToHash`, `ServicesRedirect`).
3. **Lenis tylko dla `(pointer: fine)` i po `load`**: gsap znika ze ścieżki krytycznej na telefonach.
4. **framer-motion przez `LazyMotion` + `m`** i CSS dla animacji hero.
5. **Fonty:** jeden plik Inter z łacinką + polskie znaki (~50 KB), preload; jedna grubość Plex Mono mniej.
6. **Sfera:** jeden `THREE.Points`/`InstancedMesh`, stop pętli poza ekranem i przy `visibilitychange`,
   `prefers-reduced-motion`.
7. `modulepreload` chunku trasy w HTML z `build-seo-html.mjs` (strony usług).
8. Usunąć martwe zależności (`@splinetool/*`, `lottie-react`, `retune`).

Cel: LCP mobile < 2,5 s na `/` i `/uslugi/automatyzacja`.
