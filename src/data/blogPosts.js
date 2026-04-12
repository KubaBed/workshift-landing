/**
 * Blog posts mock data.
 * Replace with CMS/API fetch when backend is ready.
 */

export const blogCategories = [
  'Automatyzacja',
  'Case Study',
  'Narzędzia',
  'Wiedza',
];

export const blogPosts = [
  {
    slug: 'jak-ai-zmienia-kancelarie-prawne',
    title: 'Jak AI zmienia pracę kancelarii prawnych w Polsce',
    category: 'Case Study',
    date: '2026-04-08',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    excerpt:
      'Wdrożenie automatycznych notatek ze spotkań i custom chata AI w kancelarii Mądry Maśliński — od problemu do +32% odzyskanego czasu.',
    content: `
## Wyzwanie

Kancelaria Mądry Maśliński Law & Consulting obsługuje kilkudziesięciu klientów korporacyjnych. Każde spotkanie generowało godziny ręcznych notatek, a wyszukiwanie precedensów w orzecznictwie pochłaniało czas, który mógłby być poświęcony na doradztwo strategiczne.

## Rozwiązanie

Wdrożyliśmy dwa narzędzia w ciągu 3 tygodni:

### Automatyczne notatki ze spotkań

System transkrybuje rozmowy w czasie rzeczywistym, wyciąga kluczowe ustalenia, terminy i action items. Prawnik dostaje gotowe podsumowanie 30 sekund po zakończeniu spotkania — zamiast spędzać 45 minut na przepisywaniu.

### Custom Chat AI na bazie orzecznictwa

RAG (Retrieval-Augmented Generation) zbudowany na bazie polskiego orzecznictwa. Prawnicy zadają pytanie w naturalnym języku i dostają odpowiedź z konkretnymi sygnaturami i fragmentami orzeczeń.

## Rezultaty

Po 8 tygodniach od wdrożenia:

- **+32% odzyskanego czasu** — prawnicy spędzają go na doradztwie, nie administracji
- **45+ godzin miesięcznie** zaoszczędzonych na samych notatkach
- **Czas wyszukiwania orzecznictwa** skrócony z 2h do 5 minut per zapytanie

> „Nie wyobrażam sobie powrotu do ręcznych notatek. To jak przesiadka z maszyny do pisania na komputer." — Tymoteusz Mądry, Partner

## Wnioski

Automatyzacja w kancelariach prawnych nie zastępuje prawników — uwalnia ich od powtarzalnych zadań. Kluczem jest precyzyjna integracja z istniejącym workflow, nie rewolucja.
    `,
  },
  {
    slug: 'automatyzacja-procesow-biznesowych-przewodnik',
    title: 'Automatyzacja procesów biznesowych: praktyczny przewodnik dla MŚP',
    category: 'Automatyzacja',
    date: '2026-04-01',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    excerpt:
      'Gdzie szukać Quick Wins? Jak zmierzyć ROI? Które procesy automatyzować najpierw? Konkretny framework dla firm 10-200 osób.',
    content: `
## Zanim zaczniesz: audyt procesów

Nie automatyzuj bałaganu — najpierw zrozum, co tak naprawdę robisz. 90% firm, z którymi pracujemy, odkrywa na etapie audytu procesy, o których istnieniu zapomniały.

### Framework priorytetyzacji

Oceniamy każdy proces w skali 1-5 na trzech osiach:

- **Powtarzalność** — czy robi się to samo co tydzień?
- **Podatność na błędy** — czy ludzie się mylą?
- **Czas pochłaniany** — ile godzin tygodniowo?

Procesy z wynikiem 12+ to Twoje Quick Wins.

## Top 5 procesów do automatyzacji w MŚP

### 1. Przepisywanie danych między systemami
Kopiujesz dane z maila do CRM, z CRM do arkusza, z arkusza do faktury? To klasyczny kandydat. Jedno API połączenie eliminuje godziny ręcznej pracy.

### 2. Obsługa powtarzalnych zapytań klientów
80% pytań klientów dotyczy tych samych 20 tematów. Agent AI obsługuje je 24/7, a Twój zespół skupia się na złożonych sprawach.

### 3. Generowanie raportów
Zamiast ręcznie kompilować dane co tydzień — automatyczny pipeline, który dostarcza gotowy raport na inbox w poniedziałek rano.

### 4. Kategoryzacja i routing dokumentów
Faktura? Do księgowości. Reklamacja? Do obsługi. Zapytanie ofertowe? Do handlowca. AI robi to w sekundy.

### 5. Onboarding klientów
Zbieranie danych, podpisywanie umów, tworzenie kont — to przepływ, który powinien działać sam.

## Jak mierzyć ROI

Prosty wzór: **(godziny zaoszczędzone × stawka godzinowa) - koszt narzędzia = ROI miesięczny**

Dla firmy 50 osób typowe ROI pierwszego wdrożenia to 3-8× w skali roku.
    `,
  },
  {
    slug: 'prompt-engineering-dla-biznesu',
    title: 'Prompt engineering dla biznesu: jak rozmawiać z AI, żeby dostawać wyniki',
    category: 'Wiedza',
    date: '2026-03-25',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    excerpt:
      'Nie chodzi o „magiczne zaklęcia" — chodzi o strukturę. 5 technik prompt engineeringu, które działają w codziennej pracy.',
    content: `
## Dlaczego prompt engineering ma znaczenie

Różnica między „napisz mi maila" a dobrze skonstruowanym promptem to różnica między generycznym tekstem a narzędziem, które realnie oszczędza czas.

## 5 technik, które działają

### 1. Role + Context + Task

Zamiast: „Napisz opis produktu"

Użyj: „Jesteś copywriterem e-commerce specjalizującym się w modzie premium. Napisz opis produktu [X] dla sklepu internetowego kierowanego do kobiet 25-40. Ton: elegancki ale przystępny. Długość: 150-200 słów."

### 2. Few-shot examples

Daj AI 2-3 przykłady tego, czego oczekujesz. To najszybszy sposób na kalibrację stylu i formatu.

### 3. Chain of Thought

Dla złożonych analiz: „Przeanalizuj krok po kroku..." wymusza logiczny ciąg myślenia zamiast strzału z biodra.

### 4. Output format specification

„Odpowiedz w formacie JSON / tabeli / bullet points / max 3 zdania" — eliminuje 90% potrzeby edycji.

### 5. Iterative refinement

Pierwszy prompt rzadko jest idealny. Traktuj to jak rozmowę: „Dobrze, ale skróć do 100 słów i dodaj CTA na końcu."

## Najczęstsze błędy

- Za mało kontekstu — AI nie czyta w myślach
- Za dużo instrukcji naraz — dziel na kroki
- Brak przykładów — AI nie wie, jaki styl lubisz
- Traktowanie AI jak wyszukiwarki — to generator, nie baza danych
    `,
  },
  {
    slug: 'agenci-ai-obsluga-klienta',
    title: 'Agenci AI w obsłudze klienta: kiedy wdrożyć, a kiedy odpuścić',
    category: 'Wiedza',
    date: '2026-03-18',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80',
    excerpt:
      'Agent AI to nie chatbot z 2018 roku. Ale też nie rozwiązanie na wszystko. Kiedy wdrożenie ma sens, a kiedy to strata pieniędzy.',
    content: `
## Agent AI ≠ Chatbot

Chatbot z drzewkiem decyzyjnym to 2018. Agent AI rozumie kontekst, uczy się z historii konwersacji i potrafi wykonywać akcje — nie tylko odpowiadać.

## Kiedy wdrożyć agenta AI

### Masz powtarzalne zapytania
Jeśli 60%+ pytań klientów to: status zamówienia, godziny pracy, cennik, dostępność — agent AI obsłuży je lepiej i szybciej niż człowiek.

### Potrzebujesz 24/7
Klient pyta o 23:00? Agent odpowie. Bez nadgodzin, bez zmian nocnych.

### Zespół się nie skaluje
Rośniesz, ale nie chcesz zatrudniać kolejnych 3 osób do obsługi. Agent obsługuje pierwszą linię, ludzie zajmują się eskalacjami.

## Kiedy NIE wdrażać

### Zapytania wymagają empatii
Reklamacje, skargi, sytuacje kryzysowe — tu człowiek jest niezastąpiony. Agent może eskalować, ale nie zastąpi empatii.

### Masz 10 zapytań dziennie
Przy niskim wolumenie koszt wdrożenia nie zwróci się. Lepiej zainwestuj w szablony odpowiedzi.

### Twój produkt jest zbyt złożony
Jeśli każde zapytanie wymaga 15 minut analizy technicznej — agent nie pomoże. Potrzebujesz ekspertów.

## Jak mierzyć skuteczność

- **Deflection rate** — % zapytań rozwiązanych bez eskalacji do człowieka
- **CSAT** — satysfakcja klienta po rozmowie z agentem
- **Czas pierwszej odpowiedzi** — od sekund, nie minut
- **Cost per resolution** — koszt rozwiązania jednego zapytania
    `,
  },
  {
    slug: 'narzedzia-ai-dla-msp-2026',
    title: '8 narzędzi AI, które faktycznie oszczędzają czas w MŚP (2026)',
    category: 'Narzędzia',
    date: '2026-03-10',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    excerpt:
      'Nie kolejna lista „100 narzędzi AI". Tylko 8, które sprawdziliśmy w działaniu u naszych klientów.',
    content: `
## Dlaczego tylko 8?

Bo testowaliśmy dziesiątki. Te 8 zostaje po weryfikacji: czy naprawdę oszczędza czas, czy jest proste we wdrożeniu, czy cena ma sens dla MŚP.

## Lista

### 1. Make (dawniej Integromat)
**Do czego:** Automatyzacja workflow między aplikacjami
**Dlaczego:** Wizualny builder, bogata biblioteka integracji, rozsądna cena
**Koszt:** Od 0 PLN/mies. (1000 operacji)

### 2. Fireflies.ai
**Do czego:** Automatyczne notatki ze spotkań
**Dlaczego:** Transkrypcja + podsumowanie + action items w jednym
**Koszt:** Od ~70 PLN/mies. per użytkownik

### 3. Claude / ChatGPT
**Do czego:** Analiza dokumentów, pisanie, brainstorming
**Dlaczego:** Wszechstronność i ciągły rozwój
**Koszt:** Od ~100 PLN/mies. per użytkownik

### 4. Notion AI
**Do czego:** Zarządzanie wiedzą zespołu
**Dlaczego:** AI wbudowane w narzędzie, które już znasz
**Koszt:** Od ~50 PLN/mies. per użytkownik

### 5. Midjourney / DALL-E
**Do czego:** Kreacje wizualne, mockupy, inspiracje
**Dlaczego:** Setki wariantów w minuty zamiast dni
**Koszt:** Od ~45 PLN/mies.

### 6. Perplexity
**Do czego:** Research z aktualnymi źródłami
**Dlaczego:** Odpowiedzi z cytatami, nie halucynacje
**Koszt:** Od 0 PLN (wersja podstawowa)

### 7. Descript
**Do czego:** Edycja wideo i podcastów
**Dlaczego:** Edycja tekstu = edycja wideo. Rewolucyjna prostota.
**Koszt:** Od ~110 PLN/mies.

### 8. Zapier + GPT
**Do czego:** Proste automatyzacje z AI wbudowanym
**Dlaczego:** Szybki start, nie wymaga kodowania
**Koszt:** Od 0 PLN (ograniczone)
    `,
  },
  {
    slug: 'audyt-ai-co-to-jest',
    title: 'Audyt AI: czego się spodziewać i dlaczego to nie kolejna prezentacja w PowerPoincie',
    category: 'Wiedza',
    date: '2026-03-03',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    excerpt:
      'Audyt AI to nie teoria — to mapa drogowa z konkretnymi Quick Wins. Jak przebiega i co dostajesz na koniec.',
    content: `
## Czym jest audyt AI

Audyt AI to strukturalny przegląd procesów firmy pod kątem automatyzacji i wsparcia sztuczną inteligencją. Nie jest to:
- Prezentacja o trendach AI (nudne)
- Ogólna strategia „transformacji cyfrowej" (puste)
- Lista narzędzi do kupienia (bezużyteczne)

To konkretna analiza: **co robicie, ile to kosztuje, co można zautomatyzować i jaki będzie ROI**.

## Jak przebiega

### Tydzień 1: Mapowanie

Rozmawiamy z kluczowymi osobami w firmie (30-60 min na dział). Pytamy nie o technologię, ale o dzień pracy:
- Co robisz codziennie?
- Co zajmuje najwięcej czasu?
- Gdzie popełniacie najwięcej błędów?
- Co byś zautomatyzował, gdybyś mógł?

### Tydzień 2: Analiza i rekomendacje

Na podstawie zebranych danych tworzymy:
1. **Mapę procesów** — wizualizacja, kto co robi i jak przepływają dane
2. **Scoring automatyzacji** — każdy proces oceniony pod kątem ROI
3. **Quick Wins** — 2-3 procesy do natychmiastowego wdrożenia
4. **Roadmap** — plan na 3-6 miesięcy

### Tydzień 3: Prezentacja i Quick Win

Prezentujemy wyniki + wdrażamy pierwszy Quick Win na żywo. Nie teorię — działające rozwiązanie.

## Co dostajesz na koniec

- Dokument z mapą procesów i rekomendacjami
- Scoring automatyzacji (które procesy automatyzować najpierw)
- Działający Quick Win (dowód, że to naprawdę działa)
- Roadmap z estymacją kosztów i ROI

## Ile to kosztuje

Audyt jest bezpłatny w ramach pierwszej konsultacji. Serio. Bo wiemy, że po zobaczeniu Quick Win 80% firm chce iść dalej.
    `,
  },
  {
    slug: 'kreacje-reklamowe-ai-ecommerce',
    title: 'Kreacje reklamowe AI: jak produkować setki wariantów w dni zamiast miesięcy',
    category: 'Automatyzacja',
    date: '2026-02-24',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    excerpt:
      'Agencja marketingowa tworzy 10 wariantów bannera tygodniowo. AI tworzy 200. Jak to wygląda w praktyce.',
    content: `
## Problem: bottleneck kreacyjny

Każda kampania e-commerce potrzebuje kreacji reklamowych. Dużo kreacji. W różnych formatach, z różnymi komunikatami, pod różne grupy docelowe. Tradycyjnie to wygląda tak:

- Brief → grafik → 3 warianty → feedback → poprawki → 2 tygodnie
- A/B testing? Potrzebujesz minimum 10 wariantów per grupa. Czyli miesiące.

## Rozwiązanie: pipeline kreacyjny z AI

### Krok 1: Brand guidelines jako prompt system

Wczytujemy brand book klienta (kolory, fonty, ton komunikacji) do systemu promptów. AI nie „tworzy od zera" — tworzy w ramach jasno zdefiniowanych zasad.

### Krok 2: Generowanie wariantów

Na podstawie jednego briefu AI generuje:
- 50 wariantów tekstu reklamowego (różne hooki, CTA, długości)
- 50 wariantów wizualizacji (różne kompozycje, tła, motywy)
- Automatyczne łączenie w gotowe kreacje

### Krok 3: Human-in-the-loop

Grafik nie tworzy od zera — kuratuje. Wybiera najlepsze warianty, dopracowuje detale, zatwierdza do publikacji. Czas: godziny zamiast dni.

## Rezultaty u naszych klientów

- **200+ wariantów kreacji** w 3 dni robocze (vs. 10 wariantów tradycyjnie)
- **CTR wyższy o 18.7%** dzięki większej różnorodności testów A/B
- **Koszt per kreacja** spadł o 70%

## Kiedy to nie działa

- Brand wymaga 100% custom ilustracji (AI generuje, nie ilustruje)
- Kreacje wymagają zdjęć produktowych (tu potrzebujesz fotografa)
- Klient nie ma jasnego brand guide (chaos in → chaos out)
    `,
  },
  {
    slug: 'wdrazanie-ai-bez-chaosu',
    title: 'Jak wdrożyć AI w firmie bez chaosu: lekcje z 15 projektów',
    category: 'Wiedza',
    date: '2026-02-17',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    excerpt:
      'Po 15 wdrożeniach wiemy, co działa, a co nie. Najważniejsza lekcja: technologia to 20% sukcesu.',
    content: `
## Lekcja 1: Zacznij od Quick Win, nie od strategii

Firmy, które zaczynają od „strategii AI na 3 lata" — nigdy nie startują. Firmy, które automatyzują jeden proces w 2 tygodnie — robią kolejny miesiąc później.

Quick Win buduje zaufanie zespołu do technologii. Bez zaufania nie ma adopcji.

## Lekcja 2: Change management > technologia

AI to 20% sukcesu. 80% to ludzie. Jeśli zespół nie rozumie, dlaczego się zmienia i jak to im pomoże — będzie sabotować wdrożenie.

Co robimy:
- Warsztaty „dzień z AI" dla każdego działu
- Ambasador AI w zespole (nie IT — biznes)
- Transparent metryki: „zaoszczędziliśmy X godzin w tym miesiącu"

## Lekcja 3: Nie automatyzuj bałaganu

Jeśli Twój proces jest chaotyczny ręcznie — będzie chaotyczny automatycznie, tylko szybciej. Najpierw porządek, potem automatyzacja.

## Lekcja 4: Zostawiaj wiedzę, nie zależność

Każde nasze wdrożenie kończy się szkoleniem. Nie chcemy być „tymi od AI, którym płacimy co miesiąc". Chcemy, żeby klient umiał sam.

## Lekcja 5: Mierz, mierz, mierz

Przed wdrożeniem: baseline (ile czasu, ile błędów, ile kosztuje).
Po wdrożeniu: te same metryki.
Bez pomiaru nie wiesz, czy AI pomogło czy zaszkodziło.

## Najczęstsze błędy

1. „Zautomatyzujmy wszystko naraz" — przepis na katastrofę
2. „IT się tym zajmie" — AI to projekt biznesowy, nie techniczny
3. „Kupmy narzędzie i jakoś to będzie" — bez procesów narzędzie jest bezużyteczne
4. „AI zastąpi ludzi" — AI wspiera ludzi, nie zastępuje
    `,
  },
];

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}

export function getRelatedPosts(currentSlug, count = 2) {
  return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, count);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
