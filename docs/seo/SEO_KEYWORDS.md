# SEO - mapa słów kluczowych workshift.pl

**Data:** 2026-08-30 (utworzony) · 2026-08-30 (zweryfikowany w OpenSEO)
**Status danych:** częściowo zmierzony. Klastry A-D przepuszczone przez OpenSEO/DataForSEO
(PL-2616, lang `pl`) + walidacja SERP + Google Search Console. Klastry E-K to **nadal hipotezy** -
struktura jest dobra, ale nikt ich nie zmierzył.

**Legenda werdyktów:** ✅ potwierdzone pomiarem · ❌ obalone pomiarem · ⚠️ poniżej progu raportowania
· ❓ niezmierzone (hipoteza)

Pełne dane, zastrzeżenia metodyczne i lista fraz odrzuconych żyją w kontekście projektu OpenSEO
(sekcje `mapa-fraz-na-strony`, `frazy-do-nieatakowania`, `mapa-okazji-fraz`, `punkt-zerowy-gsc`):
https://app.openseo.so/p/16c40350-276e-49f6-9580-174e198202f1/settings/context
Frazy klastrów A-D są zapisane i otagowane w projekcie (`klaster-automatyzacja-ai`,
`klaster-definicyjny`, `klaster-szkolenia`, `klaster-ai-w-firmie`). **Nie odkupywać tych danych.**
**Stan techniczny:** opisany wobec `main` po scaleniu PR #12 (meta i canonical per trasa,
generowany sitemap, statyczny fallback treści). Otwarte usterki implementacyjne trzymamy
w `PAPERCUTS.md`, nie tutaj - jedna lista, żeby się nie rozjeżdżały.

---

## 1. Punkt wyjścia - co dziś jest na stronie

| Element | Stan |
|---|---|
| Strona główna | `automatyzacja procesów biznesowych AI`, `agencja AI Poznań` (title + meta) |
| Podstrony usług | `/uslugi/automatyzacja`, `/aplikacja`, `/szkolenia`, `/agenty`, `/kreacje` - własne `metaTitle`/`metaDescription` |
| Narzędzia (lead magnety) | `/kalkulator`, `/audyt-ai`, `/prompty` - własne meta |
| Blog | 12 wpisów, kategoria „Wiedza" i „Wydarzenia"; meta per wpis z `postMeta()` |
| Meta i canonical | `src/lib/seo.js` - jedno źródło prawdy, wspólne dla buildu i nawigacji w SPA |
| Statyczny HTML | `scripts/build-seo-html.mjs` - 23 trasy z własnym `<head>` i treścią w `<body>` dla crawlerów bez JS |
| Sitemap i robots | generowane w buildzie; `Disallow` na `/showcase`, `/oferta/`, `/thank-you` |
| Branże | Kancelarie, HR/rekrutacja, E-commerce, Agencje reklamowe - **tylko jako sekcja na stronie głównej, bez własnych URL-i** |

### 1.1 Gdzie szukać otwartych usterek

Lista blokerów technicznych, którą ten dokument nosił w pierwszej wersji, jest nieaktualna -
meta per wpis, generowany sitemap i wykluczenie `/oferta/` zostały wdrożone w PR #12.
To, co z niej zostało otwarte, przeniosłem do `PAPERCUTS.md`, bo tam mieszkają usterki
implementacyjne i tam trafia feedback z audytów. Dwie listy tego samego zawsze się rozjadą.

Otwarte pozycje SEO-owe w `PAPERCUTS.md` (obszar `global`): brak `Article`/`Service`/`BreadcrumbList`
w JSON-LD oraz rozjazd domeny między canonicalem (`www`) a blokiem `LocalBusiness` (apex).

Ten dokument od tego miejsca zajmuje się **wyłącznie doborem fraz i treścią** - nie stanem kodu.

---

### 1.2 Wynik weryfikacji w OpenSEO (30.08.2026)

Punkt wyjścia z Search Console: **4 zapytania, 10 wyświetleń, 1 kliknięcie w 30 dni**, wszystkie
na stronie głównej. Żadna podstrona nie ma jeszcze ekspozycji, więc kanibalizacji nie ma
i cała mapa poniżej jest projektowa, nie naprawcza.

| Hipoteza z pierwszej wersji | Werdykt | Dane |
|---|---|---|
| Klaster B (n8n, Make) = 🔴 „od którego bym zaczął" | ❌ **ostrzeżenie** | Gołe `n8n`: 33 100/mies., ale **CPC 0,53 zł**. Ta cena zdradza szukających darmowego tutoriala, nie kupujących wdrożenie. *Zastrzeżenie: mierzono gołe `n8n`, nie `wdrożenie n8n` ani `n8n dla firm` - te są węższe i mogą być komercyjne. Sygnał mocny, spór nierozstrzygnięty.* |
| Klaster C (agenci, chatboty) = 🟠 wysoki | ❌ **obalony** | Nasiono `chatbot ai dla firmy` nie zwróciło **żadnego** polskiego popytu B2B - wyłącznie globalny szum (`cursor ai`, `ai detector`, `github ai`, `janitor ai`). |
| Klaster D (szkolenia) = 🟠 wysoki | ✅ **podniesiony** | Największy zbiór popytu komercyjnego po polsku w całym badaniu. Ale SERP instytucjonalny - patrz klaster D. |
| `automatyzacja procesów biznesowych` | ✅ | 590/mies., KD 0, **CPC 6,81 zł**, intencja komercyjna. |
| `sztuczna inteligencja w firmie` | ✅ | 90/mies., CPC 2,75 zł, intencja komercyjna. Mały wolumen, idealne ICP. |
| `automatyzacja pracy biurowej` | ❌ **obalona** | Nasiono rozpada się w szum rekrutacyjny (`pracuj.pl`, `oferty pracy lublin`, `4-dniowy tydzień pracy`). Nie powtarzać tego nasiona. |
| `wdrożenie AI w firmie`, `AI dla MŚP`, `agent AI dla firm` | ⚠️ | Poniżej progu raportowania DataForSEO. To nie znaczy „zero wyszukań", ale znaczy „za mało, by budować na tym architekturę". |
| Klastry E-K | ❓ | Niezmierzone. Zwłaszcza klaster E (branżowe) pozostaje sensowną hipotezą - nikt jej nie podważył ani nie potwierdził. |

**Czego w pierwszej wersji zabrakło:** fraza `automatyzacja ai` nie występowała w dokumencie ani
razu, a jest najlepszym pojedynczym celem w całym zestawie (480/mies., KD 0, CPC 4,64 zł,
trend rosnący od zera w 2023). Dodana niżej jako klaster A0.

**AI Overview** stoi na pozycji 1 we wszystkich trzech sprawdzonych SERP-ach. Kliknięcia organiczne
są sprężone niezależnie od pozycji - to argument za frazami komercyjnymi, gdzie klik nadal ma
wartość, przeciw informacyjnym o dużym wolumenie.

---

## 2. Klastry słów kluczowych

Priorytet = (dopasowanie do oferty × intencja zakupowa) ÷ szacowana konkurencja.

### Klaster A0 - `automatyzacja ai` (priorytet: 🔴 **najwyższy, zmierzony**) ✅
Cel: `/uslugi/automatyzacja` (strona istnieje, treść za krótka)

| Fraza | Wol./mies. | KD | CPC | Intencja |
|---|---|---|---|---|
| **automatyzacja ai** | 480 | **0** | **4,64 zł** | informacyjna, ale CPC komercyjne |
| automatyzacja procesów ai | 20 | b.d. | 4,22 zł | informacyjna |

**Dlaczego to jest pierwszy cel, a nie klaster B:** KD 0, najwyższy CPC z fraz o tym wolumenie,
trend rosnący od zera w 2023. A przede wszystkim SERP dowodzi, że **format usługowy tam rankuje**:
w top 10 stoją dwa polskie butiki stroną usługową - `sagiton.pl` (poz. 5, `/uslugi/automatyzacja-ai`)
i `dokodu.it` (poz. 7), obok Microsoftu i treści definicyjnych (vtiger, creatio).

**Uwaga konkurencyjna:** `dokodu.it` ma pozycjonowanie niemal identyczne z Workshift
(automatyzacja AI dla firm, oszczędź 40% czasu pracy, pierwsze efekty w 2-3 tygodnie,
CTA na bezpłatną rozmowę). Różnica: oni nazywają stack w copy (n8n, Make, Python), my świadomie nie.

**Krytyczne:** NIE mieszać tego z frazą `automatyzacja procesów biznesowych` (klaster A1).
Ich SERP-y mają **zerowe pokrycie domen** - to dwa różne rynki. Jedna strona pod oba przegra oba.

### Klaster A1 - definicyjny: `automatyzacja procesów biznesowych` (priorytet: 🔴 wysoki, zmierzony) ✅
Cel: **nowy wpis na `/blog`** (nie istnieje)

| Fraza | Wol./mies. | KD | CPC | Intencja |
|---|---|---|---|---|
| **automatyzacja procesów biznesowych** | 590 | **0** | **6,81 zł** | **komercyjna** |
| automatyzacja procesów | 480 | **0** | **7,05 zł** | informacyjna |

SERP: 3 z 10 wyników to uczelnie (`wz.uni.lodz.pl` poz. 2, `kozminski.edu.pl` poz. 3, `merito.pl`),
reszta to enterprise (Ricoh, Webcon, Innowise) i szkolenia (Altkom). Wygląda na zabetonowany,
ale **`letsautomate.pl` trzyma poz. 4 zwykłym wpisem** o tym, czym jest automatyzacja procesów
biznesowych - dowód, że wpis firmy usługowej przebija się między uczelnie. To jest mechanika
do powielenia: jedna solidna strona definicyjna, nie wolumen treści.

**Pułapka przy pisaniu:** długi ogon tej frazy jest oblepiony uczelniami (studia podyplomowe, uł,
kozminski, agh, pdf, praca magisterska). Nie ciągnąć treści w tę stronę - zerowa wartość handlowa.

### Klaster A - rdzeń komercyjny (priorytet: 🟠 wysoki - **skorygowany po pomiarze**)
Cel: `/` + nowy hub `/uslugi`

Część fraz z tej listy nie obroniła się w danych. Werdykty w kolumnie Uwagi.

| Fraza | Intencja | Docelowy URL | Uwagi |
|---|---|---|---|
| automatyzacja procesów biznesowych | komercyjna | **wpis `/blog`** (klaster A1) | ✅ 590/mies., KD 0, CPC 6,81 zł. **Przeniesione z `/uslugi/automatyzacja`** - SERP to treść definicyjna i uczelnie, nie strony usługowe |
| wdrożenie AI w firmie | komercyjna | `/uslugi/automatyzacja` | ⚠️ poniżej progu raportowania - brak danych wolumenowych. Nie budować na niej architektury |
| automatyzacja procesów AI | informacyjna | `/uslugi/automatyzacja` | ✅ 20/mies., CPC 4,22 zł - wspierająca dla klastra A0 |
| agencja AI / agencja automatyzacji AI | nawigacyjno-komercyjna | `/` | |
| konsulting AI dla firm | komercyjna | nowy `/uslugi` | pasuje do pozycjonowania „boutique AI consulting" |
| sztuczna inteligencja w firmie | **komercyjna** | sekcja `/uslugi/automatyzacja` | ✅ 90/mies., CPC 2,75 zł. Mały wolumen, czysta intencja, idealne ICP - to oferta, nie TOFU |
| AI dla małych i średnich firm / AI dla MŚP | komercyjna | nowy `/uslugi` | ⚠️ poniżej progu raportowania. Dobra fraza do copy, zła do architektury |
| ~~automatyzacja pracy biurowej~~ | - | **nie atakować** | ❌ nasiono rozpada się w oferty pracy i `pracuj.pl`. Zmierzone, odrzucone |

### Klaster B - narzędziowe long-tail (priorytet: 🟡 **obniżony z 🔴 po pomiarze**) ❌⚠️

> **Ostrzeżenie z danych.** Gołe `n8n` ma 33 100 wyszukań miesięcznie, ale **CPC 0,53 zł**.
> Ta cena mówi wszystko: rynek nie płaci za ten klik, bo szukają go ludzie chcący darmowego
> tutoriala, nie firmy kupujące wdrożenie. To jest dokładnie ta sama pułapka, w którą wpadł
> `easyautomate.pl` - blog na frazach technicznych (`rest api` 4400, KD 73), efekt: pozycje
> 35-63 i 41 odwiedzin. Przyciąga programistów zamiast właścicieli firm.
>
> **Uczciwe zastrzeżenie:** zmierzono gołe `n8n`, a nie `wdrożenie n8n`, `n8n dla firm`
> czy `n8n Polska`. Te są węższe i mogą mieć intencję wdrożeniową. Spór jest **nierozstrzygnięty** -
> przed inwestycją w ten klaster domierzyć te trzy frazy osobno.
>
> Do czasu pomiaru: ten klaster ma sens **wyłącznie jako lejek do `/prompty`**, nie jako droga
> do leada. Nie zaczynać od niego.

| Fraza | Docelowy URL |
|---|---|
| wdrożenie n8n / n8n dla firm | nowa podstrona lub blog |
| n8n Polska / n8n wdrożenie Polska | nowa podstrona |
| automatyzacja Make (Integromat) dla firm | nowa podstrona |
| n8n vs Make / n8n vs Zapier | blog (porównanie) |
| self-hosted n8n dla firmy | blog |
| automatyzacja faktur OCR AI | blog / case study |
| integracja CRM z AI | blog |
| automatyzacja raportów miesięcznych | blog |

> ~~To jest klaster, od którego bym zaczął.~~ **Wycofane po pomiarze 30.08** - patrz ostrzeżenie
> nad tabelą. Zaczynamy od klastra A0 (`automatyzacja ai`), który ma KD 0, CPC 4,64 zł
> i dowód z SERP-a, że format usługowy tam rankuje.

### Klaster C - agenci, chatboty, voiceboty (priorytet: ⬛ **wstrzymany - obalony pomiarem**) ❌
Cel: `/uslugi/agenty`

> **Nasiono `chatbot ai dla firmy` nie zwróciło żadnego polskiego popytu B2B.** Cały wynik to
> globalne narzędzia i szum: `cursor ai` (9900), `ai detector` (49 500), `github ai`, `janitor ai`,
> `minecraft ai bot`. Ani jednej frazy, którą wpisałby polski właściciel MŚP szukający obsługi
> klienta.
>
> To ten sam wzorzec co przy frazie `audyt AI`: **nazwa technologii nie jest tym, co ludzie
> wpisują w Google**. Klient nie szuka agenta AI - szuka sposobu, żeby przestać odpowiadać
> po raz setny na to samo pytanie.
>
> **Co z tym zrobić:** nie porzucać strony, tylko szukać wejścia od strony bólu
> (`obsługa klienta 24/7`, `odpowiadanie na te same pytania`, `pierwsza linia wsparcia`,
> `automatyzacja obsługi zapytań`). Lista poniżej zostaje jako materiał do domierzenia,
> nie jako plan treści. Zgodne z regułą marki z `BRAND.md`: rezultat, nie technologia.

- chatbot AI dla firmy
- chatbot na stronę internetową (cena / wdrożenie)
- agent AI dla firmy / agenci AI wdrożenie
- voicebot dla firm / voicebot obsługa klienta
- automatyzacja obsługi klienta AI
- bot do obsługi zapytań e-commerce
- chatbot AI po polsku

### Klaster D - szkolenia (priorytet: 🔴 **podniesiony po pomiarze**, sezonowość: wrzesień + styczeń) ✅
Cel: `/uslugi/szkolenia`

**To największy zbiór popytu komercyjnego po polsku w całym badaniu** - a miał najniższy
priorytet SEO w notatkach projektu.

| Fraza | Wol./mies. | KD | CPC | Intencja |
|---|---|---|---|---|
| **szkolenia ai dla firm** | 320 | b.d. | **5,97 zł** | **komercyjna** |
| szkolenie ai | 1900 | b.d. | 2,17 zł | **komercyjna** |
| szkolenia ai | 1900 | **0** | 2,17 zł | informacyjna |
| szkolenia z ai dla firm | 40 | b.d. | **8,57 zł** | **komercyjna** |
| szkolenia dla firm | 480 | 21 | 4,54 zł | komercyjna |
| szkolenie sztuczna inteligencja | 260 | 4 | 1,49 zł | informacyjna |
| sztuczna inteligencja szkolenie | 170 | **0** | 1,76 zł | informacyjna |

`szkolenia z ai dla firm` ma **najwyższy CPC w całym badaniu (8,57 zł)** - rynek płaci za ten klik
więcej niż za jakikolwiek inny, który zmierzyliśmy.

> **Ale SERP mityguje, i to mocno.** Top 10 to instytucje: PARP (`akademia.parp.gov.pl`),
> `ai.gov.pl`, EY Academy of Business, Asseco Academy, DAGMA, CodersLab, Progression.
> **KD 0 przy `szkolenia ai` jest mylące** - to nie brak konkurencji, to konkurencja z zapleczem
> instytucjonalnym i budżetem publicznym. Solo butik nie wygra z nimi katalogiem kursów.
>
> **Kąt, który ma szansę:** nie „kurs AI", tylko **warsztat pod Twój konkretny proces** - jedyna
> rzecz, której PARP i EY nie zrobią. Wejście przez długi ogon i różnicę formatu, nie przez
> frazę główną. To decyzja strategiczna, nie techniczna: czy w ogóle wchodzić w ten teren.

- szkolenia AI dla firm
- szkolenie ChatGPT dla firm
- warsztaty AI dla pracowników
- szkolenie z automatyzacji AI
- szkolenie AI Poznań
- kurs AI dla firm / szkolenie prompt engineering dla firm

### Klaster E - branżowe (priorytet: 🟠 wysoki - **największa luka w serwisie**) ❓ niezmierzone
Cztery branże są opisane w `IndustriesSection.jsx`, ale **nie mają własnych URL-i**. To gotowy zestaw
czterech (a docelowo siedmiu - grafiki w `/public` obejmują też healthcare, produkcję i nieruchomości)
stron landingowych pod frazy o wysokiej intencji i niskiej konkurencji.

| Branża | Frazy | Proponowany URL |
|---|---|---|
| Kancelarie prawne | AI w kancelarii prawnej, automatyzacja kancelarii prawnej, AI dla prawników, anonimizacja dokumentów AI, RODO a AI w kancelarii | `/ai-dla/kancelarie-prawne` |
| E-commerce | AI w e-commerce, automatyzacja obsługi klienta sklepu internetowego, opisy produktów AI, generowanie kreacji reklamowych AI | `/ai-dla/ecommerce` |
| HR / rekrutacja | AI w rekrutacji, automatyzacja rekrutacji, screening CV AI, AI dla agencji rekrutacyjnej | `/ai-dla/hr-rekrutacja` |
| Agencje reklamowe | AI dla agencji marketingowej, automatyzacja pracy agencji, generowanie kreacji AI | `/ai-dla/agencje-marketingowe` |
| Produkcja / dystrybucja | automatyzacja procesów w produkcji, AI w firmie produkcyjnej, OCR faktur produkcja | `/ai-dla/produkcja` |

Persona C („Marek z firmy 30-150 osób") z planu sprzedażowego nie ma dziś żadnej strony docelowej -
to najbardziej ewidentna dziura między planem sprzedaży a serwisem.

### Klaster F - lokalne (priorytet: 🟡 średni, ale bardzo tanie) ❓ niezmierzone
Masz `LocalBusiness` schema i adres w Poznaniu - wykorzystaj to.

- agencja AI Poznań *(już w meta)*
- automatyzacja procesów Poznań
- wdrożenie AI Poznań / Wielkopolska
- szkolenia AI Poznań
- konsultant AI Poznań

Wariacje regionalne (Warszawa, Wrocław) tylko jeśli faktycznie obsługujecie zdalnie i chcecie
budować pod to osobne strony - inaczej rozmyje to sygnał lokalny.

### Klaster G - koszty i decyzja zakupowa (priorytet: 🟠 wysoki - najkrótsza droga do leada) ❓ niezmierzone
To frazy zadawane tuż przed kontaktem. Niski wolumen, bardzo wysoka konwersja.

- ile kosztuje wdrożenie AI w firmie
- koszt chatbota AI / cennik chatbot AI
- audyt AI dla firmy - cena
- ile kosztuje automatyzacja procesów
- czy warto wdrażać AI w małej firmie
- ROI z wdrożenia AI

Naturalne wsparcie: `/kalkulator` (kalkulator strat czasowych) i `/audyt-ai` już istnieją i są
idealnymi celami dla tego klastra - brakuje im tylko treści okołofrazowej.

### Klaster H - dotacje i finansowanie (priorytet: 🟡 średni, ale niedoceniany) ❓ niezmierzone
Polskie MŚP szukają tego aktywnie, a konkurencja treściowa jest głównie ze strony firm doradczych,
nie wdrożeniowych.

- dofinansowanie na wdrożenie AI
- dotacje na cyfryzację firmy
- KPO / FENG a wdrożenie AI
- bon na cyfryzację AI

### Klaster I - zgodność i ryzyko (priorytet: 🟠 wysoki dla Persony A) ❓ niezmierzone
Najczęstsza obiekcja w rozmowach sprzedażowych - warto ją przechwycić w wyszukiwarce.

- AI a RODO w firmie
- AI Act - obowiązki firm
- czy ChatGPT jest zgodny z RODO
- bezpieczne wdrożenie AI - dane firmowe
- lokalne modele AI / LLM on-premise dla firm
- polskie modele językowe PLLuM *(wpis już istnieje - dociągnąć meta i rozbudować)*

### Klaster J - TOFU / blog (priorytet: 🟡 średni - budowa autorytetu, nie leadów) ❓ niezmierzone
Częściowo już pokryte istniejącymi wpisami; poniżej luki:

- jak zacząć z AI w firmie
- baza wiedzy firmowej AI *(2 wpisy już istnieją - zbudować z tego hub + wewnętrzne linkowanie)*
- agenci AI - co to jest *(wpis istnieje, brak meta)*
- automatyzacja vs AI - różnica
- najlepsze narzędzia AI dla firm 2026
- przykłady wdrożeń AI w polskich firmach

### Klaster K - widoczność w LLM-ach (AEO/GEO) (priorytet: 🟠 rosnący) ❓ niezmierzone
Coraz więcej ruchu B2B zaczyna się w ChatGPT/Claude/Perplexity, nie w Google. Frazy to tu pełne pytania:

- „jaka firma wdraża AI w polskich MŚP"
- „kto robi automatyzacje n8n w Polsce"
- „agencja AI Poznań opinie"

Punkt wyjścia jest już dobry: statyczny fallback z `build-seo-html.mjs` podaje pełną treść
bez JS, a modele i scrapery właśnie tego potrzebują. Do dołożenia: `FAQPage` schema,
jasne odpowiedzi w pierwszym akapicie każdego wpisu, konkretne liczby z case studies,
obecność w katalogach branżowych i cytowalne dane.

---

## 3. Kolejność działań (skorygowana po pomiarze 30.08)

Fundament techniczny (meta per trasa, sitemap, statyczny fallback) jest wdrożony **i zweryfikowany
na produkcji**. Reszta JSON-LD siedzi w `PAPERCUTS.md` i nie blokuje poniższych kroków.

**Zmiana względem pierwszej wersji:** Sprint 1 był branżowy (klaster E), Sprint 2 narzędziowy
(klaster B). Po pomiarze klaster B spada, a na pierwsze miejsce wchodzi jedyny klaster z twardymi
danymi i dowodem z SERP-a.

**Sprint 1 - klaster A0 `automatyzacja ai` (`/uslugi/automatyzacja`):**
Jedna strona, która już istnieje i wymaga tylko rozbudowy. KD 0, CPC 4,64 zł, dwa polskie butiki
dowodzą, że format usługowy tam rankuje. Najkrótsza droga od zera do pierwszej frazy komercyjnej
w GSC. Zgodnie z workflow designerskim z `CLAUDE.md`: komponenty budujemy najpierw na `/showcase`.

**Sprint 2 - klaster A1, wpis definicyjny (`/blog`):**
Jeden solidny wpis pod `automatyzacja procesów biznesowych` (590/mies., KD 0, CPC 6,81 zł).
Mechanika sprawdzona u `letsautomate.pl` - jeden wpis łapie dwie frazy naraz. Bez CMS-a każdy wpis
to zmiana w `src/data/blogPosts.js`, więc opłaca się jeden dobry, nie pięć przeciętnych.

**Sprint 3 - decyzja o szkoleniach (klaster D):**
Największy popyt komercyjny, ale SERP instytucjonalny. **Najpierw decyzja Kuby, czy w to wchodzić**,
dopiero potem treść. Jeśli tak - kątem warsztatowym, nie katalogiem kursów.

**Sprint 4 - strony branżowe (klaster E):**
Nadal dobra hipoteza i nadal największa luka strukturalna (cztery branże opisane w
`IndustriesSection.jsx` bez własnych URL-i). **Ale niezmierzona.** Przed sprintem: `research_keywords`
na frazach `AI w kancelarii prawnej`, `automatyzacja rekrutacji`, `AI w e-commerce`.
Każda nowa trasa wymaga wpisu w `scripts/seo-routes.mjs`, inaczej nie trafi do sitemapy
ani do statycznego fallbacku.

**Odłożone:** klaster B (narzędzia) do czasu domierzenia `wdrożenie n8n` / `n8n dla firm`.
Klaster C (agenci) do czasu znalezienia wejścia od strony bólu.

**Hub `/uslugi`:** dziś to redirect, świadomie wykluczony z `seo-routes.mjs`. Zmiana tego jest
decyzją nawigacyjną, nie tylko SEO-ową - i nie jest potrzebna do sprintów 1-3.

---

## 4. Weryfikacja w OpenSEO - stan

**Wykonane 30.08.2026** (kredyty wydane, dane zapisane w kontekście projektu - nie odkupywać):

1. ✅ `research_keywords` na 5 nasionach: `automatyzacja procesów`, `sztuczna inteligencja w firmie`,
   `chatbot ai dla firmy`, `automatyzacja pracy biurowej`, `szkolenia ai dla firm`.
2. ✅ `get_serp_results` (depth 10) na 3 frazach granicznych: `automatyzacja ai`,
   `automatyzacja procesów biznesowych`, `szkolenia ai dla firm`.
3. ✅ Analiza konkurencji: `letsautomate.pl`, `easyautomate.pl` (przez `get_ranked_keywords`),
   plus `dokodu.it`, `sagiton.pl`, `kamikstudio.pl` wychwycone z SERP-a. Wszystkie zapisane
   jako konkurenci w projekcie OpenSEO.
4. ✅ Search Console (`query` + `page`): 4 zapytania, 10 wyświetleń, 1 kliknięcie w 30 dni,
   wszystko na stronie głównej. Zero fraz niebrandowych. To jest baseline do mierzenia postępu -
   porównywać do niego, nie do zera.

**Zostało do domierzenia:**

- Klaster B rozstrzygająco: `wdrożenie n8n`, `n8n dla firm`, `n8n Polska` osobno.
- Klaster E (branżowe): frazy kancelaryjne, rekrutacyjne, e-commerce.
- Klaster G (koszty): `ile kosztuje wdrożenie AI w firmie` i pokrewne.
- Profil linkowy (`get_backlinks_overview`) - zero danych o nas i o konkurencji.
- Audyt techniczny (`run_site_audit`) po wdrożeniu statycznego fallbacku.
- Wejście dla klastra C od strony bólu, nie od nazwy technologii.

**Ostrzeżenie metodyczne:** „brak danych" w DataForSEO nie znaczy „zero wyszukań" - znaczy
„poniżej progu raportowania". Dla decyzji o architekturze treści różnica jest nieistotna:
fraza za mała, by ją nieść. Dla copy - już nie, tam takich fraz można używać swobodnie.
