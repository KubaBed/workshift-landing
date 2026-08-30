# SEO - mapa słów kluczowych workshift.pl

**Data:** 2026-08-30
**Status danych:** ⚠️ Brak podpiętego OpenSEO/Ahrefs w sesji - **żadna liczba w tym dokumencie nie jest zmierzonym wolumenem**.
Priorytety poniżej to hipotezy oparte na analizie treści serwisu, ICP z `MARKETING_SALES_PLAN.md`
i strukturze polskiego rynku. Przed alokacją budżetu treściowego **zweryfikuj wolumen, KD i SERP w OpenSEO**
(instrukcja podpięcia na końcu dokumentu).
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

## 2. Klastry słów kluczowych

Priorytet = (dopasowanie do oferty × intencja zakupowa) ÷ szacowana konkurencja.

### Klaster A - rdzeń komercyjny (priorytet: 🔴 najwyższy)
Cel: `/` + nowy hub `/uslugi`

| Fraza | Intencja | Docelowy URL | Uwagi |
|---|---|---|---|
| automatyzacja procesów biznesowych | komercyjna | `/uslugi/automatyzacja` | już w title strony głównej - rozdzielić: home = marka + kategoria, usługa = fraza |
| wdrożenie AI w firmie | komercyjna | `/uslugi/automatyzacja` | fraza „money", wysoka konkurencja od software house'ów |
| automatyzacja procesów AI | komercyjna | `/uslugi/automatyzacja` | |
| agencja AI / agencja automatyzacji AI | nawigacyjno-komercyjna | `/` | |
| konsulting AI dla firm | komercyjna | nowy `/uslugi` | pasuje do pozycjonowania „boutique AI consulting" |
| sztuczna inteligencja w firmie | informacyjno-komercyjna | hub + blog | szerokie, dobre na TOFU |
| AI dla małych i średnich firm / AI dla MŚP | komercyjna | nowy `/uslugi` | dokładnie ICP z planu sprzedażowego |
| automatyzacja pracy biurowej | komercyjna | `/uslugi/automatyzacja` | |

### Klaster B - narzędziowe long-tail (priorytet: 🔴 najwyższy - najlepszy stosunek zwrotu do wysiłku)
Najniższa konkurencja w całym zestawie, a intencja jest wprost wdrożeniowa. Workshift już używa tego stacku.

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

> To jest klaster, od którego bym zaczął. Fraz jest dużo, każda jest wąska, a osoba, która ich szuka,
> ma już zdefiniowany problem.

### Klaster C - agenci, chatboty, voiceboty (priorytet: 🟠 wysoki)
Cel: `/uslugi/agenty`

- chatbot AI dla firmy
- chatbot na stronę internetową (cena / wdrożenie)
- agent AI dla firmy / agenci AI wdrożenie
- voicebot dla firm / voicebot obsługa klienta
- automatyzacja obsługi klienta AI
- bot do obsługi zapytań e-commerce
- chatbot AI po polsku

### Klaster D - szkolenia (priorytet: 🟠 wysoki, wyraźna sezonowość: wrzesień + styczeń)
Cel: `/uslugi/szkolenia`

- szkolenia AI dla firm
- szkolenie ChatGPT dla firm
- warsztaty AI dla pracowników
- szkolenie z automatyzacji AI
- szkolenie AI Poznań
- kurs AI dla firm / szkolenie prompt engineering dla firm

### Klaster E - branżowe (priorytet: 🟠 wysoki - **największa luka w serwisie**)
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

### Klaster F - lokalne (priorytet: 🟡 średni, ale bardzo tanie)
Masz `LocalBusiness` schema i adres w Poznaniu - wykorzystaj to.

- agencja AI Poznań *(już w meta)*
- automatyzacja procesów Poznań
- wdrożenie AI Poznań / Wielkopolska
- szkolenia AI Poznań
- konsultant AI Poznań

Wariacje regionalne (Warszawa, Wrocław) tylko jeśli faktycznie obsługujecie zdalnie i chcecie
budować pod to osobne strony - inaczej rozmyje to sygnał lokalny.

### Klaster G - koszty i decyzja zakupowa (priorytet: 🟠 wysoki - najkrótsza droga do leada)
To frazy zadawane tuż przed kontaktem. Niski wolumen, bardzo wysoka konwersja.

- ile kosztuje wdrożenie AI w firmie
- koszt chatbota AI / cennik chatbot AI
- audyt AI dla firmy - cena
- ile kosztuje automatyzacja procesów
- czy warto wdrażać AI w małej firmie
- ROI z wdrożenia AI

Naturalne wsparcie: `/kalkulator` (kalkulator strat czasowych) i `/audyt-ai` już istnieją i są
idealnymi celami dla tego klastra - brakuje im tylko treści okołofrazowej.

### Klaster H - dotacje i finansowanie (priorytet: 🟡 średni, ale niedoceniany)
Polskie MŚP szukają tego aktywnie, a konkurencja treściowa jest głównie ze strony firm doradczych,
nie wdrożeniowych.

- dofinansowanie na wdrożenie AI
- dotacje na cyfryzację firmy
- KPO / FENG a wdrożenie AI
- bon na cyfryzację AI

### Klaster I - zgodność i ryzyko (priorytet: 🟠 wysoki dla Persony A)
Najczęstsza obiekcja w rozmowach sprzedażowych - warto ją przechwycić w wyszukiwarce.

- AI a RODO w firmie
- AI Act - obowiązki firm
- czy ChatGPT jest zgodny z RODO
- bezpieczne wdrożenie AI - dane firmowe
- lokalne modele AI / LLM on-premise dla firm
- polskie modele językowe PLLuM *(wpis już istnieje - dociągnąć meta i rozbudować)*

### Klaster J - TOFU / blog (priorytet: 🟡 średni - budowa autorytetu, nie leadów)
Częściowo już pokryte istniejącymi wpisami; poniżej luki:

- jak zacząć z AI w firmie
- baza wiedzy firmowej AI *(2 wpisy już istnieją - zbudować z tego hub + wewnętrzne linkowanie)*
- agenci AI - co to jest *(wpis istnieje, brak meta)*
- automatyzacja vs AI - różnica
- najlepsze narzędzia AI dla firm 2026
- przykłady wdrożeń AI w polskich firmach

### Klaster K - widoczność w LLM-ach (AEO/GEO) (priorytet: 🟠 rosnący)
Coraz więcej ruchu B2B zaczyna się w ChatGPT/Claude/Perplexity, nie w Google. Frazy to tu pełne pytania:

- „jaka firma wdraża AI w polskich MŚP"
- „kto robi automatyzacje n8n w Polsce"
- „agencja AI Poznań opinie"

Punkt wyjścia jest już dobry: statyczny fallback z `build-seo-html.mjs` podaje pełną treść
bez JS, a modele i scrapery właśnie tego potrzebują. Do dołożenia: `FAQPage` schema,
jasne odpowiedzi w pierwszym akapicie każdego wpisu, konkretne liczby z case studies,
obecność w katalogach branżowych i cytowalne dane.

---

## 3. Kolejność działań (propozycja)

Fundament techniczny (meta per trasa, sitemap, statyczny fallback) jest już wdrożony -
serwis jest gotowy na treść. Reszta JSON-LD siedzi w `PAPERCUTS.md` i nie blokuje poniższych kroków.

**Sprint 1 - strony branżowe (Klaster E):**
Pięć landingów `/ai-dla/*`. Treść w dużej mierze już istnieje w `IndustriesSection.jsx`
i w personach z `MARKETING_SALES_PLAN.md` - to głównie praca redakcyjna, nie badawcza.
Każda nowa trasa wymaga wpisu w `scripts/seo-routes.mjs`, inaczej nie trafi do sitemapy
ani do statycznego fallbacku.

**Sprint 2 - Klaster B (narzędzia) + Klaster G (koszty):**
Najniższa konkurencja i najkrótsza droga do rozmowy. 6-8 tekstów.

**Sprint 3 - hub `/uslugi` + Klaster A:**
Dopiero gdy serwis ma już zaplecze treściowe do linkowania wewnętrznego.
Dziś `/uslugi` to redirect i jest świadomie wykluczone z `seo-routes.mjs` - zmiana tego
jest decyzją nawigacyjną, nie tylko SEO-ową.

---

## 4. Weryfikacja w OpenSEO - do wykonania

OpenSEO nie było podpięte podczas tworzenia tego dokumentu. Po podłączeniu MCP
(https://openseo.so/docs/mcp) warto przepuścić przez nie:

1. `research_keywords` dla każdego klastra - wolumen, KD, CPC dla rynku PL.
2. `inspect_serp` dla 10-15 fraz pieniężnych (Klaster A, C, D, G) - sprawdzić, czy SERP
   jest zdominowany przez software house'y, katalogi czy porównywarki.
3. `analyze_competitor` na 3-5 polskich agencjach AI - wychwycić frazy, na które rankują, a których
   nie ma na powyższej liście.
4. Search Console dla workshift.pl - frazy z wyświetleniami, ale bez kliknięć (pozycje 8-20)
   to najtańsze wygrane, jakie w ogóle istnieją.

Dopiero po tym warto zamrozić priorytety - obecne oznaczenia 🔴/🟠/🟡 są hipotezą, nie pomiarem.
