export const blogPosts = [
  {
    slug: 'baza-wiedzy-ktora-przekonala-sceptykow',
    title: 'Sceptyka nie przekona prezentacja o AI. Przekona go firmowa baza wiedzy',
    category: 'Wiedza',
    date: '2026-08-30',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/baza-wiedzy-ktora-przekonala-sceptykow.webp',
    excerpt:
      'Najnudniejsze wdrożenie AI, jakie zrobiłem u siebie, zrobiło dla adopcji więcej niż niejeden ambitny projekt. Opisuję je uczciwie: co zadziałało, ile naprawdę trwało i na czym baza wiedzy poległa tak, że musiałem dzwonić do klienta z przeprosinami.',
    content: `
  Na spotkaniu ai use_case opowiadałem o dwóch wdrożeniach, które zrobiłem u siebie. Po prelekcji, w kuluarach, wracało jedno pytanie w kilku wariantach: jak przekonać zespół, że to w ogóle ma sens.

  Odpowiedź jest mniej efektowna, niż większość osób chce usłyszeć.

  **Sceptyka w zespole nie przekona prezentacja o agentach AI. Przekona go pierwszy moment, w którym coś realnie oszczędza mu czas.**

  ## AI nie wykłada się na technologii

  Kiedy wdrożenie AI nie wychodzi, prawie nigdy nie chodzi o model. Chodzi o to, że nikt nie pogadał z ludźmi, którzy mają z tego korzystać.

  Widzę trzy warianty tego samego błędu:

  - **"Przeczytałem post na LinkedIn, od dziś wszyscy korzystamy z AI".** Entuzjazm jest, tylko nikt nie powiedział, do czego i po co.
  - **"Kupiliśmy licencje, możecie korzystać".** Narzędzie stoi, nikt go nie skonfigurował pod nasze procesy, więc po dwóch tygodniach nikt do niego nie wraca.
  - **"Wydaliśmy X tysięcy na automatyzacje, więc to musi działać".** Nikt nie sprawdził, czy faktycznie działa, bo skoro tyle kosztowało, to niewygodnie byłoby się przyznać.

  Wspólny mianownik: najpierw narzędzie, dopiero potem pytanie po co. To trochę tak, jakby kupić wiertarkę, zanim podejmiemy decyzję, gdzie ma wisieć półka.

  A po drugiej stronie stoi ktoś, kto ma swoje powody, żeby się nie palić. Rok temu zapytał ChatGPT o coś ze swojej działki, dostał odpowiedź pewną siebie i błędną. Do tego dochodzi cicha obawa, której nikt nie mówi głośno na zebraniu: że to jest pierwszy krok do zastąpienia go automatem.

  Tej osoby nie przekonasz kolejnym webinarem o transformacji.

  Mówiłem o tym w krótkiej rozmowie zaraz po prelekcji na ai use_case:

  [youtube:pjmxZlt-v9w|pion]

  ## Co zrobiliśmy: baza wiedzy z tego, co już mieliśmy

  Zacząłem od najbardziej przyziemnego problemu, jaki mieliśmy w obsłudze klienta: **pięć osób odpowiadało na to samo pytanie na pięć różnych sposobów.**

  Każdy pamiętał co innego. Przy każdym onboardingu nowej osoby wracało dokładnie to samo pytanie: gdzie znajdę konkrety o ofercie i aktualnych usługach? Odpowiedź brzmiała zawsze tak samo: zapytaj Kasi. Istniała nawet ściągawka w Excelu, ale nikt jej nie aktualizował, więc nikt jej nie ufał.

  Najważniejsza decyzja przy tym wdrożeniu: **nie napisaliśmy ani jednego nowego dokumentu.** Wzięliśmy to, co firma i tak już miała:

  - blog firmowy
  - historyczne oferty
  - transkrypcje 278 rozmów telefonicznych z obsługi klienta, jakieś 26 godzin nagrań
  - cenniki zagranicznych partnerów, słowackie i węgierskie, przetłumaczone i zczytane naszym własnym OCR-em
  - materiały z kursów i szkoleń, które sami prowadzimy

  Te 278 rozmów to rzecz, z której jestem najbardziej dumny, i polecam ją każdemu, kto ma nagrania z obsługi. To nie są pytania wymyślone na warsztacie strategicznym. To prawdziwe pytania klientów, zadane prawdziwym językiem klientów, razem z tym, co ich naprawdę blokowało przed decyzją.

  Efekt jest banalnie prosty do opisania: zespół pyta po polsku, dostaje odpowiedź sformatowaną od razu jako mail do klienta, ze wskazaniem, z którego dokumentu to wiemy.

  ## Ile to naprawdę trwało

  Tu muszę być precyzyjny, bo łatwo o dwa przeciwstawne kłamstwa.

  Pierwsza wersja, z której dało się korzystać, powstała w kilka godzin. To nie jest przesada i to jest ta część, w którą ludzie nie wierzą.

  Ale do wersji, której ufa cały zespół, minęły dwa, trzy tygodnie. I nadal ją poprawiamy, bo baza wiedzy nie jest projektem, który się kończy. Dziś korzysta z niej regularnie siedem osób.

  Żadnego działu IT. Żadnego budżetu na własne oprogramowanie. Narzędzia, które już istnieją, poukładane pod jeden konkretny proces.

  ## Gdzie się wyłożyłem

  Napracowaliśmy się jak w kamieniołomie. Transkrypcje z trzech miesięcy, tłumaczenia cenników, kompendium najczęstszych tematów.

  I wiecie, na czym ta baza poległa? Na najbardziej podstawowym pytaniu świata: **ile wynosi opłata roczna.**

  W bazie siedział stary wpis z bloga ze stawką 100 złotych. Aktualna była dwieście. Trafiło akurat na nową osobę, która nie miała żadnego powodu, żeby podejrzewać, że to nieaktualne. Podała klientowi cenę z bazy, klient później usłyszał inną, i nasza wiarygodność pojechała w dół.

  > Baza wiedzy jest dokładnie tak dobra, jak jej najmniej aktualny dokument.

  To jest lekcja, która kosztowała mnie najwięcej nerwów, i jednocześnie najbardziej praktyczna rzecz w całym tym wpisie. **Najpierw przegląd i sprzątanie źródeł, potem AI.** Nie odwrotnie. Wrzucenie do bazy wszystkiego, co firma ma na dysku, wygląda na oszczędność czasu, a jest odroczoną w czasie wpadką przy kliencie.

  Praktycznie oznacza to trzy rzeczy: ktoś musi być właścicielem bazy, każde źródło musi mieć datę, a odpowiedzi muszą pokazywać, skąd pochodzą. To ostatnie jest najważniejsze, bo pozwala złapać błąd, zanim złapie go klient.

  ## Dlaczego akurat to przekonuje sceptyków

  I tu dochodzimy do rzeczy, w którą naprawdę wierzę.

  Takie z pozoru błahe wdrożenie jak firmowa baza wiedzy robi dla adopcji AI w firmie więcej niż niejeden ambitny projekt. Nie dlatego, że jest imponujące. Dokładnie dlatego, że nie jest.

  To pierwszy moment, w którym zespół widzi konkretną korzyść, a nie slajd o transformacji. Nowa osoba przestaje pytać, kogo o to zapytać. Klient dostaje tę samą odpowiedź niezależnie od tego, kto odbierze telefon. Nikt nikogo nie zastąpił, nikomu nie zabrano pracy, po prostu zniknęła jedna irytująca rzecz z dnia.

  I wtedy dzieje się najciekawsze: **ludzie, którzy byli sceptyczni, sami zaczynają pytać, co jeszcze da się tak poukładać.**

  To jest cała mechanika adopcji AI w firmie, w jednym zdaniu. Nie przekonujesz argumentem, tylko pierwszym doświadczeniem. A skoro pytanie pada od nich, a nie od Ciebie, to kolejne wdrożenie nie jest już narzucone z góry.

  Dlatego myślę o tym jak o schodach, nie o skoku:

  - **Stopień 1:** baza wiedzy odpowiada ludziom. Tu jesteśmy.
  - **Stopień 2:** prosta automatyzacja przypisuje przychodzące maile do właściwego eksperta, bo baza wie, kto się czym zajmuje.
  - **Stopień 3:** AI przygotowuje draft odpowiedzi, człowiek zatwierdza.
  - **Stopień 4:** w obszarach, gdzie odpowiedzi są naprawdę powtarzalne, AI odpowiada samo.

  Nie robisz tego jako jednego projektu na pół roku. Dokładasz stopień po stopniu, a każdy zwraca się osobno. Jeśli chcesz zobaczyć, dokąd te schody prowadzą w dużej skali, opisywałem [wewnętrzną bazę wiedzy Cerebras, która odpowiada na 15 000 pytań dziennie](/blog/firmowa-baza-wiedzy-dobre-praktyki). Zasada jest identyczna, różni się tylko liczba klocków.

  [image:/images/blog/baza-wiedzy-scena-ai-use-case.webp|Jakub Bednarz podczas prelekcji "AI, które zna Twoją firmę" na spotkaniu ai use_case w Warszawie]

  ## Co możesz zrobić jutro rano

  Bez kupowania czegokolwiek. Odpowiedz sobie na jedno pytanie:

  > Gdzie w mojej firmie ludzie marnują czas na rzeczy, których nikt nie lubi robić?

  Typowe odpowiedzi z polskich MŚP brzmią zawsze podobnie: przepisywanie ofert z maila do CRM, notatki ze spotkań, odpowiadanie po raz tysięczny na to samo pytanie klienta, sklejanie raportu z trzech narzędzi do jednego Excela.

  Każda z tych rzeczy to kilka godzin tygodniowo na osobę. I to jest Twój realny budżet wdrożeniowy, a nie wymyślony ROI z prezentacji. W audytach, które robię, widzę średnio około 32% czasu pracy do odzyskania już w pierwszym przejściu.

  Zacznij od tej pozycji na liście, która jest najnudniejsza i najbardziej irytująca. Nie od tej, która najlepiej wygląda na slajdzie.

  ---

  Jeśli chcesz policzyć, ile ten bałagan kosztuje Cię w miesiącach, a nie w odczuciach, mam do tego [kalkulator strat](/kalkulator). A jeśli wolisz po prostu pogadać o swoim przypadku, [odezwij się](/#kontakt) - piętnaście minut zwykle wystarczy, żeby powiedzieć, czy w ogóle jest się za co zabierać.
  `,
  },
  {
    slug: 'firmowa-baza-wiedzy-dobre-praktyki',
    title: 'Baza wiedzy, która odpowiada na 15 000 pytań dziennie - co warto z niej skopiować do Twojej firmy',
    category: 'Wiedza',
    date: '2026-07-17',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
    excerpt:
      'Cerebras opublikował techniczny opis swojej wewnętrznej bazy wiedzy - 15 000 pytań dziennie, korzystają z niej ludzie, automatyzacje i agenty AI. Rozbieram ich architekturę na zasady, które działają w każdej skali, i pokazuję, jak wdrożyć je w firmie bez działu ML.',
    content: `
Cerebras - firma budująca największe chipy AI na świecie - opublikował właśnie techniczny opis swojej wewnętrznej bazy wiedzy. Liczby robią wrażenie: **15 000 pytań dziennie**, trzy miesiące od startu, jedno z najchętniej używanych narzędzi w firmie. I ważny szczegół: korzystają z niej nie tylko ludzie, ale też automatyzacje i agenty AI.

Nie piszę o tym, żeby podziwiać. Piszę, bo problem, który rozwiązali, wygląda identycznie u producenta chipów z setkami inżynierów i w polskiej firmie na 15 osób. Te same trzy pytania zapychają kanały komunikacji wszędzie:

- Gdzie znajdę X?
- Kto się zna na Y?
- Co to właściwie jest Z?

Różnica jest tylko w skali. [Pełny wpis Cerebras znajdziesz tutaj](https://www.cerebras.ai/blog/how-we-built-our-knowledge-base) - poniżej wyciągam z niego zasady, które nie zależą od wielkości firmy, i pokazuję, jak przełożyłbym je na realia MŚP.

### Pułapka, w którą wpada każda firma

Cerebras opisuje zjawisko, które pewnie rozpoznasz: co kwartał ktoś proponuje ten sam genialny pomysł - "przenieśmy wszystko do jednej platformy, będzie jedno źródło prawdy". I jak sami piszą, to marzenie rzadko przeżywa zderzenie z praktyką.

Powód jest prosty: informacja powstaje tam, gdzie jej tworzenie jest wygodne. Ustalenia siedzą w wątkach na Teams albo Slacku, uwagi w komentarzach do dokumentów, statusy w CRM, decyzje w mailach. Każde z tych narzędzi jest do swojego zadania zoptymalizowane latami - i dlatego ludzie nie przestaną ich używać, choćby prezes trzy razy ogłosił "od dziś wszystko piszemy w nowej wiki".

Pierwsza decyzja projektowa Cerebras brzmiała więc: **zero zmiany nawyków**. System sam wyciąga dane z narzędzi, w których praca i tak się dzieje, zamiast zmuszać ludzi do przenoszenia wiedzy ręcznie.

Praktyczny wniosek: jeśli plan wdrożenia bazy wiedzy zaczyna się od "wszyscy będą teraz dokumentować w nowym narzędziu" - to nie jest plan, tylko życzenie. Baza umrze po miesiącu.

### Nie wszystko zasługuje na zapamiętanie

Druga rzecz, którą Cerebras zrobił dobrze: nie wrzucają do bazy surowych rozmów. Każdy wątek przechodzi przez destylację - model AI wyciąga z niego stały zestaw informacji: pytanie sformułowane tak, jak ktoś by je naprawdę wyszukiwał, krótkie streszczenie, rozwiązanie i systemy, których dotyczy. Dopiero to trafia do bazy. Ich własne testy pokazały, że po takiej normalizacji trafność wyszukiwania znacząco wzrosła.

Do tego dochodzą progi jakości: wpis musi mieć minimalną długość, zawierać konkretne, rzadkie pojęcia albo reakcje innych osób, żeby w ogóle zostać zapisany. Wiadomość "ok, dzięki, działa" nigdy nie staje się wiedzą firmową.

Zasada uniwersalna: **śmieci na wejściu to śmieci w odpowiedziach**. Wersja dla MŚP, bez żadnego ML: po każdym spotkaniu, zamkniętym projekcie czy rozwiązanym problemie powstaje notatka w stałym formacie - kontekst, decyzja, kto odpowiada, do kiedy ważne. Stały format to 80% sukcesu późniejszego wyszukiwania.

### Wiedza ma datę ważności

Mój ulubiony detal z ich architektury: age decay, czyli wygaszanie starych odpowiedzi. Dwa wątki mogą odpowiadać na to samo pytanie, ale ten sprzed pół roku może opisywać infrastrukturę, która już nie istnieje. Przy porównywalnej trafności wygrywa nowszy.

Teraz pomyśl o swojej firmie: cennik sprzed podwyżki, procedura urlopowa sprzed zmiany regulaminu, szablon oferty sprzed rebrandingu. Baza wiedzy bez dat to generator fałszywych odpowiedzi - i to pewnych siebie. Praktyka: każda notatka ma datę, narzędzie preferuje świeższe wpisy, a raz na kwartał robisz przegląd tego, co się przeterminowało.

### Szukanie po słowach i po znaczeniu to dwie różne rzeczy

Cerebras nie ufa żadnej pojedynczej technice wyszukiwania. Łączą kilka naraz: wyszukiwanie pełnotekstowe łapie dokładne frazy - numer umowy, kod błędu, nazwisko. Wyszukiwanie semantyczne łapie parafrazy - bo pytający i odpowiadający często nie używają ani jednego wspólnego słowa ("klient zalega z płatnością" kontra "faktura po terminie"). Wyniki obu podejść są łączone i dopiero wtedy układane w ranking.

Tego akurat nie musisz budować sam - dostajesz to dziś w gotowych narzędziach. Ale kiedy dostawca pokazuje Ci "wyszukiwanie AI", zadaj jedno pytanie kontrolne: **czy znajdzie dokument, w którym nie pada żadne słowo z mojego pytania?** Jeśli nie - kupujesz wyszukiwarkę, nie bazę wiedzy.

### Baza wiedzy to nie tylko ludzie

Te 15 000 pytań dziennie nie zadają sami pracownicy. Pytają też automatyzacje i agenty AI - Cerebras wystawił bazę jako zestaw prostych narzędzi przez MCP (otwarty standard, którym agenty podłączają się do systemów): przeszukaj rozmowy, przeszukaj dokumenty, powiedz kto się zna na X. Agent sam decyduje, które narzędzie wywołać i jak złożyć z tego odpowiedź.

To zmienia rachunek opłacalności całego przedsięwzięcia. Dobrze zrobiona baza obsługuje jednocześnie nowego pracownika w onboardingu, agenta odpowiadającego na pytania klientów i automatyzację, która przygotowuje ofertę. Jedna inwestycja, trzy zwroty.

### Jak to wdrożyć w firmie 10-100 osób

Nie potrzebujesz bazy wektorowej, zespołu ML ani budżetu Cerebras. Kolejność, którą proponuję klientom:

**Krok 1 - fundament (tydzień, koszt: głównie czas).** Zmapuj, gdzie dziś żyje wiedza: skrzynki mailowe, Teams, dysk sieciowy, CRM i głowy dwóch kluczowych osób. Wybierz jedno miejsce na destylat - wystarczy uporządkowany katalog plików tekstowych w stałym formacie (pisałem o tym przy okazji [Open Knowledge Format](/blog/open-knowledge-format-google-cloud)). Zacznij od 20 pytań, które w firmie powtarzają się najczęściej, i spisz odpowiedzi z datami.

**Krok 2 - automatyczne zasilanie (miesiąc).** Podepnij agenta, który po każdym spotkaniu, zamkniętym wątku albo projekcie proponuje notatkę do bazy w Twoim formacie - a człowiek ją tylko zatwierdza albo odrzuca. To jest destylacja Cerebras w wersji, na którą stać każdą firmę. Progi jakości ustawiasz po swojemu: nie każda rozmowa zasługuje na zapis.

**Krok 3 - dostęp i uprawnienia (kwartał).** Podłącz bazę do narzędzi, w których pracują ludzie i agenty, ustaw kto co widzi (handlowiec nie musi znać wynagrodzeń, księgowa stawek klientów) i włącz log pytań. Cerebras zbudował warstwę uprawnień i audytu od pierwszego dnia - w polskich realiach RODO to nie jest opcja, tylko wymóg. Bonus: log pytań to darmowa mapa tego, czego ludzie w firmie naprawdę nie wiedzą. Lepsza niż niejedna ankieta.

### Od czego zacząć w poniedziałek

Policz, ile razy w tym tygodniu ktoś w firmie zadał pytanie, na które odpowiedź już gdzieś była - w mailu, na dysku, w czyjejś głowie. U Cerebras skala tego problemu uzasadniła budowę całego systemu. U Ciebie na start może wystarczyć katalog z 20 plikami i agent, który umie go czytać.

A jeśli wolisz to policzyć i zaplanować na spokojnie - [zacznij od bezpłatnego audytu](/#kontakt). 15 minut, zero zobowiązań, wychodzisz z mapą wiedzy w swojej firmie i konkretnym pierwszym krokiem.
    `,
  },
  {
    slug: 'oszczedzanie-tokenow-ai-agent',
    title: 'Ciągle brakuje tokenów? Naucz swojego agenta AI oszczędnego gospodarowania zasobami',
    category: 'Wiedza',
    date: '2026-07-04',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80',
    excerpt:
      'Wchodzimy w drugą fazę AI - tę, w której tokeny i narzędzia zaczynają realnie kosztować. Trzy konkretne sposoby, żeby nauczyć swojego agenta AI oszczędnego gospodarowania zasobami - i jeden nawyk, który oszczędza jeszcze więcej.',
    content: `
Jeszcze rok temu AI było tanie. Darmowe limity starczały na cały dzień pracy, subskrypcja kosztowała tyle co obiad, a nikt specjalnie nie liczył tokenów. Ta faza się kończy.

Modele robią coraz więcej samodzielnie - czytają cały kod, przeszukują logi, pamiętają długie rozmowy. Wszystko to kosztuje. Limity się kurczą, ceny API rosną, a rachunek na koniec miesiąca robi się odczuwalny. Wiemy, o co toczy się gra, bo sami w nią gramy - u nas w Workshift token to dziś pozycja budżetowa, nie ciekawostka.

### Koniec fazy freemium

Dopóki AI było tanie, nikt nie musiał myśleć o efektywności. Agent mógł napisać 200 linijek tam, gdzie wystarczyłoby 20. Mógł wkleić Ci do kontekstu cały plik logów zamiast jednej istotnej linijki. Mógł opowiedzieć historię zamiast dać odpowiedź. Nikogo to nie bolało, bo nikt tego nie liczył.

Teraz liczy. I okazuje się, że **sposób, w jaki agent gospodaruje tokenami, jest równie ważny jak to, czy w ogóle da radę wykonać zadanie**. Poniżej trzy narzędzia, które adresują dokładnie to - każde z innej strony - plus jeden nawyk, który w dłuższej perspektywie oszczędza najwięcej.

### Sposób 1: Ponytail - agent, który pisze mniej kodu, bo nie musi

[Ponytail](https://github.com/DietrichGebert/ponytail) atakuje najbardziej kosztowny nawyk agentów kodujących: nadmiarową implementację. Zamiast pozwolić agentowi od razu pisać kod, narzędzie wymusza hierarchię pytań, zanim padnie pierwsza linijka: Czy to w ogóle musi istnieć? Czy już jest w kodzie? Czy jest w stdlib? Czy da się to zrobić w jednej linii? Dopiero na końcu tej listy - kod minimalny.

To dyscyplina, jaką ma senior, który zamiast pisać, najpierw sprawdza, czy problem już rozwiązano. Na testach (repo FastAPI + React, 12 zadań, model Haiku 4.5) dało to **-54% linijek kodu (do -94% w skrajnych przypadkach)**, **-22% tokenów**, **-20% kosztu** i **-27% czasu** - przy zachowanym 100% bezpieczeństwa wykonania. Działa jako plugin w Claude Code i 15+ innych agentach (Cursor, Windsurf, Copilot CLI, Codex).

### Sposób 2: Headroom - kompresja tego, co w ogóle trafia do modelu

[Headroom](https://github.com/headroomlabs-ai/headroom) rozwiązuje inny koniec problemu: nie to, co agent pisze, tylko to, co dostaje. Wyniki wyszukiwania w kodzie, logi z produkcji, fragmenty RAG, całe pliki - to wszystko zwykle trafia do modelu w formie znacznie bardziej rozwlekłej, niż potrzeba. Headroom stawia między narzędziami a modelem router, który rozpoznaje typ treści (JSON, kod, tekst) i kompresuje ją specjalizowanym silnikiem - z opcją odtworzenia oryginału, jeśli model faktycznie go potrzebuje.

Liczby z realnych obciążeń robią wrażenie: przeszukanie kodu (100 wyników) - z 17 765 do 1 408 tokenów (**92% oszczędności**), debugowanie incydentu produkcyjnego - z 65 694 do 5 118 (**92%**), triage zgłoszeń na GitHubie - z 54 174 do 14 761 (**73%**). Przy tym dokładność modelu na benchmarkach (GSM8K, TruthfulQA) nie spada - w jednym przypadku nawet rośnie. Działa jako proxy dla Claude Code, Cursor, Aidera i każdego klienta kompatybilnego z OpenAI.

Jedno zastrzeżenie, o którym warto wiedzieć przed wdrożeniem: **tryb proxy przepuszcza ruch do Anthropic czy OpenAI przez lokalny proces** - to technicznie man-in-the-middle, i projekt sam ostrzega w dokumentacji, żeby nie wystawiać takiego proxy publicznie bez autoryzacji. Jeśli pracujesz z danymi klientów albo kluczami API - zacznij od trybu biblioteki (\`from headroom import compress\`) albo \`headroom wrap\`, nie od proxy na produkcji.

### Sposób 3: Caveman - agent, który mówi mniej, ale nie mniej precyzyjnie

[Caveman](https://github.com/JuliusBrussee/caveman) celuje w gadatliwość samego modelu - te wszystkie wstępy, dygresje i uprzejmości, które nic nie wnoszą do odpowiedzi. Instaluje się jako skill w agencie i zmienia styl komunikacji na skondensowany: bez zdań w stylu "Chętnie Ci w tym pomogę", za to z pełną techniczną dokładnością - kod, komendy i komunikaty błędów zostają nietknięte co do znaku.

Na 10 testowych promptach dało to średnio **65% redukcji tokenów odpowiedzi** (zakres 22-87%). Przykład: wyjaśnienie buga z re-renderem w React spadło z 1180 do 159 tokenów - **87% oszczędności**. Jest tu jednak uczciwe zastrzeżenie z dokumentacji: *Caveman zmniejsza tylko tokeny wyjściowe. Tokeny wejściowe i rozumowania zostają nietknięte, a sam skill dokłada ~1-1,5k tokenów wejściowych na turę.* To narzędzie do gadatliwości, nie do wszystkiego - ale tam, gdzie boli najbardziej (długie wyjaśnienia, częste interakcje), robi realną różnicę.

### Bonus: second brain, żeby agent nie zaczynał każdej rozmowy od zera

Wszystkie trzy narzędzia powyżej oszczędzają tokeny **w obrębie jednej rozmowy**. Jest jeszcze jeden nawyk, który oszczędza tokeny **między rozmowami** - i w mojej praktyce daje najwięcej: własny "second brain", czyli uporządkowana baza wiedzy, z której agent czerpie kontekst na żądanie, zamiast dostawać (albo odpytywać) wszystko od nowa przy każdej sesji.

Zamiast tłumaczyć agentowi za każdym razem, kim jestem, nad czym pracuję i jakie decyzje już podjąłem, mam to zapisane - a agent sam sięga po konkretną notatkę, kiedy jest potrzebna, zamiast ładować cały kontekst na wejściu. Mniej tokenów wejściowych, mniej powtórzeń, więcej trafności.

To temat na osobny, dłuższy wpis - sam koncept zasługuje na więcej niż akapit. Trochę o pokrewnym podejściu (ustandaryzowany format wiedzy dla agenta) pisałem już w [Open Knowledge Format](/blog/open-knowledge-format-google-cloud) - to fragment tej samej układanki.

### Co z tym zrobić dzisiaj

Nie musisz wdrażać wszystkiego naraz. Jeśli piszesz kod z agentem - zacznij od Ponytail, to jedna komenda instalacji i natychmiastowy efekt na rachunku. Jeśli Twój agent dużo czyta (logi, RAG, wyniki narzędzi) - Headroom da największy zwrot. Jeśli po prostu rozmawiasz z agentem cały dzień i płacisz za każde jego "chętnie wyjaśnię" - Caveman jest najszybszy do wdrożenia (30 sekund, jedna komenda w terminalu).

A jeśli robisz to wszystko na raz - prawdopodobnie czas pomyśleć o second brain. Chętnie pogadam, jak by to wyglądało u Ciebie - [napisz do mnie](/#kontakt). 15 minut, zero zobowiązań.
    `,
  },
  {
    slug: 'open-knowledge-format-google-cloud',
    title: 'Jak nakarmić agenta wiedzą o Twojej firmie? - Open Knowledge Format',
    category: 'Wiedza',
    date: '2026-06-14',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/open-knowledge-format.webp',
    excerpt:
      'Google Cloud opublikowało otwartą specyfikację formatu na wiedzę dla agentów AI - po prostu katalog plików markdown z YAML-em. Zero SDK, zero vendor lock-in. Wyjaśniam, co to oznacza dla polskiej firmy, która chce, żeby AI wreszcie znała jej procesy.',
    content: `
  Większość firm, które wdrażają AI, trafia po dwóch miesiącach na ten sam mur: model odpowiada mądrze, ale **nie zna naszej firmy**. Pyta o rzeczy, które są w wewnętrznej wiki. Wymyśla procesy, które u nas wyglądają inaczej. Nie pamięta, że u nas faktura idzie najpierw do Kasi, a potem do systemu.

  To nie jest wina modelu. To jest wina **braku ustandaryzowanego sposobu, w jaki firmy dają modelowi swoją wiedzę**.

  12 czerwca 2026 Google Cloud opublikował coś, co może to zmienić. Nazywa się **Open Knowledge Format (OKF)** - otwarta specyfikacja, która zamienia "wiki dla agenta" w coś, co różne narzędzia, różne firmy i różne agenty potrafią ze sobą bezboleśnie wymieniać.

  A pod spodem to zwykły katalog plików markdown z YAML-em. Zero magii.

  ### Co konkretnie Google opublikowało

  OKF to propozycja formatu, w jakim wiedza firmy ma żyć, żeby była zjadliwa dla agentów AI. Trzy rzeczy, które warto wiedzieć od razu:

  [image:/images/blog/okf-folder-structure.webp|Przykładowa struktura katalogu OKF: foldery z plikami markdown, YAML frontmatter, konsumpcja przez agenta]

  **To jest tylko markdown z YAML-em.** Każdy "concept" (tabela w bazie, metryka, runbook, klient, procedura) to jeden plik \`.md\` z krótkim blokiem frontmatter na górze - \`type\`, \`title\`, \`description\`, \`tags\`, \`timestamp\`. Reszta to zwykły markdown z linkami między plikami. Otwierasz w VSCode, edytujesz w Obsidian, commitujesz do gita, renderujesz na GitHubie - jak chcesz.

  **To nie jest kolejna platforma.** Nie wymaga konta, SDK ani integracji. Nie ma "OKF Cloud" do którego wysyłasz dane. Pliki żyją tam, gdzie chcesz - lokalnie, w firmowym repo, w iCloud. Agent dostaje katalog, czyta pliki, działa.

  **To jest format, nie model.** OKF nie mówi, jakiego LLM-a masz użyć. Nie mówi, jakiej bazy wektorowej. Nie mówi, czy wolisz Claude czy GPT. Mówi tylko: **w takim kształcie ma być wiedza, którą dajesz agentowi - wtedy każdy agent ją zrozumie**.

  Google dorzucił też przykłady: trzy gotowe "bundles" wiedzy (dane e-commerce z GA4, publiczne dane ze Stack Overflow, historia Bitcoina) wygenerowane przez referencyjny enrichment agent. Ale to są przykłady - nie wymóg. Każda firma pisze swoją wiedzę po swojemu, ważne żeby trzymała się minimalnej struktury.

  ### Dlaczego to jest duża sprawa dla MŚP

  Zanim OKF istniał, każdy agent budowany w firmie musiał rozwiązać to samo pytanie: **w jakim formacie dać mu wiedzę?** I każdy odpowiadał inaczej. Vendor A używał własnego JSON-a, vendor B własnego YAML-a, vendor C notatnika w Notion. Wiedza napisana dla jednego systemu nie działała w drugim.

  Efekt: każda firma budująca agenta robi od zera to samo - tłumaczy wewnętrzną wiedzę na format, który akurat ten jeden system rozumie. Każdy dostawca katalogów wymyśla swoje własne pola. Wiedza siedzi zamknięta w systemie, który ją stworzył.

  OKF mówi: **wystarczy markdown i sześć pól w YAML-u**. Reszta zależy od Ciebie.

  Dla MŚP to jest konkretnie istotne z trzech powodów:

  **Po pierwsze - to jest darmowe i vendor-neutral.** Specyfikacja jest otwarta. Nikt Ci nie sprzeda "licencji OKF". Nikt nie zamknie Twojej wiedzy w jednym narzędziu. Dzisiaj budujesz agenta w Claude - jutro przenosisz go na Llama 3.1 albo PLLuM. Wiedza zostaje ta sama.

  **Po drugie - to współgra z tym, co już robisz.** Używasz Obsidian do notatek? Masz już pół OKF. Prowadzisz firmową wiki w Hugo albo Notion? Formalnie nie jest OKF, ale **przejście to kwestia konwencji nazewnictwa i kilku pól w YAML-u**, nie przepisywania od zera. Karpathy'ego LLM Wiki, o którym pisałem niedawno, też jest blisko - to formalnie ten sam wzorzec.

  **Po trzecie - oddziela pisanie od czytania.** Możesz mieć w firmie osobę, która ręcznie aktualizuje procedury w markdownie. Ten sam plik konsumuje agent, który sam wyciąga z niego odpowiedzi na pytania klientów. Albo odwrotnie: enrichment agent automatycznie generuje opisy tabel w BigQuery, a człowiek je potem przegląda i poprawia. OKF nie narzuca, kto pisze - tylko w jakim kształcie.

  ### Trzy zasady, na których Google zbudował OKF

  W dokumentacji Google wymienia trzy decyzje projektowe, które warto znać - bo mówią dużo o tym, jak format ma się rozwijać:

  **1. Minimally opinionated** - jedyne wymagane pole to \`type\`. Każdy concept musi powiedzieć, czym jest (tabela? metryka? procedura? klient?). Co to za typ, jakie ma pod-pola, jakie sekcje w body - to już decyzja producenta. Specyfikacja definiuje tylko **warstwę interoperacyjności**, nie model treści.

  **2. Producer/consumer independence** - kto pisze wiedzę i kto ją czyta to dwie niezależne decyzje. Człowiek pisze ręcznie - agent czyta. Pipeline eksportuje metadane z bazy - człowiek przegląda w wizualizerze. Jeden LLM syntetyzuje opis tabeli - drugi LLM go konsumuje. Każda ze stron może być wymieniona bez ruszania drugiej.

  **3. Format, not platform** - OKF nigdy nie będzie wymagał konta Google, konta w chmurze ani konkretnego SDK. Wartość formatu polega na tym, **ile stron się nim posługuje**, a nie kto go wymyślił. Dlatego to jest otwarta specyfikacja od dnia pierwszego.

  ### Co to zmienia w praktyce firmy

  OKF v0.1 to specyfikacja, nie gotowy produkt. Nie ma jeszcze "OKF dla firmy w pudełku". Są za to przykłady, referencyjne implementacje i wizualizer, który renderuje dowolny bundle jako klikalny graf w jednym statycznym pliku HTML.

  Co warto zrobić dzisiaj, jeśli interesuje Cię ten kierunek:

  **1. Sprawdź, jak wygląda Twoja obecna wiedza.** Otwórz firmową wiki, CRM, bazę procedur, folder z runbookami. Czy to, co tam masz, dałoby się opisać jako "katalog plików markdown z YAML-em"? Jeśli tak - jesteś bliżej, niż myślisz. Jeśli nie - to jest osobny projekt porządkowy, który i tak warto zrobić niezależnie od AI.

  **2. Zacznij od jednego obszaru.** Nie próbuj "okfizować" całej firmy. Wybierz jeden proces, który agent ma wspierać - np. odpowiadanie klientom na pytania o status sprawy. Opisz w markdownie 5-10 typów sytuacji, dodaj tagi, podepnij agenta. Przetestuj.

  **3. Trzymaj się minimalnej konwencji.** Pliki w katalogu. Frontmatter z \`type\`, \`title\`, \`description\`, \`tags\`, \`timestamp\`. Linki między plikami. Jeden \`index.md\` w katalogu, jeśli ma sens. To wystarczy. Wszystko inne to overengineering, który ktoś będzie musiał utrzymywać.

  **4. Planuj wymianę, nie tylko konsumpcję.** W którymś momencie będziesz chciał przenieść tę wiedzę do innego systemu albo podzielić się nią z partnerem. Jeśli trzymasz się otwartego formatu - to jest trywialne. Jeśli zapiszesz w czymś własnym - masz vendor lock-in w jednym z najważniejszych miejsc w firmie.

  ### Hype check

  Trzeba uczciwie powiedzieć: OKF to specyfikacja z dnia 12 czerwca 2026. Nie ma polskiego community, nie ma sprawdzonych wdrożeń produkcyjnych w MŚP, nie ma polskich tłumaczeń pól. Na tym etapie to lektura, nie zakup - przeczytaj specyfikację, oceń, czy pasuje do Twojego kierunku, i zacznij od jednego pliku.

  Ale właśnie to w niej najlepsze. Format, który **nie wymaga od Ciebie niczego poza markdownem** - to najniższy możliwy próg wejścia. Nie musisz nikogo pytać o zgodę, nie musisz podpisywać umowy z dostawcą, nie musisz nawet wierzyć Google'owi, że specyfikacja przetrwa. Pliki markdown z YAML-em przetrwają. A jeśli OKF nie wypali - zostaniesz z porządną firmową wiki, która i tak jest wartością samą w sobie.

  Dla mnie to jest najciekawsza infrastrukturalna publikacja tego kwartału. Nie dlatego, że rewolucjonizuje AI. Dlatego, że **wreszcie ujednolica warstwę pod spodem** - tę, o której nikt nie mówi, bo nie jest sexy. A bez niej każdy agent w każdej firmie buduje od zera to samo koło.

  Jak chcesz pogadać, jak Twoja obecna wiedza firmowa wyglądałaby po przełożeniu na OKF - [napisz do mnie](/#kontakt). 15 minut, zero zobowiązań. Powiem Ci, czy jest w ogóle o czym rozmawiać, czy lepiej najpierw posprzątać wiki.
    `,
  },
  {
    slug: 'polskie-modele-pllum-w-firmie',
    title: 'Koniec z wysyłaniem danych do USA. Jak (i po co) wdrożyć polskie modele PLLuM w firmie?',
    category: 'Wiedza',
    date: '2026-05-22',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/polskie-modele-pllum-w-firmie.webp',
    excerpt:
      'Nowa odsłona rodziny PLLuM od Ministerstwa Cyfryzacji - 11 modeli w 4 rozmiarach, wszystkie po polsku, wszystkie do lokalnych wdrożeń. Tłumaczę, który rozmiar do czego pasuje i dla kogo polskie modele mają realną przewagę nad rozwiązaniami z USA.',
    content: `
Myślę, że warto docenić zespół z Ministerstwa Cyfryzacji pracujący nad PLLuM za kawał świetnej roboty. 👏

Właśnie wyszła nowa odsłona rodziny – 11 modeli w 4 rozmiarach, wszystkie po polsku, wszystkie do lokalnych wdrożeń. To już nie koncept ładnie wyglądający na slajdach, a realne narzędzie, które można wdrożyć u siebie.

Zanim wejdę w szczegóły, krótkie wyjaśnienie. Im więcej parametrów (te „B" to miliardy), tym lepszy kontekst i jakość generowanych odpowiedzi. Ale przy lokalnym wdrożeniu – a o to właśnie chodzi w PLLuM – oznacza to też większe wymagania sprzętowe. To zawsze kompromis, a nie wyścig na liczby.

### Oto jak to rozumieć w praktyce:

**4B (baza: Gemma od Google)** – kompaktowy i szybki. Uruchomisz go praktycznie na dowolnym urządzeniu. Ten model idealnie sprawdzi się do wąskich, konkretnych zadań albo jako test bez wielkich inwestycji w infrastrukturę. A wbrew pozorom do prostych zadań w stylu tworzenia maila nie trzeba od razu korzystać z Opusa 4.7. Co ciekawe, ta kategoria to świeży dodatek, który powstał po zgłoszeniach od partnerów z rynku.

**8B i 12B (baza: Llama 3.1 i Mistral-Nemo)** – tu zaczyna się prawdziwa produkcja. Najlepszy kompromis między jakością a kosztem infrastruktury. Świetnie sprawdzą się jako silnik RAG pracujący nad wewnątrzfirmową bazą wiedzy.

**70B (baza: Llama 3.1)** – model flagowy, w teorii powinien działać bardzo dobrze, w zasadzie bez konieczności dodatkowego dostrajania. Wymaga GPU, ale radzi sobie z najbardziej złożonymi zadaniami.

Każdy rozmiar (poza 70B) dostępny jest w 3 wariantach (base, instruct, chat).

[image:/images/blog/polskie-modele-pllum-w-firmie-post.webp|Rodzina modeli PLLuM - 11 modeli w 4 rozmiarach]

Powiedzmy sobie wprost: naszymi lokalnymi modelami nie wygramy wyścigu zbrojeń z OpenAI, Anthropic czy Google. Różnice w budżetach są po prostu kosmiczne. Dlatego warto pochwalić zespół PLLuM za mądre, pragmatyczne podejście. Zamiast porywać się na tworzenie modeli „do wszystkiego", stworzyli rozwiązania wysoce specjalistyczne, skrojone pod konkretne, lokalne potrzeby.

### Dla kogo to jest szczególnie ciekawe?

Kancelarie, biura księgowe, firmy obsługujące administrację publiczną – tu PLLuM ma realną przewagę nad modelami z USA. Przede wszystkim dlatego, że:

- **Rozumie polski kontekst urzędowy.** Nie tylko „mówi po polsku", ale ogarnia specyfikę naszych pism, formularzy i procedur.
- **Posiada pełną dokumentację zgodną z AI Act** (źródła danych, metody treningu). Nie zaczynasz analizy compliance od zera. No i jest na otwartej licencji.
- **Jest już wdrożony w mObywatelu**, więc zaufanie instytucjonalne masz w pakiecie.

Jeżeli miałbym coś doradzić, to polecam zacząć z modelem 8B/12B. To dobry kompromis między jakością a wymaganiami sprzętowymi - można go postawić na sensownej maszynie, a nie na klastrze za 200 tysięcy złotych.
    `,
  },
  {
    slug: 'o-co-chodzi-z-tymi-agentami',
    title: 'O co chodzi z tymi Agentami?',
    category: 'Wiedza',
    date: '2026-05-08',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/o-co-chodzi-z-tymi-agentami.webp',
    excerpt:
      'Każdy software house, startup i LinkedInowy guru pisze, że "buduje agenta AI". Tylko że za tym pojęciem stoi zwykle cokolwiek - od chatbota po Excela z dopiętym ChatemGPT. Rozkładam to na czynniki pierwsze - po Bondowsku, bez infantylizacji.',
    content: `
James Bond rzadko dostaje od M szczegółowy scenariusz misji. Zwykle pada jedno zdanie: "Powstrzymaj Blofelda. Reszta zależy od ciebie." Bond bierze gadżety od Q, leci do Monako, sam decyduje, czy wybrać kasyno, pościg, czy uwodzenie. Cel jest sztywny. Sposób - nie.

I właśnie na tym polega różnica między **agentem AI** a zwykłym ChatGPT.

Sporo ostatnio słyszymy tajemniczych haseł - **agenci AI**, **środowiska agentowe**, **narzędzia do zarządzania agentami**. Każdy software house, każdy startup i każdy LinkedInowy guru pisze, że "buduje agenta". Tylko za tym pojęciem często stoi cokolwiek - od chatbota na stronie do Excelowego makra z dopiętym ChatemGPT.

Spróbujmy więc to uporządkować.

### ChatGPT to kelner. Agent to wykonawca misji.

Klasyczny ChatGPT (czy Claude, czy Gemini) działa jak kelner w restauracji. Pytasz - odpowiada. Prosisz o coś nowego - przynosi. Po obsłużeniu Cię zapomina o wszystkim i czeka na kolejnego klienta. Bez Twojego polecenia nie zrobi nic.

**Agent AI to ten sam model językowy, ale wpięty w pętlę decyzyjną.** Dostaje cel, sam wybiera narzędzia, sam wykonuje kroki, sam sprawdza wynik i sam decyduje, co dalej. Bez Twojego nadzoru przy każdym kroku.

Żeby coś zasłużyło na miano agenta, musi spełnić cztery warunki:

[image:/images/blog/o-co-chodzi-z-tymi-agentami-mission-brief.webp|Mission Brief - cztery warunki agenta AI: cel, pamięć, narzędzia, pętla decyzyjna]

Brakuje któregoś elementu? To nie jest agent. To zaawansowany skrypt z modelem AI w środku.

### Co JEST agentem (a co tylko udaje)

Patrząc na rynek przez pryzmat tych czterech wymagań, świat agentowy szybko się porządkuje. Po jednej stronie mamy realne, autonomicznie myślące systemy - od Claude Code, przez junior.so, po wewnętrzne agenty maila i researchu. Po drugiej - chatboty FAQ, custom GPT, sztywne workflow w n8n czy Zapierze i skrypty z wpiętym GPT, które tylko udają agentów, bo etykieta lepiej się sprzedaje.

[image:/images/blog/o-co-chodzi-z-tymi-agentami-id-card.webp|Identification File - Agent vs Imposter: zestawienie co jest agentem AI a co tylko udaje]

Granica jest prosta: **jeśli ścieżkę da się narysować na flowcharcie z góry - to nie agent.** Agent jest właśnie po to, żeby tę ścieżkę wymyślał w locie.

### Środowiska agentowe i narzędzia do zarządzania nimi

Skoro już wiemy, czym jest agent, dwa pozostałe modne hasła zaczynają mieć sens.

**Środowisko agentowe** to po prostu "świat", w którym agent może działać. Bond ma Monte Carlo, Aston Martina i walizkę od Q. Agent AI ma Twojego maila, Twojego CRM-a, Twój kalendarz i przeglądarkę internetową. Im bogatsze środowisko, tym ciekawsze rzeczy może zrobić - i tym więcej miejsc, w których może coś zepsuć (dlatego firmy podchodzą do tego ostrożnie i słusznie).

**Narzędzia do zarządzania agentami** to z kolei panel sterowania M. Frameworki w stylu LangGraph, CrewAI czy OpenAI Agents SDK pozwalają zaprojektować, jak wielu agentów ma ze sobą współpracować, kto komu deleguje zadania, kto ma prawo wykonywać które akcje i co się dzieje, gdy któryś utknie. To rusztowanie, na którym buduje się poważne wdrożenia agentowe - żeby zamiast jednego Bonda mieć całą agencję pracującą razem.

### Czemu to ma znaczenie dla biznesu?

Bo pojęcia mają realne konsekwencje cenowe i wdrożeniowe.

Dostawca, który Ci sprzedaje "agenta AI" w cenie agenta, a w środku jest sztywny workflow z dwoma IF-ami i jednym wywołaniem GPT-4 - sprzedaje Ci automatyzację po stawce premium. Z drugiej strony - prawdziwy agent z autonomią to dużo większe ryzyko operacyjne i bezpieczeństwa. Trzeba mu jasno wyznaczyć granice, dać narzędzia tylko tam, gdzie trzeba i pilnować, żeby misja nie wymknęła się spod kontroli.

Agenci AI są ekscytujący właśnie dlatego, że są nieprzewidywalni. I to samo, co jest ich największą siłą, jest ich największym ryzykiem.
    `,
  },
  {
    slug: 'value-builders-talks-pm-w-erze-ai',
    title: 'PM w erze AI - moja rozmowa w Value Builders Talks #16',
    category: 'Wiedza',
    date: '2026-05-03',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/value-builders-talks-pm-w-erze-ai.webp',
    excerpt:
      'Byłem gościem podcastu Value Builders Talks od No-Code Poland. Z Chrisem Rapaczem rozmawialiśmy o tym, jak schodzić "pod maskę" projektów AI, dlaczego sprawczość jest najważniejszą umiejętnością ostatnich miesięcy i czemu PM-a nie zastąpi żaden agent.',
    content: `
Miałem przyjemność być gościem najnowszego odcinka **Value Builders Talks** prowadzonego przez Chrisa Rapacza (No-Code Poland). Zamiast dyplomatycznie kiwać głową nad każdą nową obietnicą AI, schodziliśmy "pod maskę" projektów - tam, gdzie zaczyna się prawdziwa robota. Wyciągam tu kilka wątków, które wracają do mnie najczęściej.

[youtube:p0zNNcAjkMk]

### 1. Sprawczość. To jest moje "wow" ostatnich miesięcy

Najmocniejszy moment z ostatniego pół roku? Pierwsza apka, którą zbudowałem opisując słowami, czego potrzebuję. Nie pamiętam już dokładnie, czy to było Lovable, Claude, czy coś innego - ważne, że dostałem **link do działającej rzeczy, która wysyłała maile i robiła swoje**.

Trzy lata temu siedziałbym z programistą i grafikiem przez tygodnie. Albo - bądźmy szczerzy - po prostu bym tego nie zrobił.

To nie była piękna apka. Ale działała. I właśnie ten moment, w którym przestajesz dyskutować *jak coś zrobić*, a po prostu to robisz - to jest sprawczość. Z tego się nie da wyjść. Człowiek siedzi i myśli "skoro można zrobić wszystko, to zróbmy".

### 2. AI nie zwalnia z myślenia o bezpieczeństwie

Mam jasną granicę zaufania: jeszcze długo nie oddam AI pełnej kontroli nad procesami, w których trzeba dbać o autoryzację, bazy danych, RAG, dobry kontekst.

Wyobraź sobie, że mówisz "stwórz mi piękną stronę e-commerce do kierownic rowerowych". Idealnie byłoby, gdyby narzędzie samo pomyślało o module logowania, autoryzacji, wyborze bazy danych, bezpieczeństwie - i ostrzegło Cię przed czymś, czego nie wiesz, że nie wiesz.

Tego dziś jeszcze nie ma w pełnej formie. **Człowiek nadal musi być "in the loop"**, bo zawsze coś może pójść nie tak. RAG bywa kapryśny, pamięć kontekstowa modeli jest różna, halucynacja zdarza się akurat w najgorszym momencie.

Jak robisz coś pierwszy raz, na 100% coś pominiesz. AI tego za Ciebie nie naprawi.

### 3. Lokalne modele, tokeny i syndrom uzależnienia

Drugie "wow" - rosnąca jakość lokalnych, open-sourceowych modeli (świeże wersje DeepSeek dorównują topowym GPT/Opus). Coraz więcej osób chce trzymać AI u siebie, bo widzą, jak szybko rosną rachunki za tokeny.

Powiem Ci szczerze - mam za sobą hackathon, na którym poszedłem spać tylko dlatego, że zamknęło mi się okienko sesji i otwierało dopiero o 5:00 rano. Brzmi jak żart. Nie jest. Te narzędzia potrafią uzależnić jak nic innego, a darmowe limity skutecznie zachęcają do dokupienia "extra usage" - tym dolarem, tym drugim.

Tanio już było. Lokalne modele to nie tylko bezpieczeństwo danych - to też zdrowy rozsądek finansowy.

### 4. Czego AI nie zrobi za PM-a

Padło pytanie, jak duże jest zagrożenie, że project managerów zastąpi AI. **Moim zdaniem - w przewidywalnej przyszłości nie**.

W mniejszych zespołach, gdzie nie stać na PM-a, marketingowiec albo specjalista wesprze się AI i to ma sens. Ale przy większych projektach z wieloma zespołami zaczynają się rzeczy, których AI nie ogarnie:

- Konflikty priorytetów - finanse chcą zrobić tanio, marketing chce baner na Pałacu Kultury
- Negocjacje między KPI - "wydamy tyle, ale tyle zarobimy" vs "ale przekroczyliśmy budżet"
- Budowanie zaufania, czytanie ludzi, łapanie tego, co nie jest zapisane

Teoretycznie AI może wymyślić rozwiązanie. Praktycznie - i tak ludzie usiądą i przyklepią wszystko po swojemu.

> Interfejs białkowy wciąż wygrywa w pewnych obszarach.

Zaufanie, empatia, nieoczywiste decyzje - to nadal nasza działka.

### 5. Analogowe będzie znowu cool

Mocna teza, którą obstawiam: w świecie, gdzie wszystko zaczyna wyglądać tak samo (klasyczny *AI slop*), oryginalność i "zrobione przez człowieka" odzyska wartość.

> Jakbym miał coś powiesić na ścianie - bardzo bym chciał, żeby to wymyślił człowiek.

Posty na LinkedIn? Każdy z nas, łącznie ze mną, prosi model o "refinement" - poprawa błędów, usunięcie powtórzeń. I tak po cichu zatracamy oryginalność.

Stawiam, że za chwilę wyróżnikiem będzie właśnie **post z literówką, grafika z błędem, niedoskonała pierwsza wersja**. Coś, co świadczy, że za tym stał człowiek.

### 6. Jak wdrażać AI w firmie, żeby ludzie się nie zbuntowali

W tej rozmowie dużo mówiłem o tym, jak nie psuć wdrożeń AI. Bo widzę dwa skrajne typy zespołów:

- Jedni mają już agentów spiętych z chmurą, pełen workflow, automatyzacje
- Drudzy drukują umowę, biorą flamastr i redlinują na papierze

I wiesz co? Oba są OK. Każda organizacja ma swój punkt startu.

Najgorsze, co możesz zrobić, to przyjść z deklaracją: "od dzisiaj wszyscy używamy agentów". To się nie sprawdzi. Ludzie się tego po prostu boją i nie będą z tego korzystać.

**Zacznij inaczej. Zapytaj zespół: "Czego nienawidzicie robić?".** Usłyszysz coś w stylu: "na koniec miesiąca robimy zestawienie faktur dla księgowej, jest KSeF, robimy zdjęcia, każdy plik osobno...". Masz winowajcę. Zautomatyzuj jedną rzecz, która faktycznie boli. Jak zadziała, ludzie sami zaczną pytać: "a może jeszcze to?".

Najlepsze wdrożenia AI to te, których prawie nie widać. Ostatnio rozmawiałem z kimś, kto mówi: "mam 150 nieprzeczytanych maili i boję się ich otwierać, bo nie wiem czy tam jest 'okej, dzięki', czy coś naprawdę pilnego". Pokazuję mu jeden klik w Gmailu - "podsumuj" - i widzę: kamień z serca. To jest AI, którego ludzie potrzebują. Nie wielki bot. Jeden przycisk, który zabiera ból.

### Na koniec

Tak właśnie podchodzę do tematu w **Workshift** - sprowadzamy AI na ziemię, jeden proces na raz, bez rewolucji. Jeśli ten sposób myślenia rezonuje, to cała rozmowa (z mnóstwem konkretnych historii, których nie zmieściłem tutaj) jest do obejrzenia poniżej.

[**Posłuchaj odcinka na YouTube →**](https://www.youtube.com/watch?v=p0zNNcAjkMk)

Dzięki, Chris, że zaprosiłeś. Polecam też zaglądać do **Value Builders Hub** - społeczności, którą Chris prowadzi.

A jeśli zastanawiasz się, jak AI może realnie pomóc Twojemu zespołowi - zacznij nie od strategii, tylko od jednej rzeczy, którą robisz codziennie i która Cię wkurza. Resztą się zajmiemy.
    `,
  },
  {
    slug: 'pomelli-od-dzis-w-eu',
    title: 'Pomelli od Google: koniec z szukaniem logo_final_final_v2.png',
    category: 'Wiedza',
    date: '2026-04-24',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/pomelli-od-dzis-w-eu.webp',
    excerpt:
      'Pomelli od Google jest już dostępne w UE. Pobiera branding z Twojej strony WWW i automatycznie tworzy kreacje reklamowe i grafiki social media.',
    content: `
Chcesz wrzucić na szybko post z jakąś ładną, spójną grafiką. Odpalasz Canvę czy program graficzny i się zaczyna. Na dysku szukasz kodów kolorów Twojej marki, przekopujesz foldery żeby znaleźć logo bez tła (obiecując sobie przy okazji, że w końcu uporządkujesz pliki i zmienisz tę nieszczęsną nazwę z logo_final_final_v2_final.png).

Pilnowanie spójności wizualnej to często organizacyjny koszmar, zwłaszcza gdy nie masz pod ręką grafika.

Też tak czasem mam, dlatego z czystym sercem mogę polecić proste narzędzie od Google:

**Pomelli** ([labs.google.com/pomelli](https://labs.google.com/pomelli)) – od wczoraj dostępne w UE (wcześniej trzeba było korzystać z VPN, żeby uzyskać dostęp).

### W skrócie - Pomelli:

*   na podstawie adresu Waszej firmowej WWW pobiera branding (czcionki, paletę kolorów, styl komunikacji)
*   automatycznie tworzy kreacje reklamowe, wzory grafik do social mediów, czy co tam sobie wymarzymy.

Tylko tyle i aż tyle.

### Dlaczego to działa

Przyznam, że to jest dokładnie ten rodzaj AI, który lubię najbardziej - do bólu pragmatyczny, rozwiązujący konkretny problem, no i darmowy :).

Zero zabawy w ręczne ustawianie brand booka. Zero pisania doktoratów z promptowania. Czy to wypluje od razu dzieło sztuki? Nie. Wiadomo, że do większej kampanii i tak będziesz potrzebować doświadczonego oka artysty-grafika. AI rzadko robi od razu wszystko idealnie.

Ale jako mocny punkt wyjścia, który sprawdzi się w codziennej komunikacji? Sprawdza się genialnie. Technologia schodzi tu na dalszy plan, a my po prostu odzyskujemy czas.
    `,
  },
  {
    slug: 'brave-ai-community-meetup-poznan',
    title: 'II Meetup BRAVE AI Poznań: Build fast. Validate faster',
    category: 'Wydarzenia',
    date: '2026-04-13',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/meetup-brave-ai-poznan.webp',
    excerpt:
      'Zapraszam na 2. meetup BRAVE AI Community w Poznaniu! Porozmawiamy o tym, jak szybko i tanio walidować pomysły biznesowe z AI.',
    content: `
Rośnie nam w Poznaniu świetne community AI, którego mocno tu brakowało. Bardzo się cieszę, że do niego dołączyłem!

### Build fast. Validate faster.

Chcecie dowiedzieć się, jak z pomocą AI szybko sprawdzić, czy Wasz pomysł, nowa usługa albo usprawnienie w firmie faktycznie są warte "milion dolarów" - a przy okazji na tych testach nie zbankrutować?

Porozmawiajmy o tym już **14 kwietnia** na #2 meetupie BRAVE AI Community. Temat to: *Build fast. Validate faster.*

### Kogo zobaczycie na scenie?

Na scenie mocny skład praktyków:
*   Artur Skwarek
*   Michał Niekrasz
*   Piotr Synowiec

Ja też dorzucę coś od siebie i podzielę się krótką, życiową historią: **"Jak stracić przyjaciół i zaoszczędzić 35 000 PLN, budując aplikacje z Claude i Lovable"**.

Jeśli macie ochotę posłuchać wystąpień, ale przede wszystkim zbić piątkę, wymienić się doświadczeniami i poznać super ludzi – gorąco zapraszam.

---

📅 **14 kwietnia**
📍 Collegium Da Vinci, Poznań

**Rejestracja:** [Luma - Build fast. Validate faster.](https://luma.com/build-fast-validate-faster)
    `,
  },
  {
    slug: 'google-turboquant-kompresja-ai',
    title: 'Google TurboQuant: Algorytm, który zmieści potężne AI w Twoim telefonie',
    category: 'Wiedza',
    date: '2026-04-10',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    excerpt:
      'Google zaprezentowało algorytm bezstratnej kompresji KV cache. Co to oznacza dla prywatności i szybkości AI na smartfonach?',
    content: `
Był kiedyś taki serial - Dolina Krzemowa, ktoś pamięta? Opowiadał o startupie Pied Piper który próbował stworzyć algorytm bezstratnej kompresji, który miał wywrócić świat technologii do góry nogami. To była oczywiście fikcja.

Ale Google niedawno zaprezentowało coś, co jednoznacznie kojarzy się z takim właśnie rozwiązaniem. I do tego udostępnili to wszystkim za darmo!  

### Problem: Wąskie gardło pamięci

Kiedy piszesz z AI, model zapisuje całą waszą rozmowę w tymczasowej pamięci (tzw. KV cache). Przy długiej rozmowie, ta "ściągawka" dla jednego użytkownika potrafi zżerać 40 GB pamięci. Czyli połowę serwerowej karty graficznej za 30 000$. Tylko po to, żeby model pamiętał, że godzinę temu prosiłeś go o tabelkę w Excelu.

Gdy pamięć w chmurze się zapycha – system nie przyjmuje nowych zapytań. To obecnie największe "wąskie gardło" AI.

### Rozwiązanie: TurboQuant

I tu całe na biało wchodzi Google z algorytmem **TurboQuant**.
Udało im się skompresować tę pamięć tymczasową 6-krotnie. Zjechali z wagą danych do zaledwie 3 bitów na wartość. 

**Haczyk? Brak.** Zrobili to z zerowym spadkiem dokładności. Żadnej utraty jakości. Zero loss.

### Co to oznacza dla nas?

Dla gigantów technologicznych to oznacza jedno: na tym samym drogim sprzęcie mogą obsłużyć 6 razy więcej rozmów.

Ale dla nas, zwykłych śmiertelników, to oznacza coś o wiele ciekawszego. Potężne, inteligentne modele AI staną się tak lekkie, że za chwilę odpalisz je w pełni lokalnie, za darmo i bezpiecznie na podstawowym komputerze za parę tysięcy złotych. Albo bezpośrednio na swoim smartfonie. Szybciej, taniej i z o wiele dłuższą pamięcią kontekstu.

Google mogło to schować do szuflady i wykorzystywać tylko dla siebie, ale udostępnili to wszystkim. Więc za moment Twój telefon będzie w stanie spakować i bezbłędnie przeanalizować całą historię Twojej firmy z ostatnich 5 lat.
    `,
  },
  {
    slug: 'vibe-coding-demokratyzacja-software',
    title: 'Vibe-coding: Dlaczego "good enough" dowiezione dzisiaj jest lepsze niż perfekcja',
    category: 'Wiedza',
    date: '2026-04-05',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    excerpt:
      'Czy AI w rękach laików to budowa domu narzędziami z Lidla? O demokratyzacji tworzenia oprogramowania i sile MVP.',
    content: `
Przeczytałem dzisiaj wpis na LinkedIn o tym, że "vibe-koderzy" używający AI do pisania aplikacji to amatorzy, którzy z narzędziami z Lidla porywają się na budowę domu. Autor twierdzi, że AI w rękach laików nadaje się tylko do napisania prostego skryptu, a nie robienia realnych projektów.

Nie do końca się z tym zgadzam, mam trochę inną, też budowlaną analogię.

### YouTube w świecie kodu

Narzędzia takie jak Claude Code czy Cursor to odpowiednik dzisiejszego YouTube’a w świecie wykońzeniówki. Kiedyś, jeśli nie nauczył Cię tego rodzic albo szkoła, do każdego remontu musiałeś wołać specjalistę. Nieważne, czy to kładzenie gładzi, czy zwykłe malowanie. Nie miałeś alternatywy, więc płaciłeś te kilka/kilkanaście tysięcy, albo odkładałeś remont w nieskończoność.

Dzisiaj? Odpalasz tutorial na YouTube, dowiadujesz się, jak oczyścić, zagruntować i pomalować ścianę. Kupujesz wałek i robisz to sam.

*   Czy będzie to jakość mistrza z 20-letnim stażem? Prawdopodobnie nie.
*   Czy będzie to jakość "good enough", w której da się mieszkać? **Zdecydowanie tak.**

### Demokratyzacja budowania

MŚP często nie potrzebuje "startupu za miliard" ani perfekcyjnego kodu. Potrzebuje po prostu taniego sprawdzenia hipotezy, MVP albo prostej automatyzacji.

Co więcej, kiedy taka firma przy kolejnym, "większym remoncie" zaprosi do współpracy profesjonalistę, jej właściciel nie jest już całkowitym laikiem. Dzięki samodzielnej pracy z AI zdobył doświadczenie, lepsze rozumienie procesów i staje się partnerem do dyskusji. 

AI właśnie demokratyzuje budowanie oprogramowania. A "good enough" dowiezione dzisiaj, jest zawsze lepsze niż perfekcyjny projekt, na który firmy po prostu nie stać.
    `,
  },
  {
    slug: 'zatrudnie-juniora-ai',
    title: 'Zatrudnię Juniora za 2000$ miesięcznie! (Z małym twistem)',
    category: 'Wiedza',
    date: '2026-03-01',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.webp' },
    image: '/images/blog/zatrudnie-juniora-ai.webp',
    excerpt:
      'Ten junior pracuje 24/7, nie bierze L4 i nie zapomina o zadaniach. Poznaj junior.so i nową rzeczywistość agentów AI.',
    content: `
Zatrudnię Juniora za 2000$ miesięcznie! 
Takiego, co pracuje 24/7, nie bierze L4 i nie zapomina o żadnym zadaniu.

Brzmi nieźle? Jest tylko mały twist – ten junior to (oczywiście) AI.

Niedawno premierę miał serwis **junior.so**. Niby nic specjalnego, kolejny startup oparty o AI. Ale tym razem jest jakoś dziwnie - usługa pozwala nam zatrudnić niemal prawdziwego pracownika. Z własnym firmowym mailem, kontem na Slacku i ludzkim awatarem. Takiego, który przychodzi na calle na Zoomie, robi notatki, wychodzi z inicjatywą i realizuje zadania.

Ale spokojnie, nie ma się co martwić, że AI zabierze nam pracę. Parę dni temu powstała platforma **rentahuman.ai**. W tym serwisie to Agenci AI mogą wynająć żywego człowieka na godziny. Do odklikania zadań, z którymi kod jednak sam sobie nie radzi.

Więc rewolucja na rynku pracy raczej nie będzie wyglądać jak kadr z Terminatora.

Może zamiast tego na firmowym Slacku po prostu pojawi się skrypt, który jak czegoś nie ogarnie, to wynajmie nas na godziny jako swojego podwykonawcę. I jeszcze bezczelnie dopyta o deadline.
    `,
  },
];

export const blogCategories = [...new Set(blogPosts.map((post) => post.category))];

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
