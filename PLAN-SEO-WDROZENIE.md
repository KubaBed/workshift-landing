# Plan wdrożenia SEO - od zera do pierwszej frazy komercyjnej

**Utworzony:** 2026-08-30 · **Podstawa:** pomiary OpenSEO z 30.08 (`SEO_KEYWORDS.md` §1.2)
**Stan:** gotowy do startu, nic nie blokuje

---

## Jak zacząć następną sesję

```bash
git -C ~/Projekty/workshift-landing pull --ff-only
```

Potem przeczytaj w tej kolejności: ten plik → `SEO_KEYWORDS.md` §1.2 i klaster A0 → `BRAND.md` §0.
Dane fraz i konkurencji są w kontekście projektu OpenSEO (nie odkupywać):
https://app.openseo.so/p/16c40350-276e-49f6-9580-174e198202f1/settings/context

Pierwsze zadanie to **Sprint 1** poniżej. Nie zaczynaj od klastra n8n ani od stron branżowych -
powody w `SEO_KEYWORDS.md`.

---

## Stan wyjściowy (zweryfikowany, nie z notatek)

| Fakt | Dowód |
|---|---|
| Fundament SEO jest na produkcji | `/uslugi/automatyzacja` zwraca własny `<title>`, sitemap 23 URL-e, robots blokuje `/showcase` |
| Widoczność organiczna: praktycznie zero | GSC: 4 zapytania, 10 wyświetleń, 1 kliknięcie / 30 dni, wszystko na stronie głównej |
| Żadna podstrona nie ma ekspozycji | GSC `query+page` - brak kanibalizacji, bo nie ma czego kanibalizować |
| `/showcase` **jest** na `main` | `src/pages/ShowcasePage.jsx` istnieje (scalony w `7b414f4`) |
| Treść strony usługowej: **~225 słów** | Za mało na top 3. To jest główny problem, nie technikalia |

---

## Sprint 1 - `/uslugi/automatyzacja` pod frazę `automatyzacja ai`

**Cel:** 480 wyszukań/mies., KD 0, CPC 4,64 zł. Top 10 w 3 mies., top 3 w 6 mies.
**Dlaczego to pierwsze:** jedyny klaster z twardymi danymi ORAZ dowodem z SERP-a, że format
usługowy tam rankuje (`sagiton.pl` poz. 5, `dokodu.it` poz. 7). Strona już istnieje.

### 1.1 Poprawki meta (małe, zrób najpierw)

Plik: `src/data/services.js`, obiekt o `id: 'automatyzacja'`.

| Pole | Dziś | Problem | Kierunek |
|---|---|---|---|
| `metaTitle` | `Audyt i automatyzacja procesów biznesowych \| Workshift` | Celuje we frazę, która wg pomiaru należy do **wpisu blogowego** (Sprint 2), a nie zawiera `automatyzacja ai` | Przestawić na frazę docelową klastra A0 |
| `metaDescription` | `Darmowy audyt procesów + wdrożenie automatyzacji z n8n, Make i AI...` | **Łamie regułę 4 z `BRAND.md`**: „w copy konsumenckim zero nazw stacku". To jest tekst widoczny w SERP-ie | Rezultat zamiast narzędzi |
| `expandedDescription` | zawiera „budujemy pipeline: n8n, Make i dedykowane skrypty" | To samo naruszenie, ale w treści strony | j.w. |

> **Uwaga, nie rób z tego czystki na ślepo.** Karta `innerCards[2]` typu `stack`
> („Narzędzia, których używamy") wymienia n8n i Make **celowo** - to element budujący zaufanie
> u czytelnika, który już wie, czego szuka. Reguła z `BRAND.md` mówi o copy prowadzącym
> (nagłówki, meta, lead), nie o sekcji technicznej niżej. Zostaw ją.
>
> Konkurent `dokodu.it` nazywa stack w nagłówku. To jest realna różnica pozycjonowania,
> a nie przeoczenie - dlatego warto ją utrzymać świadomie, nie przypadkiem.

### 1.2 Treść - z ~225 do 800-1200 słów

To jest właściwa praca. Strona ma dziś strukturę, ale nie ma mięsa.

Sekcje do dołożenia (kolejność sugerowana):

1. **Lead pod frazę** - pierwszy akapit odpowiadający wprost, czym jest automatyzacja AI
   w firmie. Ważne podwójnie: AI Overview stoi na poz. 1 tego SERP-a i cytuje pierwsze akapity.
2. **Konkretne procesy, nie kategorie.** Dziś: „Obieg faktur - od maila do księgowości".
   Do rozwinięcia: co dokładnie się dzieje, ile trwa ręcznie, ile po wdrożeniu.
3. **Case z liczbami** - `innerCards[4]` ma już przykład firmy produkcyjnej. Rozbudować
   o liczby przed/po. Liczby, których wolno używać, są w kontekście OpenSEO (sekcja
   `positioning`, „claimy, których bronimy"): +32% odzyskanego czasu, MMLC 12 h/tydz.
   **Nie wymyślać nowych.**
4. ~~**Cena wejścia** - audyt 4 900 PLN.~~ **WYPADA - decyzja Kuby 30.08: bez ceny
   na stronie.** Zostaje spójne framing „darmowa diagnoza / darmowy audyt". FAQ łapie
   intencję kosztową odpowiedzią o wycenie po diagnozie + kosztach utrzymania (200-600
   PLN/mies., claim z FAQ strony głównej).
5. **FAQ** - 4-6 pytań pod People Also Ask. Podwójny zwrot: bloki PAA w SERP-ie
   plus materiał dla AI Overview i LLM-ów.

**Workflow:** zgodnie z `CLAUDE.md` - nowe komponenty UI budujemy najpierw na `/showcase`,
dopiero potem wpinamy w stronę. `/showcase` jest na `main`, więc nic nie blokuje.

### 1.3 Linkowanie wewnętrzne

- Z `/audyt-ai` i `/kalkulator` do `/uslugi/automatyzacja` (te strony istnieją i są magnesami).
- Z przyszłego wpisu definicyjnego (Sprint 2) - to jest właśnie mechanika `letsautomate.pl`.

### 1.4 Po zmianach - sprawdź, nie zakładaj

```bash
npm run build
grep -o '<title>[^<]*</title>' dist/uslugi/automatyzacja/index.html
perl -CSD -ne '$c+=()=/\x{2014}|\x{2013}/g; END{print "pauzy: ",$c+0,"\n"}' src/data/services.js
```

Statyczny fallback bierze treść z `scripts/seo-routes.mjs` (`plainText` z `expandedTitle`
i `expandedDescription`) - jeśli rozbudujesz treść tylko w `innerCards`, **crawler bez JS jej
nie zobaczy**. To jest najłatwiejsza pułapka w tym sprincie.

### Kryteria ukończenia (✓ wszystkie spełnione 30.08, wdrożenie lokalne)

- [x] `metaTitle` celuje w `automatyzacja ai` („Automatyzacja AI dla firm - audyt i wdrożenie
      | Workshift", 58 zn.), `metaDescription` bez nazw stacku (150 zn.)
- [x] Treść widoczna dla crawlera bez JS: **1098 słów** w `dist/uslugi/automatyzacja/index.html`
      (było 290)
- [x] Sekcja FAQ istnieje (6 pytań, `ServiceFaq` z `keepMounted` - odpowiedzi w DOM przy
      zwiniętym akordeonie) + **FAQPage JSON-LD** w statycznym `<head>`
- [x] Zero pauz (services.js i dist: `0`)
- [x] `npm run build` przechodzi bez ostrzeżeń thin/orphan, lint bez nowych błędów
      (2 zastane `no-unused-vars` na baseline)

Pozostało: review copy przez Kubę na dev (:5183) → push → za 4-6 tyg. odczyt GSC.

---

## Sprint 2 - wpis definicyjny na `/blog`

**Cel:** `automatyzacja procesów biznesowych` (590/mies., KD 0, CPC 6,81 zł, komercyjna)
+ `automatyzacja procesów` (480, KD 0, CPC 7,05 zł).

**Format:** wpis blogowy, nie strona usługowa. SERP to treść definicyjna, uczelnie i enterprise.
`letsautomate.pl` trzyma tam poz. 4 jednym wpisem i łapie nim obie frazy naraz.

**Krytyczne:** to **osobna strona** od Sprintu 1. SERP-y `automatyzacja ai`
i `automatyzacja procesów biznesowych` mają zerowe pokrycie domen. Jedna strona pod oba przegra oba.

**Pułapka:** długi ogon tej frazy to uczelnie (studia podyplomowe, uł, kozminski, agh, pdf).
Nie ciągnąć treści w tę stronę.

**Technicznie:** brak CMS - wpis to zmiana w `src/data/blogPosts.js`. Trasa wchodzi do sitemapy
automatycznie (`scripts/seo-routes.mjs` mapuje `blogPosts`). Składnia renderera w `MEMORY.md`:
listy tylko `- `, linki `[tekst](url)`, `[youtube:ID]`, `> cytat`, `### ` → `<h4>`.

---

## Sprint 3 - decyzja o szkoleniach (wymaga Kuby, nie kodu)

**Dane:** największy popyt komercyjny po polsku w całym badaniu. `szkolenie ai` 1900/mies.
komercyjna, `szkolenia z ai dla firm` CPC 8,57 zł (najwyższy zmierzony).

**Przeciw:** SERP instytucjonalny - PARP, `ai.gov.pl`, EY Academy, Asseco, DAGMA, CodersLab.
KD 0 przy `szkolenia ai` jest mylące: to nie brak konkurencji, to konkurencja z budżetem publicznym.

**Pytanie do decyzji:** czy Workshift w ogóle wchodzi w ten teren? Jeśli tak, to kątem
„warsztat pod Twój konkretny proces", nie katalogiem kursów - to jedyne, czego PARP i EY nie zrobią.

Nie zaczynaj tego sprintu bez odpowiedzi. To decyzja pozycjonowania, nie zadanie wykonawcze.

---

## Sprint 4 - strony branżowe `/ai-dla/*` (najpierw pomiar)

Cztery branże są opisane w `IndustriesSection.jsx`, ale nie mają własnych URL-i. To nadal
największa luka strukturalna serwisu i sensowna hipoteza - **ale nikt jej nie zmierzył**.

Przed sprintem, jedno wywołanie (~30-100 kredytów/nasiono, stan konta ~9900):

```
research_keywords: "AI w kancelarii prawnej", "automatyzacja rekrutacji", "AI w e-commerce"
```

Jeśli wolumeny są poniżej progu raportowania - to jest strategia treściowa dla sprzedaży
i kampanii, nie dla SEO. Nie porzucaj pomysłu, ale nie licz na organik.

Każda nowa trasa wymaga wpisu w `scripts/seo-routes.mjs`, inaczej nie trafi do sitemapy
ani do statycznego fallbacku.

---

## Odłożone świadomie

| Co | Dlaczego | Warunek odblokowania |
|---|---|---|
| Klaster B (n8n, Make) | Gołe `n8n`: CPC 0,53 zł = szukający tutoriala | Domierzyć `wdrożenie n8n`, `n8n dla firm`, `n8n Polska` osobno |
| Klaster C (agenci, chatboty) | Zero polskiego popytu B2B na nazwę technologii | Znaleźć wejście od strony bólu, nie od nazwy |
| Fraza `audyt AI` jako oś SEO | Brak popytu organicznego (jest push, nie pull) | Nie odblokowywać. Zostaje nazwą produktu w kampaniach |
| Hub `/uslugi` | Dziś redirect, wykluczony z `seo-routes.mjs` | Decyzja nawigacyjna, niepotrzebna do sprintów 1-3 |

---

## Papercuts znalezione przy okazji (do `PAPERCUTS.md`, nie blokują sprintów)

1. `metaDescription` usługi `automatyzacja` nazywa stack (n8n, Make) wbrew regule 4 z `BRAND.md` -
   adresowane w Sprincie 1.
2. Przekierowanie apex → www ma **dwa skoki**, a drugi to **307 (tymczasowe)**, nie 301.
   Domyślne zachowanie Vercela. Przy zerowym profilu linkowym bez znaczenia, ale warto poprawić,
   zanim pojawią się linki zewnętrzne.
3. *(już w `PAPERCUTS.md`)* JSON-LD `LocalBusiness` celuje w apex, canonical w www.
4. *(już w `PAPERCUTS.md`)* Brak `Article` / `Service` / `BreadcrumbList` / `FAQPage` w JSON-LD.
   `FAQPage` staje się istotny w Sprincie 1 razem z sekcją FAQ.

---

## Jak mierzyć postęp

Baseline (GSC, 30 dni do 27.08.2026): **4 zapytania, 10 wyświetleń, 1 kliknięcie**, wszystkie
brandowe lub przypadkowe, wszystkie na stronie głównej.

**Sukces etapu 1** = pojawienie się w GSC **jakiegokolwiek** zapytania niebrandowego o intencji
komercyjnej (automatyzacja, AI w firmie, procesy), **niezależnie od pozycji**. Kliknięcia
są metryką etapu drugiego, nie pierwszego.

Pierwszy uczciwy odczyt: **4-6 tygodni po deployu Sprintu 1**. Wcześniejsze sprawdzanie
niczego nie powie - indeks potrzebuje czasu.

```
get_search_console_performance(projectId, dimensions: ["query","page"], days: 90)
```

Porównywać do tabeli w sekcji `punkt-zerowy-gsc` w kontekście OpenSEO, nie do zera.
