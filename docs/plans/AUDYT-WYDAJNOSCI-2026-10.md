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

PageSpeed Insights (Lighthouse, z kluczem API), produkcja przed paczką 1. Uwaga: to pojedyncze przebiegi
(patrz "Metodologia" na końcu), więc liczby mają rozrzut ok. +/- 0,3 s:

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

## Paczka 1: wdrożone 15.10 (#26, bez zmian wizualnych)

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

**Po wdrożeniu (#26, 15.10), PSI, pojedynczy przebieg na stronę (patrz "Metodologia"):**

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

## Paczka 2: wdrożona 15.10 (#28, #29)

- **Hero widoczny od pierwszego malowania** (#28): nagłówek (`TextReveal`) i podtytuł, eyebrow, CTA (`Rise`
  w `HeroTypographic.jsx`) bez `opacity: 0`, animowane tylko przesunięciem i od razu (`animate` zamiast `whileInView`).
- **Leniwe `AnimatedQuoteSection` i `InteractiveServicesBento`** (#28), w jednej granicy `Suspense` z resztą sekcji;
  `ScrollToHash` i `ServicesRedirect` ponawiają przewijanie do 5 s, aż cel jest w DOM.
- **Lenis + gsap dynamicznie po `load`, tylko `(pointer: fine)`** (#28), naprawiony wyciek tickera gsap.
- **Usunięte martwe zależności** (#28): `@splinetool/*`, `lottie-react`, `retune`.
- **Sfera jako jeden `THREE.Points`** z shaderem (#29), pętla stoi poza ekranem, `prefers-reduced-motion`.
  Headless Brave, CPU x4: stara 13-16 fps i ok. 10,5 s długich zadań, nowa 59-60 fps i 0.

JS + CSS ścieżki krytycznej strony głównej: 274 -> 170 KB gzip.

**PSI po paczce 2 (pojedynczy przebieg na stronę, patrz "Metodologia"; rzetelne mediany niżej):**

| Strona | Wynik | FCP | LCP | TBT | Waga | Przed audytem (wynik / LCP) |
|---|---|---|---|---|---|---|
| `/` mobile | **93** | 2,4 s | **2,55 s** | 98 ms | 583 KB | 74 / 5,2 s |
| `/` desktop | **92** | 0,5 s | 0,54 s | **202 ms** | 711 KB | 58 / 1,1 s (TBT 11,2 s) |
| `/uslugi/automatyzacja` mobile | 88 | 2,15 s | 3,45 s | 84 ms | 484 KB | 76 / 4,3 s |
| `/uslugi/automatyzacja` desktop | 99 | 0,6 s | 0,8 s | 4 ms | 486 KB | 98 / 0,85 s |

## Paczka 3: LCP stron usług (#30)

Diagnoza (PSI): element LCP na `/uslugi/*` to opis usługi (`p.text-lg` w `ExpandedServiceView`), opóźnienie
renderu 1,28 s. Dwie przyczyny:

1. Kontener `ExpandedServiceView` startował z klasą `opacity-0`, a gsap odsłaniał go po załadowaniu JS
   (0,55 s `opacity` + `clipPath` + `scale`). Ten sam wzorzec co wcześniej w hero.
2. Strona usługi importowała `ExpandedServiceView` z modułu bento strony głównej, więc przed renderem
   dociągała cały moduł bento (CircularGallery, Terminal, podglądy) i gsap: ok. 112 KB gzip chunków trasy,
   do tego pobieranych dopiero po wykonaniu `index.js`.

Zmiany:
- `ExpandedServiceView` (+ karty, `InsightTile`) w osobnym module `src/components/ExpandedServiceView.jsx`,
  `GlareCard` w `src/components/ui/GlareCard.jsx`. Animacje bez gsap: odsłonięcie, wejście kart i kroków
  to klasy CSS w `src/index.css` (`service-reveal`, `service-card-in`, `service-step-in`; bez `opacity` na
  treści), licznik metryki przez `animate` z framer-motion. Chunki trasy: 112 -> 35 KB gzip.
- `build-seo-html.mjs` dopisuje do HTML podstron `<link rel="modulepreload">` chunków ich modułu
  (z manifestu Vite, który potem usuwa z `dist`): usługi, blog, kalkulator, audyt, prompty, polityka.
  Strona główna bez zmian.

Pomiar lokalny (headless Brave, Slow 4G 150 ms / 1,6 Mb/s, CPU x4, 3 przebiegi, `vite preview` bez CDN
i brotli przeciw produkcji): LCP `/uslugi/automatyzacja` 2,35 s przeciw 3,19 s na produkcji w tym samym
przebiegu; luka FCP -> LCP ok. 0,7 s zamiast ok. 1,3 s. Wynik PSI po wdrożeniu (#30): tabela niżej.

## Stan po paczkach 1-3 (15.10, PSI, mediana z 3 przebiegów bez pamięci podręcznej PSI)

| Strona | Mobile: wynik | Mobile: FCP | Mobile: LCP | Desktop: wynik | Desktop: LCP | Waga |
|---|---|---|---|---|---|---|
| `/` | 88 | 2,73 s | 3,15 s | 97 | 0,69 s (TBT 122 ms) | 569 KB |
| `/uslugi/automatyzacja` | 90 | 2,70 s | 3,08 s | 99 | 0,70 s | 404 KB |
| `/uslugi/aplikacja` | 90 | 2,70 s | 3,00 s | 100 | 0,56 s | 402 KB |
| `/uslugi/szkolenia` | 91 | 2,70 s | 2,88 s | 100 | 0,57 s | 393 KB |
| `/uslugi/agenty` | 91 | 2,70 s | 2,93 s | 100 | 0,57 s | 393 KB |
| `/uslugi/kreacje` | 90 | 2,63 s | 2,94 s | 100 | 0,56 s | 392 KB |

Desktop: po jednym przebiegu na usługę, 3 na stronę główną. Przed audytem (pojedyncze przebiegi):
`/` mobile 74 / LCP 5,2 s, `/` desktop 58 / TBT 11,2 s, usługa mobile 76 / LCP 4,3 s.

Na mobile FCP stoi na ok. 2,7 s na każdej stronie: tyle trwa pobranie i wykonanie wspólnego JS
(React + framer-motion + index), zanim React pokaże cokolwiek, bo statyczny shell jest ukryty.
LCP przychodzi 0,2-0,45 s później. Dalszy zysk to skrócenie tej ścieżki albo pokazanie treści przed JS
(punkty 1 i 3 niżej).

### Metodologia

- Pomiar: PSI API z kluczem (`~/.secrets/workshift/PageSpeed_API.env`, nagłówek `X-goog-api-key`), profil
  Lighthouse mobile (Slow 4G, CPU x4) i desktop. PSI liczy na serwerach Google, więc obciążenie lokalnego
  komputera nie ma wpływu.
- **PSI zwraca wynik z pamięci podręcznej dla tego samego adresu w krótkim odstępie czasu.** Serie
  "3 przebiegów" z tego samego adresu dawały identyczne liczby, więc w tabelach z paczek 1 i 2 każda
  wartość to w praktyce jeden przebieg. Od tabeli wyżej każdy przebieg ma unikalny parametr w adresie
  (`?psi=<tag>-<losowa>`), a URL jest kodowany (`curl -G --data-urlencode`).
- Rozrzut między przebiegami: LCP ok. +/- 0,15 s, między seriami w różnych porach ok. +/- 0,3 s.
  Pojedynczy szczęśliwy przebieg dał wcześniej `/` mobile 93 / LCP 2,55 s; mediana to 88 / 3,15 s.

## Co zostało

1. **framer-motion przez `LazyMotion` + `m`** (37 miejsc importu; vendor-motion 47 KB gzip na ścieżce krytycznej).
2. **Fonty:** jeden plik Inter z łacinką + polskie znaki (~50 KB), preload; jedna grubość Plex Mono mniej.
3. **Hero w HTML:** prawdziwy markup hero z `build-seo-html.mjs` zamiast chowania shella (FCP bez czekania na JS).
4. **Montaż sekcji strony głównej przy zbliżeniu do ekranu** (IntersectionObserver z `rootMargin`).

Cel (LCP mobile < 2,5 s) jeszcze nie osiągnięty: mediany 2,9-3,2 s na `/` i usługach. Największa
dźwignia to punkt 3 (treść w HTML przed JS) i punkt 1 (mniej JS na wspólnej ścieżce).
