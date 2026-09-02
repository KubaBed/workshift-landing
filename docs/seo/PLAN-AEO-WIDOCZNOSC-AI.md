# Widoczność w wyszukiwarkach AI (AEO) - pomiar zerowy i plan

**Utworzony:** 2026-09-01 · **Narzędzie:** OpenSEO Prompt Explorer (funkcja tylko w aplikacji webowej, nie ma jej w MCP)
**Metoda:** 4 prompty ICP × 4 modele (ChatGPT gpt-5, Claude Sonnet 4.5, Gemini 2.5 Pro, Perplexity sonar-reasoning-pro), kraj PL, web search włączony, flaga marki "Workshift"

---

## Wynik jednym zdaniem

**0 wzmianek na 16 odpowiedzi.** Każdy model, w każdym z czterech pytań, odpowiedział
`no Workshift`. To nie jest niespodzianka przy `hasData:false` w Google, ale jest to
pierwszy twardy pomiar w kanale, który dla nietechnicznego właściciela MŚP staje się
pierwszym miejscem zadania pytania.

Powtarzalne URL-e pomiaru (Prompt Explorer przyjmuje parametry w adresie, więc każdy
pomiar da się odtworzyć jednym kliknięciem):

| # | Prompt | Wynik |
|---|---|---|
| 1 | Szukam firmy, która wdroży automatyzację AI i zautomatyzuje powtarzalne procesy w mojej małej firmie w Polsce. Kogo polecasz? | 0/4 |
| 2 | Ile kosztuje wdrożenie automatyzacji AI w małej firmie w Polsce i od czego zacząć? | 0/4 |
| 3 | Tracę kilka godzin tygodniowo na przepisywanie faktur i ręczne raporty. Jak to zautomatyzować w małej firmie i kto mi w tym pomoże? | 0/4 |
| 4 | Kto prowadzi szkolenia i warsztaty AI dla firm w Polsce? Szukam warsztatu dopasowanego do procesów mojego zespołu. | 0/4 |

Schemat URL-a do odtworzenia:
`https://app.openseo.so/p/16c40350-276e-49f6-9580-174e198202f1/prompt-explorer?q=<prompt>&models=%5B%22chat_gpt%22%2C%22claude%22%2C%22gemini%22%2C%22perplexity%22%5D&cc=PL&hb=Workshift`

---

## Kto zajmuje nasze miejsce

### Prompt 1 - rekomendacja wykonawcy (najwyższa wartość handlowa)

Wymienione firmy: PRODAUT, Klarownia, DSX, DC House, MALINSKI.AI, NoCodeWork, Sagiton,
Agenci AI sp. z o.o., WPROWADZAMY.AI, CodeScriptum, Automation House, autoMEE, Tantor,
Syntalith.ai, Aventium, Autopilot AI.

**Cytowane źródła to w połowie cudze listy, nie strony firmowe:** "Firmy od automatyzacji
w Polsce 2026: mapa rynku i jak wybrać", "TOP 7 polskich firm dostarczających rozwiązania
AI w 2026 roku", katalog "Firmy AI", "Agentic AI dla małych firm w Polsce 2026".

### Prompt 2 - koszt (najczystszy wzorzec do skopiowania)

Odpowiedzi wszystkich czterech modeli są zbudowane niemal wyłącznie z cenników małych
polskich agencji. Cytowane tytuły: "Ile kosztuje wdrożenie AI w firmie? Ceny 2026 | Falcon
Works", "Ile kosztuje automatyzacja procesów w firmie 2026? Cennik | FastLanding.io",
"Ile kosztuje automatyzacja AI w firmie? Cennik 2026 | WebyJuice", "Ile kosztuje wdrożenie
AI w firmie? Cennik 2026 | 30Elevate".

To są firmy mniejsze i młodsze od Workshift. Cytowanie nie wzięło się z autorytetu domeny,
tylko z tego, że **istnieje strona, której tytuł jest dosłowną odpowiedzią na pytanie**.

### Prompt 3 - ból (kategoria przegrana, ustalenie negatywne)

Modele nie odesłały do żadnej firmy wdrożeniowej. Odpowiedziały oprogramowaniem: inFakt,
Fakturownia, wFirma, Symfonia, SaldeoSmart, plus przepisy o KSeF.

**To rozstrzyga otwarte pytanie z kontekstu OpenSEO** ("agentów szukać od strony bólu,
nie od nazwy technologii"). W wyszukiwarce AI framing bólowy nie prowadzi do naszej
kategorii - prowadzi do software'u księgowego. Ból zostaje w copy na stronie, ale treść,
która ma być cytowana, musi zawierać nazwę kategorii.

### Prompt 4 - szkolenia

Sages, Altkom Akademia, Langas, OmegaCode, Grupa MTC, Syntalith, nauczymycie.ai, Buzzcenter,
Akademia AI, Warto Szkolić, STX Next, Asseco, Comarch. Potwierdza ocenę z `SEO_KEYWORDS.md`:
SERP instytucjonalny, ale **butiki się tam przebijają** (OmegaCode, nauczymycie.ai to nie
są instytucje). Kąt "warsztat pod Twój proces" jest tym, czego modele szukają - Claude wprost
premiował firmy deklarujące dopasowanie programu.

---

## Jak działa cytowanie (cztery mechanizmy z pomiaru)

1. **Modele cytują strony kategorii i cudze listy, nie strony główne firm.** Wejście do
   rekomendacji prowadzi przez bycie wymienionym u kogoś, nie przez własny landing.
2. **Tytuł strony jest kluczem dopasowania.** "Ile kosztuje X? Cennik 2026" wygrywa, bo jest
   dosłowną odpowiedzią na pytanie. To ta sama mechanika, co wpis definicyjny letsautomate.pl
   w klasycznym SEO, tylko ostrzejsza.
3. **Konkurencja w AI to inny zbiór niż konkurencja w SERP.** Z sześciu konkurentów zapisanych
   w projekcie OpenSEO w odpowiedziach modeli pojawił się jeden (Sagiton, raz). Za to wypłynęło
   ponad dwadzieścia nazw, których nie ma w naszych notatkach.
4. **Data w tytule ma znaczenie.** Praktycznie każde cytowane źródło ma w tytule "2026".
   Modele z web search preferują treść datowaną.

---

## Co sprawdzone i NIE jest problemem

- **Roboty modeli mają wstęp.** `robots.txt` na produkcji to `User-agent: * / Allow: /`
  z trzema wyjątkami (`/showcase`, `/oferta/`, `/thank-you`). GPTBot, ClaudeBot, PerplexityBot
  i OAI-SearchBot są objęte wildcardem. Nie ma czego odblokowywać.
- **Treść jest widoczna bez JS.** Statyczny fallback z 30.08 działa, `/uslugi/automatyzacja`
  ma 1167 słów w `<body>` bez wykonywania JS.
- **FAQPage JSON-LD jest.** `/uslugi/automatyzacja` serwuje 6 par Question/Answer.

Brak wzmianek nie wynika z barier technicznych. Wynika z tego, że nie ma treści w formacie,
który modele cytują, ani wzmianek u innych.

---

## Plan - pięć działań w kolejności zwrotu

### 1. ODRZUCONE - strona "Ile kosztuje wdrożenie AI w firmie"

Największa luka z pomiaru, ale **decyzja Kuby z 2026-09-01: zostajemy bez ceny**. Reguła
"bez ceny na stronie" z 30.08 obowiązuje szeroko, nie tylko na `/uslugi/automatyzacja`.

Zapisane, żeby temat nie wracał jako otwarty. Konsekwencja: to pytanie ("ile to kosztuje")
zostaje oddane konkurencji w kanale AI i priorytet przenosi się na punkty 2 i 3 poniżej.

### 2. Wejście na cudze listy (tanie, szybkie, poza kodem)

Konkretne cele zidentyfikowane w cytowaniach: "Firmy od automatyzacji w Polsce 2026: mapa
rynku i jak wybrać", "TOP 7 polskich firm dostarczających rozwiązania AI w 2026", katalog
"Firmy AI", "Agentic AI dla małych firm w Polsce 2026". Do tego katalogi typu Clutch PL.

Koszt: kilka maili. Zwrot: pojawienie się w źródle, które cytuje ChatGPT i Perplexity.
To jest jedyne działanie z tej listy, które nie konkuruje o czas z pracą w repo.

### 3. Schema encji - `Organization` i `Person`

Dziś strona serwuje `LocalBusiness` z adresem i godzinami, co jest schematem sklepu, nie
konsultingu. Brakuje `Organization` z `founder`, `sameAs` (LinkedIn) i `knowsAbout`, oraz
`Service` na stronach usługowych.

Powód szczególny dla Workshift: nazwa marki koliduje leksykalnie ("work shift", "tweetshift"
w GSC, pozycja 33,4 na własny brand). Model musi mieć czym zakotwiczyć encję, żeby odróżnić
firmę od zmiany w grafiku pracy. To jest wąskie gardło rozpoznawalności, nie kosmetyka.

### 4. Sekcja szkoleniowa pod kąt "warsztat pod proces"

`/uslugi/szkolenia` ma realną szansę, bo modele premiują deklarację dopasowania programu,
a nie katalog kursów. Wymaga wyraźnego zdania odpowiadającego na pytanie z promptu 4.

### 5. `llms.txt` (najniższy priorytet, eksperyment)

Nie ma go. Standard nie jest jeszcze respektowany przez główne modele, więc traktować jako
tani eksperyment, nie jako pracę o mierzalnym zwrocie. Generować w `build-seo-html.mjs`,
nie ręcznie w `public/`.

---

## Protokół pomiaru postępu

Powtarzać te same cztery prompty raz na kwartał, tymi samymi URL-ami. Metryka etapu 1 to
**pojawienie się marki w choćby jednej z 16 odpowiedzi**, nie pozycja na liście.

### Brand Lookup - uruchomiony 2026-09-01

Share of Voice dla workshift.pl vs 5 konkurentów z projektu, mierzony w cytowaniach ChatGPT
i Google AI Overview:

| # | Domena | Wzmianki | Share of Voice |
|---|---|---|---|
| 1 | sagiton.pl | 2 | 100% |
| 2 | **workshift.pl** | **0** | **0%** |
| 3 | bizprocess.ai | 0 | 0% |
| 4 | dokodu.it | 0 | 0% |
| 5 | easyautomate.pl | 0 | 0% |
| 6 | letsautomate.pl | 0 | 0% |

Zero promptów, w których odpowiedź AI zacytowałaby workshift.pl w treści albo w źródłach.

**Drugie ustalenie, ważniejsze od naszego zera:** cała nasza lista konkurentów z SERP-a
też jest na zerze. Jedyny wyjątek to sagiton.pl z dwiema wzmiankami. Ten rynek jest w kanale
AI praktycznie niezajęty przez firmy, z którymi się porównujemy - zajmują go firmy, których
w ogóle nie mieliśmy na liście (patrz sekcja o promptach powyżej). To zmienia charakter
zadania: nie gonimy nikogo, tylko wchodzimy do kategorii, w której nasi znani konkurenci
także jeszcze nie są.

Uwaga do kosztu: panel raportował "Updated 1h ago", więc odczyt pochodzi z przeliczenia
wcześniejszego tego samego dnia. Nie da się z interfejsu potwierdzić, czy uruchomienie
naliczyło pełne 1,09 USD, czy zwróciło wynik z cache.
