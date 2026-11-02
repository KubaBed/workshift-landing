---
slug: "firmowa-baza-wiedzy-dobre-praktyki"
title: "Baza wiedzy, która odpowiada na 15 000 pytań dziennie - co warto z niej skopiować do Twojej firmy"
seoTitle: "Firmowa baza wiedzy AI - dobre praktyki"
category: "Wiedza"
date: "2026-07-17"
author: "Jakub Bednarz"
image: "/images/blog/firmowa-baza-wiedzy-dobre-praktyki.webp"
excerpt: "Cerebras opublikował techniczny opis swojej wewnętrznej bazy wiedzy - 15 000 pytań dziennie, korzystają z niej ludzie, automatyzacje i agenty AI. Rozbieram ich architekturę na zasady, które działają w każdej skali, i pokazuję, jak wdrożyć je w firmie bez działu ML."
---

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

A jeśli wolisz to policzyć i zaplanować na spokojnie - [zacznij od bezpłatnej rozmowy diagnostycznej](/#kontakt). 30 minut, zero zobowiązań, wychodzisz z mapą wiedzy w swojej firmie i konkretnym pierwszym krokiem.
    