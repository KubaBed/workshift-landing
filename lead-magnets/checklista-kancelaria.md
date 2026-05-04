# 12 procesów do zautomatyzowania w polskiej kancelarii

**Praktyczna checklista dla partnerów i prawników, którzy chcą odzyskać czas — bez ryzyka RODO.**

> **Format:** PDF, 4-6 stron A4
> **Konwersja:** Markdown → PDF (Pandoc, Typora, lub `pdf` skill)
> **Branding:** sage bg + lime accent + Workshift logo top + footer z CTA

---

## Wstęp (strona 1)

### Dlaczego 12, a nie 50?

Listę 50 narzędzi AI dla prawnika znajdziesz w 100 newsletterach. Ta checklista jest inna.

Pracujemy z polskimi kancelariami od 2024. Każdy z 12 procesów poniżej:

- Faktycznie **wdrożyliśmy** w polskiej kancelarii (małej lub średniej)
- Jest **RODO-zgodny** — wskazujemy konkretne ograniczenia
- Ma **policzalną oszczędność** — godziny tygodniowo na osobę
- Wymaga **konkretnego narzędzia** — nie "AI ogólnie", tylko "Claude Sonnet 4 + RAG na bazie umów"

Nie znajdziesz tu pomysłu "AI napisze za was pozew". Znajdziesz 12 wąskich miejsc, w których AI realnie odejmuje pracę powtarzalną — żeby prawnicy mogli robić to, za co klienci płacą.

**Łączna oszczędność z wdrożenia wszystkich 12: ~12-18h tygodniowo na 5-osobową kancelarię.**

> Workshift • workshift.pl/diagnoza

---

## Jak czytać tę listę (strona 1, dół)

Każdy proces ma pięć linii:

```
[1] Nazwa procesu

🕐  Jak teraz (status quo + ile to czasu)
🤖  Jak z AI (konkretny tool + workflow)
⚖️  RODO (ograniczenia, on-prem? anonimizacja?)
💰  Oszczędność (godziny tygodniowo / na osobę / kancelarię)
🛠   Stack (konkretne narzędzia + integracje)
```

Zacznij od procesów z największą oszczędnością. Zwykle to **#1 (notatki ze spotkań)** i **#3 (ekstrakcja terminów)**.

---

## Lista 12 procesów (strony 2-5)

### #1 Notatki ze spotkań klienckich

🕐 **Jak teraz:** Prawnik notuje ręcznie podczas spotkania (rozprasza klienta), potem 30-45 min spisuje notatkę dla teczki sprawy. Zwykle 4-8 spotkań/tydzień/prawnik.

🤖 **Jak z AI:** Spotkanie nagrywane (online lub onsite). Whisper / Speechmatics transkrypcja → Claude lub GPT-4o ekstrakcja w strukturze (decyzje, deadliny, akcje, ryzyka prawne). Notatka w 30 sekund po spotkaniu, prawnik akceptuje/poprawia.

⚖️ **RODO:** OK pod warunkiem zgody klienta na nagrywanie (klauzula informacyjna w umowie). Self-hosted Whisper (na laptopie partnera) eliminuje wysyłkę do US. Claude/GPT API z DPA zawartym przez kancelarię.

💰 **Oszczędność:** **3-5h tygodniowo na prawnika**. Dla 5-osobowej kancelarii: 15-25h/tydz.

🛠 **Stack:** Otter.ai / Fireflies (online) lub Whisper local (onsite) + Claude API + automatyczny zapis do iManage / SharePoint / Notion.

---

### #2 Anonimizacja dokumentów

🕐 **Jak teraz:** Junior lub paralegal ręcznie zaciemnia imiona, PESEL, adresy w dokumentach przed wysłaniem trzeciej stronie (do publikacji, na rozprawę kasacyjną, do publikacji blogowej). 15-30 min/dokument. 5-10 dokumentów/tydzień.

🤖 **Jak z AI:** Custom skrypt z NER (Named Entity Recognition) wytrenowanym na polskim → rozpoznaje osoby, organizacje, miejsca, numery → automatyczne maskowanie z opcją review przed exportem. PDF in → anonimizowany PDF out.

⚖️ **RODO:** Self-hosted ABSOLUTNIE wymagane (wysyłka oryginałów do API trzeciej strony = naruszenie). spaCy + polski model NER + Tesseract OCR — wszystko na infrastrukturze kancelarii.

💰 **Oszczędność:** **2-4h tygodniowo na kancelarię**. Plus zerowe ryzyko ludzkiego błędu (przeoczenie pojedynczego nazwiska w 80-stronicowym dokumencie).

🛠 **Stack:** Python + spaCy (pl model) + presidio (Microsoft) + Tesseract / pdfplumber. Działa na laptopie, nie wymaga chmury.

---

### #3 Ekstrakcja terminów i klauzul z umów

🕐 **Jak teraz:** Prawnik czyta nową umowę (8-30 stron) i ręcznie wypisuje: strony, daty, kwoty, kary umowne, terminy wypowiedzenia, klauzule jurysdykcji, RODO. 30-90 min/umowa. 10-20 umów/tydzień.

🤖 **Jak z AI:** Umowa PDF → OCR (jeśli skan) → Claude/GPT z structured output schema (JSON Schema z polami) → automatyczna tabela w Excel/Notion + alerty kalendarzowe na deadliny.

⚖️ **RODO:** Z DPA OK dla większości firm. Dla umów z klientami zawierającymi dane wrażliwe — preferuj Azure OpenAI EU lub Anthropic z EU residency. Można zrobić local-first: Llama 3.1 70B na własnej infrastrukturze.

💰 **Oszczędność:** **5-8h tygodniowo na prawnika** zajmującego się umowami. Dla 5-osobowej kancelarii skupionej na M&A/handlowych: 20-35h/tydz.

🛠 **Stack:** Claude Sonnet 4 z structured output + n8n (workflow) + Airtable/Notion (DB) + Google Calendar API (deadliny).

---

### #4 Monitoring legislacji + alerty

🕐 **Jak teraz:** Senior partner czyta Dziennik Ustaw, Monitor Polski, biuletyn KIRP, newsletter Rzeczpospolitej. Filtruje co istotne dla klientów. Notatka do klienta. 2-4h tygodniowo.

🤖 **Jak z AI:** Web scraper (RSS lub bezpośredni scraping ISAP) → AI klasyfikator per branża klientów ("ten akt dotyczy: handel, RODO, podatki") → automatyczne podsumowanie 3-5 zdaniami → mail/Slack do partnera tylko gdy hit dla aktywnego klienta.

⚖️ **RODO:** Legislacja jest publiczna, więc OK. Tylko mapowanie "który klient z mojej bazy = która branża" wymaga internalnej DB — ale to nie wychodzi poza kancelarię.

💰 **Oszczędność:** **2-3h tygodniowo na partnera**. Plus efekt jakościowy: nigdy nie przegapiasz aktu prawnego ważnego dla klienta = mniej "przepraszam, że nie zauważyliśmy".

🛠 **Stack:** Python scraper + Claude/GPT-4o + Slack API + Notion (per-klient tagi).

---

### #5 Draftowanie typowych pism

🕐 **Jak teraz:** Prawnik kopiuje stary template (z innego klienta), edytuje pod nowy stan faktyczny, sprawdza precedensy, formatuje. 1-3h/pismo. Zwykle 5-15 pism/tydzień (wezwania, odpowiedzi na pozew, reklamacje, opinie krótkie).

🤖 **Jak z AI:** Wewnętrzna baza precedensów kancelarii (Twoje wcześniejsze pisma) → RAG → Claude generuje pierwszy draft pod konkretny stan faktyczny + cytuje konkretne wcześniejsze sprawy z bazy. Prawnik dopina merytorykę, polishuje.

⚖️ **RODO:** Stara baza pism = zwykle dane klientów. Konieczna anonimizacja przed wektoryzacją (patrz #2) lub on-prem RAG (np. Llama + ChromaDB lokalnie).

💰 **Oszczędność:** **30-50% czasu na pismo**. Przy 10 pismach × 2h = 20h tygodniowo zaoszczędzone 8-12h.

🛠 **Stack:** ChromaDB / Pinecone (vector DB) + Claude Sonnet 4 (generation) + custom UI (lub Continue.dev w VSCode dla prawników z technicznym backgroundem).

---

### #6 Custom chat na bazie wiedzy kancelarii

🕐 **Jak teraz:** Junior pyta seniora "jakie były klauzule w sprawie X 3 lata temu", "jakie mamy template do leasingu samochodowego", "jakie precedensy mamy w sprawach RODO". Senior musi pamiętać lub szukać. 1-3h tygodniowo na szukanie.

🤖 **Jak z AI:** Slack bot lub web app — junior pisze pytanie po polsku, RAG na bazie wszystkich pism + opinii + memorandów + maili z poprzednich spraw. Bot odpowiada z cytatami źródłowymi (link do oryginału w iManage).

⚖️ **RODO:** Dane historyczne w RAG = wszystkie dane klientów. Decyzja architektoniczna: anonimizacja przed indeksowaniem (patrz #2), lub on-prem (Llama + ChromaDB), lub Azure OpenAI EU z izolowaną infrastrukturą per klient.

💰 **Oszczędność:** **1-2h tygodniowo na juniora**, ale prawdziwa wartość = senior nie jest przerywany. Compound effect na produktywność senior = nieliczalna.

🛠 **Stack:** Slack API + Claude / Llama lokalnie + ChromaDB + iManage/SharePoint connector.

---

### #7 Klasyfikacja i routing maili przychodzących

🕐 **Jak teraz:** Recepcja / asystent przegląda info@ albo office@ skrzynkę. Sortuje: "do partnera X", "do paralegal", "spam", "klient pyta o status sprawy", "nowa potencjalna sprawa". 1-2h dziennie.

🤖 **Jak z AI:** Mail przychodzi → AI klasyfikuje (kategoria + sugerowany odbiorca + sugerowana priorytet) → tagi w Gmail/Outlook + draftuje odpowiedź dla "łatwych" maili (status sprawy, terminy, pytania ogólne) — asystent tylko approval one-click.

⚖️ **RODO:** Treść maili = często dane wrażliwe. Ten case wymaga lub on-prem (Llama) lub bardzo precyzyjnego DPA z dostawcą + EU residency. Dla małej kancelarii: można zacząć od heurystyk (regex na keywords) + AI tylko dla 20% niesklasyfikowanych.

💰 **Oszczędność:** **5-7h tygodniowo na asystenta / recepcję**.

🛠 **Stack:** Gmail API / Microsoft Graph + Claude (klasyfikacja) + n8n (workflow) + Slack notification.

---

### #8 KYC i sprawdzenie klienta

🕐 **Jak teraz:** Asystent sprawdza KRS, REGON, listy sankcyjne (UE, USA, ONZ), beneficial owner, ewentualnie media monitoring (czy nie ma negatywnej prasy). 30-60 min/nowy klient. 5-15 nowych klientów/mies.

🤖 **Jak z AI:** Workflow: NIP/PESEL/REGON → automatyczne pobranie z KRS API + REGON BIR + sprawdzenie list sankcyjnych (Open Sanctions API) + scraping wiadomości (Google News API) → AI sumuje i wskazuje red flags → asystent dostaje raport + decyduje.

⚖️ **RODO:** OK — dane są publiczne. Ważne: trzymać raport w teczce klienta dla audytu compliance.

💰 **Oszczędność:** **3-5h tygodniowo na kancelarię**. Plus: zerowe przeoczenia (np. klient nagle na liście sankcyjnej rok po onboardingu — można dorzucić alerty).

🛠 **Stack:** Python + KRS API + REGON + Open Sanctions + Google News API + Claude (red flag analysis) + raport PDF.

---

### #9 Rejestr umów i terminy

🕐 **Jak teraz:** Excel z wszystkimi umowami klienckimi (zewnętrznymi i wewnętrznymi). Asystent / paralegal pamięta o terminach wypowiedzenia, renewalach, datach kar umownych. Excel "puchnie", terminy się gubią. 2-3h tygodniowo na utrzymanie.

🤖 **Jak z AI:** Połączenie #3 (ekstrakcja z umów) + automatyczny rejestr w bazie + alerty 30/14/7 dni przed terminem do partnera odpowiedzialnego. Excel zostaje, ale AI sam wpina nowe rekordy + utrzymuje aktualność.

⚖️ **RODO:** OK — wewnętrzny rejestr.

💰 **Oszczędność:** **2-3h tygodniowo na asystenta + zero przegapionych terminów** = uniknięte koszty/ryzyka.

🛠 **Stack:** Airtable / Notion DB + automatyczne wpisywanie z #3 + Slack/email alerts (n8n) + Google Calendar sync.

---

### #10 Klauzule abuzywne — analiza wzorców umów

🕐 **Jak teraz:** Klient (B2C, ubezpieczyciel, deweloper) prosi o przegląd swoich wzorców umów pod kątem klauzul abuzywnych z rejestru UOKiK. Prawnik czyta, porównuje z rejestrem (kilka tysięcy klauzul), wskazuje ryzykowne. 4-8h/wzór.

🤖 **Jak z AI:** Wzór umowy → ekstrakcja klauzul → semantyczne porównanie z embeddingsami rejestru UOKiK → ranking podobieństwa → AI generuje "to jest klauzula podobna do X.Y.Z z rejestru, sugerujemy zmianę na ...". Prawnik weryfikuje top 20 wskazanych.

⚖️ **RODO:** Wzór klienta = jego własność intelektualna. DPA z dostawcą lub on-prem. Rejestr UOKiK jest publiczny.

💰 **Oszczędność:** **2-4h na wzór umowy** (z 4-8h do 2-4h). Skala: dla kancelarii z 10 review wzorców rocznie = 30-50h rocznie.

🛠 **Stack:** UOKiK rejestr scraper → embedding (text-embedding-3-large) → ChromaDB / Pinecone → Claude (semantic comparison + generation).

---

### #11 Korespondencja masowa (faktury, noty, monity)

🕐 **Jak teraz:** Asystent / paralegal przygotowuje masowe wysyłki: noty obciążeniowe do dłużników klientów, monity, prośby o uzupełnienie dokumentów. Każdy template uzupełniany ręcznie z bazy. 30-60 min na 50 dokumentów. Co 1-2 tygodnie.

🤖 **Jak z AI:** Mail merge na sterydach: AI podstawia personalizację + dostosowuje ton (firma vs osoba prywatna, pierwszy monit vs trzeci) + sprawdza czy adres prawidłowy + automatycznie generuje PDF + mail z trackingiem doręczenia.

⚖️ **RODO:** OK — to dane Twoich klientów + ich kontrahentów. Standardowa zgoda biznesowa.

💰 **Oszczędność:** **1-2h tygodniowo na asystenta**.

🛠 **Stack:** n8n + Google Docs API (templates) + Claude (personalization) + DocuSign / e-podpis (jeśli wymagany).

---

### #12 Przygotowanie do rozprawy

🕐 **Jak teraz:** Prawnik na 1-2 dni przed rozprawą czyta całą teczkę (pisma stron, postanowienia, dowody), robi notatki do wystąpienia, przygotowuje pytania do świadków. 4-8h/sprawa.

🤖 **Jak z AI:** AI sumuje całą teczkę → kluczowe daty, kluczowe argumenty drugiej strony, sprzeczności w zeznaniach świadków, brakujące dowody. Prawnik dostaje 3-stronicowy executive summary + sugerowane pytania → buduje wystąpienie.

⚖️ **RODO:** Teczka klienta. Wymagane self-hosted lub Azure OpenAI EU z DPA. Najbardziej wrażliwy z 12 use case'ów.

💰 **Oszczędność:** **2-3h na sprawę** (z 4-8h do 2-5h). Skala: prawnik z 5 sprawami/tydzień = 10-15h tyg.

🛠 **Stack:** Llama 3.1 70B on-prem (preferowane) lub Azure OpenAI EU + Claude API z DPA. PDF parser (pdfplumber) + structured output. Custom UI w przeglądarce.

---

## Co zrobić z tą listą? (strona 5)

### Krok 1: Prioritetyzuj (5 minut)

Zaznacz w tabeli każdy proces:

| # | Nazwa | Robimy to dzisiaj? | Boli? (1-5) | Twoja decyzja |
|---|---|---|---|---|
| 1 | Notatki ze spotkań | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 2 | Anonimizacja | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 3 | Ekstrakcja terminów z umów | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 4 | Monitoring legislacji | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 5 | Draftowanie pism | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 6 | Chat na bazie wiedzy | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 7 | Klasyfikacja maili | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 8 | KYC | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 9 | Rejestr umów + terminy | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 10 | Klauzule abuzywne | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 11 | Korespondencja masowa | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |
| 12 | Przygotowanie do rozprawy | ⬜ | ⬜ | ⬜ Wdrożyć w Q1 / ⬜ Q2 / ⬜ Nie |

### Krok 2: Zacznij od jednego (15 minut)

Wybierz proces z najwyższym "boli" (5/5) i najwyższą oszczędnością (zwykle #1, #3 lub #5). Jeden proces. Nie 12.

### Krok 3: Daj nam 30 minut (online, bezpłatnie)

Pokażemy Ci:
- Architekturę dla 1-3 wybranych procesów
- Stack RODO-zgodny dla Twojej kancelarii (on-prem vs cloud)
- Estymację: czas wdrożenia + koszt + ROI w miesiącach
- Co już mamy gotowe z innej kancelarii (kod, narzędzia, szablony)

**Workshift • workshift.pl/diagnoza • kontakt@workshift.pl**

---

## Footer (strona 6)

### Kim jesteśmy

Workshift to AI consulting partner dla polskich MŚP. Specjalizacja: kancelarie prawne, e-commerce, firmy produkcyjne. Pracujemy m.in. z Mądry Maśliński Law & Consulting.

Naszym fundatorem jest Jakub Bednarz — wspólnik w kancelarii prawnej + 10 lat marketingu technicznego (Aspiratio, Vytal, MMLC). Certyfikowany ekspert AI: Google "Umiejętności Jutra AI" + Elephant AI "AI dla Managerów".

Nie jesteśmy software house, który "też robi AI". AI jest naszą jedyną specjalizacją.

### Co znajdziesz dalej na workshift.pl

- **Bezpłatny kalkulator strat czasowych:** [workshift.pl/kalkulator](https://workshift.pl/kalkulator) — w 60 sekund zobaczysz ile Twoja kancelaria traci na powtarzalnych zadaniach
- **Newsletter "AI Praktycznie":** co dwa tygodnie jeden konkretny proces z liczbami — [workshift.pl#newsletter](https://workshift.pl#newsletter)
- **Blog:** case studies + tutoriale — [workshift.pl/blog](https://workshift.pl/blog)
- **Kontakt:** [kontakt@workshift.pl](mailto:kontakt@workshift.pl) lub [LinkedIn Jakub Bednarz](https://www.linkedin.com/in/jakubbednarz/)

---

> © 2026 Workshift. Możesz udostępnić tę checklistę. Nie modyfikuj treści ani brandingu.
