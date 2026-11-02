---
slug: "baza-wiedzy-ktora-przekonala-sceptykow"
title: "Sceptyka nie przekona prezentacja o AI. Przekona go firmowa baza wiedzy"
seoTitle: "Jak przekonać zespół do AI: firmowa baza wiedzy"
category: "Wiedza"
date: "2026-08-30"
author: "Jakub Bednarz"
image: "/images/blog/baza-wiedzy-ktora-przekonala-sceptykow.webp"
excerpt: "Najnudniejsze wdrożenie AI, jakie zrobiłem u siebie, zrobiło dla adopcji więcej niż niejeden ambitny projekt. Opisuję je uczciwie: co zadziałało, ile naprawdę trwało i na czym baza wiedzy poległa tak, że musiałem dzwonić do klienta z przeprosinami."
---

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
  