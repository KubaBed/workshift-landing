---
version: alpha
name: Workshift
description: >-
  System wizualny Workshift (workshift.pl), butikowego doradztwa AI dla polskich MŚP.
  Jasna baza sage, czarny tekst, jeden akcent lime. Inter mówi, IBM Plex Mono opisuje.
  Jedyny motyw graficzny to warstwy z sygnetu: stoją wszystkie, przesuwa się jedna.
colors:
  sage: "#E6E8DD"
  lime: "#9CE069"
  lime-deep: "#81C44E"
  ink: "#000000"
  white: "#FFFFFF"
  muted-dark: "#595959"
  muted-light: "#AAAAAA"
  destructive: "#DD453D"
  primary: "{colors.lime}"
  on-primary: "{colors.ink}"
  background: "{colors.sage}"
  on-background: "{colors.ink}"
  on-background-muted: "{colors.muted-dark}"
  surface: "{colors.white}"
  inverse-background: "{colors.ink}"
  on-inverse: "{colors.white}"
  line: "rgba(0,0,0,0.12)"
  line-strong: "rgba(0,0,0,0.2)"
  line-on-ink: "rgba(255,255,255,0.16)"
typography:
  display:
    fontFamily: Inter
    fontSize: 96px
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -0.05em
  headline-md:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.025em
  headline-sm:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.02em
  title:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  numeral:
    fontFamily: IBM Plex Mono
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.02em
  label:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.2em
  meta:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.08em
  graphic-headline:
    fontFamily: Inter
    fontSize: 96px
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: -0.03em
  wordmark:
    fontFamily: Inter
    fontSize: 140px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.04em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  default: 10px
  card: 20px
  panel: 24px
  pill: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 96px
  section: 112px
  container: 1320px
  gutter: 24px
  gutter-mobile: 16px
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: 8px 8px 8px 20px
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.lime}"
  button-accent:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: 32px
  card-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.panel}"
    padding: 56px
  kicker:
    textColor: "{colors.muted-dark}"
    typography: "{typography.label}"
  tag:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  stat-tile:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.none}"
    padding: 28px
---
# Workshift - DESIGN.md

Ten plik opisuje system wizualny Workshift tak, żeby człowiek albo agent AI zbudował na jego
podstawie stronę, grafikę, slajd lub dokument bez zgadywania. Tokeny w nagłówku YAML są
wartościami normatywnymi (format: google-labs-code/design.md). Tekst poniżej mówi, jak ich używać.

- Przewodnik z podglądem: https://workshift.pl/brand/
- Tokeny: `tokens.css` · `tokens.json` (W3C) · `tailwind-theme.css` (v4) · `tailwind.preset.js` (v3)
- Klasy komponentów: `ws.css` (prefiks `.wsk-`, pisma w `fonts/`)
- Assety: `logo/`, `motifs/`, `templates/`, logo w PNG w `logo/png/`
- Głos marki (jak piszemy): `VOICE.md`
- Paczka: https://workshift.pl/brand/workshift-brand-kit.zip

Pytania i akceptacja materiałów z logo Workshift: kontakt@workshift.pl.

## Overview

Workshift to butikowe doradztwo AI dla polskich MŚP (6-150 osób). Wdraża automatyzacje
i agentów AI w firmach, które nie mają działu IT: biura rachunkowe, kancelarie, e-commerce,
produkcja, usługi B2B. Prowadzi je Jakub Bednarz z Poznania.

Odbiorca to właściciel albo menedżer, zwykle 30-60 lat. Ma mało czasu i dużo sceptycyzmu
wobec "rewolucji AI". System wizualny ma go uspokoić: wygląda jak dokument od rzetelnego
doradcy, a nie jak reklama startupu.

Charakter systemu:

- **Spokojnie i jasno.** Domyślne tło to sage `#E6E8DD`, ciepła szarozieleń. Czarne sekcje
  służą do kontrastu (kontakt, stopka, wyróżniona karta), biel do kart i dokumentów.
- **Jeden akcent.** Lime `#9CE069` oznacza akcję albo jedno wyróżnienie. Na jednym widoku
  pojawia się raz.
- **Dwa kroje.** Inter do nagłówków i treści (waga 400), IBM Plex Mono do etykiet,
  numerów kroków i liczb, wersalikami z szerokim trackingiem.
- **Warstwy.** Jedynym motywem graficznym jest stos pochylonych warstw z sygnetu. Jedna
  warstwa jest przesunięta i tylko ona jest lime. To obraz obietnicy marki: zmieniamy jeden
  proces, reszta firmy pracuje dalej ("Przebudowa bez burzenia").
- **Konkret.** Każda plansza opiera się na fakcie: liczbie ze źródłem, dacie, nazwie procesu.

## Colors

| Token | Hex | Rola |
|---|---|---|
| `sage` | `#E6E8DD` | Tło strony, grafik i slajdów (domyślne) |
| `lime` | `#9CE069` | Akcent: CTA, wyróżnione słowo, przesunięta warstwa, zaznaczenie |
| `lime-deep` | `#81C44E` | Wyłącznie drugi stop gradientu w sygnecie i warstwie lime |
| `ink` | `#000000` | Tekst; tło sekcji i grafik ciemnych |
| `white` | `#FFFFFF` | Karty na sage, tło dokumentów, tekst na czarnym |
| `muted-dark` | `#595959` | Tekst drugorzędny, etykiety mono na jasnym |
| `muted-light` | `#AAAAAA` | Podpisy na czarnym, elementy wyłączone. Na sage ma 1,9:1, więc nie służy do tekstu |
| `destructive` | `#DD453D` | Tylko komunikaty o błędzie |

Zasady:

- **Proporcje.** Około 70% sage lub biel, 25% czerń, 5% lime. Lime może wypełnić jeden
  przycisk, jeden kafel albo podkład pod jednym słowem.
- **Jedno tło na grafikę.** Sage, czarne albo białe. Nie łącz dwóch teł na jednej grafice
  (na stronie sekcje mogą się zmieniać).
- **Lime nie jest kolorem tekstu na jasnym tle.** Na sage ma kontrast 1,3:1. Na jasnym
  używaj lime jako wypełnienia (przycisk, podkład pod słowem), a tekst stawiaj czarny.
  Na czarnym lime ma 13:1 i może być kolorem słowa.
- **Linie** to czerń z przezroczystością: `rgba(0,0,0,.12)` zwykła, `.2` mocna
  (obramowanie pól, granica sekcji). Na czarnym: `rgba(255,255,255,.16)`.
- **Tekst na czarnym:** biel `1` nagłówek, `.72` akapit, `.55` etykieta mono.
- **Gradient** występuje tylko w sygnecie i w przesuniętej warstwie motywu: lime → lime-deep,
  poziomo. Nie stosuj gradientów na tłach, przyciskach ani tekście.
- **Zakazana paleta (system sprzed 2026):** pomarańcz `#EE703D`, granat `#0A2540`, róż
  `#CC7CAB`, fiolet `#8530D1`, brzoskwinia `#F5A273`, liliowy `#D5A4E7`, chartreuse `#D2FF00`.
  Plik z tymi kolorami jest nieaktualny.

## Typography

Dwie rodziny na licencji OFL, w paczce jako woff2 (`fonts/`), w Google Fonts dla narzędzi
biurowych:

- **Inter** 400 (nagłówki i treść), 500 (etykiety UI, tytuły kart), 700 (tylko wordmark logo),
  800 (tylko nagłówki w grafikach, patrz niżej).
- **IBM Plex Mono** 400 i 500. Wersaliki, tracking 0,08-0,2 em. Liczby mogą być małe.

### Rejestr WWW i dokumentów

| Styl | Rozmiar | Interlinia | Tracking | Waga | Użycie |
|---|---|---|---|---|---|
| `display` | `clamp(48px, 7vw, 96px)` | 1,02 | -0,04 em | 400 | H1 w hero |
| `headline-lg` | `clamp(40px, 5.6vw, 72px)` | 1,05 | -0,05 em | 400 | H1 podstron, tytuł oferty |
| `headline-md` | `clamp(32px, 4vw, 48px)` | 1,1 | -0,025 em | 400 | H2 sekcji |
| `headline-sm` | 24-30 px | 1,2 | -0,02 em | 400 | H3, podtytuł |
| `title` | 20 px | 1,3 | -0,01 em | 500 | Tytuł karty, pozycji listy |
| `body-lg` | 18 px | 1,6 | 0 | 400 | Lead sekcji |
| `body-md` | 16 px | 1,6 | 0 | 400 | Akapit |
| `body-sm` | 14 px | 1,55 | 0 | 400 | Opis w karcie, tabela |
| `numeral` | 40-56 px | 1 | -0,02 em | 400 mono | Statystyka, cena |
| `label` | 11 px | 1,4 | 0,2 em | 400 mono | Kicker nad nagłówkiem, tag |
| `meta` | 12 px | 1,6 | 0,08 em | 400 mono | Data, źródło, numer kroku |

**Nagłówki na stronie i w dokumentach mają wagę 400.** Hierarchię robi rozmiar i ciasny
tracking. Pogrubienie w treści to 500 i kolor `ink`, bez kursywy i bez podkreśleń.

### Rejestr grafik

W grafikach social, reklamach i na slajdach tytułowych nagłówki składamy Inter 800
wersalikami, z interlinią 0,98 i trackingiem -0,03 em. Dwa wyróżniki z zaakceptowanej serii
"Czego AI nie zrobi" (2026):

- jedno słowo na podkładzie lime (prostokąt obrócony o -1,5°, tekst czarny),
- kropka na końcu nagłówka w kolorze lime.

Nad nagłówkiem stoi kicker mono z nazwą serii i numerem (`CZEGO AI NIE ZROBI · CZ. 1`),
pod nim jedno krótkie zdanie w Inter 500. Logo w lewym dolnym rogu.

### Zasady wspólne

- Polskie cudzysłowy „…". Myślnik zawsze jako zwykły dywiz `-`, także w zakresach
  (`2-8 tygodni`). Pauza i półpauza nie występują w materiałach marki.
- Nagłówki z `text-wrap: balance`, szerokość 14-24 ch. Akapity do 64 ch.
- Mono nigdy w akapitach i nigdy dłużej niż dwie linie.
- Zwracamy się per Ty, wielką literą w tekstach do konkretnej osoby (Ty, Twoja firma).

## Layout

- **Kontener:** `max-width: 1320px`, marginesy boczne 24 px (16 px poniżej 768 px).
- **Rytm pionowy:** 96-144 px między sekcjami na desktopie, 80 px na mobile.
- **Sekcje** zmieniają tło: sage, biel, sage, czerń na końcu (kontakt i stopka).
- **Początek sekcji:** kicker mono, 16-20 px odstępu, H2, lead.
- **Siatki kafli** rozdziela 1 px przerwy na tle w kolorze linii (`gap: 1px`), bez ramek
  wokół każdego kafla.
- **Punkty łamania:** 640, 768, 1024, 1280 px. Strona działa od 320 px szerokości.
- **Nagłówek strony:** pływająca pigułka nad treścią, logo po lewej, linki 14 px / 500,
  po prawej mały przycisk lime.
- **Formaty grafik:** margines 7% krótszego boku, logo w lewym dolnym rogu, tekst w lewych
  dwóch trzecich, motyw przy prawej krawędzi.
- **Dokumenty (oferty, raporty):** tło białe, A4, marginesy 20 mm, nagłówki 400, kicker mono
  nad każdą sekcją, numeracja sekcji w mono (`01`, `02`).

## Elevation & Depth

Głębię budują:

1. **Zmiana tła:** sage → biel → czerń.
2. **Linie włosowe** 1 px.
3. **Warstwy motywu** stojące na granicy sekcji albo przycięte krawędzią.

Cień dopuszczamy tylko na pływających elementach strony (nagłówek, dymek kontaktu) i jest
bardzo miękki: `0 8px 32px rgba(0,0,0,.04)`. Półprzezroczyste tło z rozmyciem (24 px) ma
tylko lepki nagłówek. W materiałach drukowanych, grafikach i dokumentach cieni nie ma.

**Ruch** (strona i wideo): wejście sekcji to przesunięcie o 30 px w górę z wygaszeniem,
0,8 s, `cubic-bezier(.21,.47,.32,.98)`. Zmiany koloru 0,2 s. W wideo warstwa lime może
się wsunąć na swoje miejsce; pozostałe warstwy stoją. Przy `prefers-reduced-motion`
animacje są wyłączone.

## Shapes

- **Narożniki:** przyciski, tagi i nawigacja to pigułki (999 px). Karty 20 px, duże panele
  24 px, pola formularza 10 px. Kafle liczb i tabele 0 px.
- **Sygnet:** trzy pochylone warstwy, środkowa przesunięta w prawo i wypełniona gradientem
  lime. Pozostałe dwie są tłumione: czerń 15% → 5% na jasnym, biel 30% → 10% na ciemnym.
  Wordmark "Workshift": Inter 700, tracking -0,04 em, czarny albo biały, płaski.
- **Pole ochronne logo:** wysokość jednej warstwy sygnetu z każdej strony (około połowy
  wysokości litery W). Minimalna wielkość: sygnet 24 px, logo poziome 32 px wysokości
  na ekranie, 120 px szerokości w druku (około 10 mm).
- **Motyw warstw** (`motifs/ws-motif-NN-*.svg`): pięć układów zbudowanych z warstwy sygnetu
  (proporcje warstwy 230 × 64, pochylenie 38, odstęp 32). Zasady:
  - Przesunięta jest jedna warstwa i tylko ona jest lime. Reszta stoi równo.
  - Motyw dotyka krawędzi: przycięty bokiem formatu albo stoi na granicy sekcji.
  - Jeden motyw na widok. Nie obracaj, nie odwracaj w pionie, nie zmieniaj kąta pochylenia.
  - Motyw to dekoracja: `alt=""`, `aria-hidden="true"`, `pointer-events: none`.
- **Ikony:** liniowe, grubość 1,5-2 px, zaokrąglone końce (rodzina Lucide), kolor przez
  `currentColor`. Rozmiary 16, 20, 24 px.

## Imagery

- Zdjęcia ludzi przy pracy w realnym otoczeniu (biuro, magazyn, kancelaria), jasne, naturalne
  światło. Dopuszczalne czarno-białe.
- Zrzuty ekranu prawdziwych narzędzi (arkusz, skrzynka, system księgowy) w ramce karty 20 px.
- Zakaz: roboty, mózgi, chipy, sieci neuronowe, niebiesko-fioletowe gradienty "tech",
  hologramy, stockowi uśmiechnięci biznesmeni, neonowe poświaty, ilustracje generowane
  przez AI udające zdjęcia.

## Components

Klasy z `ws.css` mają prefiks `wsk-`; kontener dostaje klasę `.wsk` (sage) albo `.wsk.wsk-dark`.
Hover zmienia wyłącznie kolor albo przesuwa ikonę strzałki o 2 px.

**Przycisk główny** (`.wsk-btn--primary`): czarna pigułka, Inter 15 px / 500, po prawej lime
kółko 32 px ze strzałką `→`. Jeden na widok. Na czarnym tle odwraca się na biały.

**Przycisk akcentowy** (`.wsk-btn--accent`): lime pigułka z czarnym tekstem, do nagłówka
strony i formularzy. Nie stawiaj go obok przycisku głównego.

**Przycisk obrysowy** (`.wsk-btn--outline`): 1 px linii, obok głównego jako druga akcja.

**Kicker** (`.wsk-kicker`): mono 11 px, tracking 0,2 em, wersaliki, `muted-dark`.
Nazywa sekcję jednym lub dwoma słowami (`NASZ PROCES`, `DLA KOGO`).

**Tag** (`.wsk-tag`): pigułka lime z mono 11 px. Wariant `--quiet` na szarym podkładzie
do kategorii i formatów.

**Wyróżnienie w nagłówku** (`.wsk-hl`): na jasnym tle podkład lime pod dolną połową słowa,
na czarnym słowo w kolorze lime. Jedno na nagłówek.

**Karta** (`.wsk-card`): biel na sage, 20 px, padding 32 px, linia `.12`.
**Panel ciemny** (`.wsk-card--dark`): czerń, 24 px, motyw warstw przycięty na rogu.

**Kafle liczb** (`.wsk-stats`): siatka z 1 px przerwy, liczba w mono 40-56 px, pod nią
etykieta i źródło liczby (`.wsk-stat__source`). Najwyżej jeden kafel lime.

**Kroki procesu** (`.wsk-steps`): wiersze z linią 1 px, numer `01` w mono, aktywny krok
oznaczony krótką pochyloną warstwą lime.

**Tabela** (`.wsk-table`): nagłówek mono nad czarną linią, wiersze z linią `.12`,
wyróżniona kolumna na podkładzie lime 18%.

**Komunikat** (`.wsk-callout`): lewa krawędź lime 3 px, kicker i dwa zdania.

**Cytat** (`.wsk-quote`): Inter 22-30 px / 400, podpis w mono (imię, rola, firma za zgodą).

**Nagłówek grafiki** (`.wsk-poster`, `.wsk-box`, `.wsk-dot`): rejestr plakatowy opisany
w sekcji Typography.

## Do's and Don'ts

**Rób**

- Zaczynaj od tła sage (albo bieli w dokumencie) i jednego dużego nagłówka Inter 400.
- Etykiety, daty, numery kroków i źródła pisz w IBM Plex Mono wersalikami.
- Pokazuj konkret: nazwę procesu, czas wdrożenia, liczbę z podanym źródłem.
- Stawiaj logo w lewym górnym albo lewym dolnym rogu, z polem ochronnym.
- Zostaw jeden lime na widok: przycisk albo wyróżnione słowo albo przesuniętą warstwę.
- Oddzielaj treść liniami 1 px i odstępem.

**Nie rób**

- Pogrubionych nagłówków na stronie i w dokumentach. Waga 800 należy do grafik.
- Kilku elementów lime na jednym widoku, lime jako koloru tekstu na jasnym tle.
- Gradientów poza sygnetem, gradientowego tekstu, poświat, szkła w materiałach.
- Zmian w znaku: kąta pochylenia, przesunięcia górnej lub dolnej warstwy, płaskiego koloru
  zamiast gradientu w środkowej warstwie, efektów na wordmarku.
- Liczb bez źródła ("oszczędność 30% czasu") i obietnic bez daty.
- Emoji w nagłówkach i przyciskach.
- Pauzy i półpauzy w tekście.
