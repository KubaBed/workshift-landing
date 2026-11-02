---
slug: "drugi-mozg-agenta-jak-ciac-tokeny"
title: "Nagranie z webinaru: Drugi mózg agenta, czyli jak ciąć tokeny bez utraty kontekstu"
seoTitle: "Drugi mózg agenta - nagranie z webinaru"
category: "Wiedza"
date: "2026-10-04"
author: "Jakub Bednarz"
image: "/images/blog/drugi-mozg-agenta-jak-ciac-tokeny.webp"
excerpt: "Nagranie mojego wystąpienia na webinarze AI Now Polska jest już na YouTube. Mój agent spalał 28 686 tokenów, zanim padło pierwsze pytanie - pokazuję, jak drugi mózg zbił to do kilkuset. Do tego najważniejsze tezy, pomiary i porażki."
---

  15 września opowiadałem na webinarze AI Now Polska o tym, jak zbudowałem swojemu agentowi drugi mózg i co to zrobiło z rachunkiem za tokeny. Nagranie jest już na YouTube, a poniżej zbieram najważniejsze tezy i liczby z tego wystąpienia.

  To nie jest instrukcja krok po kroku. To raczej mapa: skąd bierze się koszt, co naprawdę działa, a co dobrze wygląda tylko w dokumentacji. Jeśli wolisz posłuchać i zobaczyć demo na żywo, całość trwa niecałe 25 minut:

  [youtube:i1sN9PiTeBk]

  ## 28 686 tokenów, zanim padnie pierwsze pytanie

  Zacznę od liczby, która zaskoczyła mnie samego. W czerwcu mój agent na starcie każdej sesji wczytywał trzy pliki z bazy wiedzy: dziennik zmian (17 062 tokeny), indeks (9 020) i plik z zasadami (2 604). Razem 28 686 tokenów, czyli 14% okna kontekstowego. **W każdej sesji, zanim agent zrobił cokolwiek.**

  We wrześniu te same trzy pliki ważyły już około 115 000 tokenów. Baza rosła, a razem z nią rosła opłata za samo wejście do rozmowy.

  Większość osób, które pracują z agentami, nie wie, ile płaci, zanim zada pierwsze pytanie. Ja też nie wiedziałem, dopóki nie sprawdziłem.

  ## Wzorzec: wiki, które prowadzi agent

  Punkt wyjścia to pomysł Andreja Karpathy'ego, który w kwietniu zmieścił go w jednym zdaniu:

  > „Obsidian is the IDE, the LLM is the programmer, the wiki is the codebase.”

  Czyli: notatki są kodem, a agent jest programistą, który ten kod utrzymuje. Wrzucasz nowe źródło, agent je przetwarza, aktualizuje powiązane strony, odpowiada na pytania i co jakiś czas sprząta. Jedno źródło potrafi dotknąć od 5 do 15 stron.

  U mnie wygląda to tak: osobny katalog na surowe źródła, których nikt nigdy nie zmienia, i wiki podzielone na kategorie. W dniu webinaru było tam m.in. 58 opracowanych źródeł, 57 projektów, 55 encji, 53 pojęcia, 44 klientów, 36 syntez i 16 playbooków. Każda strona to zwykły plik markdown z krótkim nagłówkiem w YAML-u: typ, tytuł, opis, tagi i data. To prawie dokładnie [Open Knowledge Format od Google Cloud](/blog/open-knowledge-format-google-cloud), o którym pisałem w czerwcu. Zero SDK, zero platformy.

  ## Poprawka do wzorca: wiedza dojrzewa wolno, projekty zmieniają się w jedno popołudnie

  Szybko okazało się, że nie wszystko, co trafia do bazy, starzeje się w tym samym tempie. Opracowane źródło czy pojęcie jest aktualne miesiącami. Status projektu, termin albo decyzja potrafią się zmienić w jedno popołudnie.

  Dlatego przy każdej nowej informacji zadaję jedno pytanie: **co sprawi, że ta informacja się zmieni?** Nowe źródło ląduje wśród źródeł. Decyzja, termin czy eksperyment trafia do decyzji albo projektów, gdzie wiadomo, że będzie żyć i się zmieniać.

  > „Biblioteka bez bibliotekarza staje się magazynem.” (W. Strzałkowski, AI Product Heroes)

  ## Kontekst to RAM, baza wiedzy to dysk

  To najważniejsza teza całego wystąpienia. Okno kontekstowe działa jak pamięć RAM: szybka, droga i ograniczona. Baza wiedzy to dysk: pojemny i tani, ale trzeba wiedzieć, po co na nim sięgnąć. Mój błąd z początku polegał na trzymaniu całego dysku w RAM-ie.

  Dziś agent dostaje wiedzę na trzech poziomach:

  [image:/images/blog/drugi-mozg-agenta-warstwy.webp|Trzy poziomy dostępu agenta do bazy wiedzy: L0 na starcie sesji, L1 przy każdej wiadomości, L2 na żądanie]

  - **L0, start sesji:** zamiast całej bazy agent dostaje mapę. Gdzie leży baza, ile ma stron i jak ją przeszukać. Około 200 tokenów.
  - **L1, każda wiadomość:** baza jest przeszukiwana automatycznie przy każdym pytaniu, a agent dostaje najwyżej trzy trafienia. Trwa to 0,076 sekundy.
  - **L2, na żądanie:** agent czyta jedną do trzech stron, które faktycznie trafiły w temat.

  Efekt: z 28 686 tokenów na starcie zostaje około 400, plus dokładnie to, o co pytasz.

  ## Mechanizm zamiast prośby

  Druga teza: jeśli coś ma się dziać za każdym razem, nie proś o to modelu.

  Instrukcje w plikach z zasadami (w Claude Code to CLAUDE.md) są dla modelu kontekstem, a nie konfiguracją. Dokumentacja mówi to wprost: *„Claude treats them as context, not enforced configuration.”* Model może się do nich zastosować, ale nie musi. Skille działają na żądanie, choć ich opisy i tak siedzą w kontekście każdej sesji.

  Dopiero hooki, czyli skrypty uruchamiane na konkretne zdarzenie, takie jak start sesji albo wysłanie wiadomości, wykonują się niezależnie od tego, co postanowi model. Dlatego przeszukanie bazy na poziomie L1 nie jest prośbą do agenta, tylko faktem. U mnie pracują cztery takie hooki.

  ## Zmierzone, nie obiecane

  Wszystko powyżej brzmi dobrze, więc 13 września to zmierzyłem. Ta sama baza, te same pięć pytań, ten sam model, każde pytanie dwa razy, liczy się mediana. Raz z bazą wczytaną hurtem do kontekstu, raz z wyszukiwaniem na żądanie.

  [image:/images/blog/drugi-mozg-agenta-pomiar.webp|Pomiar z 13 września: 73% mniej tokenów w oknie, 53% niższy koszt i 2,5 raza więcej tokenów przetworzonych łącznie]

  Tokenów w oknie na jedno wywołanie było o 73% mniej. Koszt pięciu pytań spadł z 7,52 do 3,55 dolara, czyli o 53%.

  I liczba, którą warto pokazywać uczciwie: łącznie przetworzonych tokenów było **2,5 raza więcej**. Agent, który szuka, wykonuje więcej kroków: przeszukuje, czyta, czasem wraca po więcej. Mimo to rachunek, liczony z uwzględnieniem cache, wyszedł o połowę niższy. Wniosek: patrz na rachunek, a nie na jedną metrykę wyrwaną z kontekstu.

  ## Ulotka kontra pomiar

  W lipcu pisałem o [trzech narzędziach do oszczędzania tokenów](/blog/oszczedzanie-tokenow-ai-agent) i podawałem liczby z ich dokumentacji. Na webinarze pokazałem, co z tych obietnic zostało, kiedy zmierzyłem je na własnej pracy.

  [image:/images/blog/drugi-mozg-agenta-ulotka.webp|Deklarowane oszczędności narzędzi RTK, Caveman i Headroom w porównaniu z pomiarem na realnej pracy]

  - **RTK** obiecuje 60-90%. Na 5 721 komendach wyszło 18,6%, przy ogromnym rozrzucie: przy wynikach lintera 99,8%, przy czytaniu plików 24%.
  - **Caveman** rzeczywiście tnie tokeny wyjściowe o 65%. Tyle że odpowiedzi modelu to około 6% całej sesji, więc realnie wychodzi 4-10%.
  - **Ponytail** obiecuje 54% mniej kodu i tu uczciwa odpowiedź brzmi: to zależy od projektu. Ma za to efekt, który łatwo przeoczyć: mniej linii kodu to mniej tokenów w każdej kolejnej turze.
  - **Headroom** obiecuje 60-95%. Na sesji kodowania zmierzyłem 5,0%, do tego 725 ms opóźnienia na każde zapytanie. 4 września go odinstalowałem.

  Liczby z dokumentacji nie są kłamstwem. Są prawdziwe dla benchmarków, na których je zmierzono. Tyle że Twoja praca to nie benchmark.

  ## Gdzie się wyłożyłem

  Sporą część webinaru poświęciłem porażkom, bo to z nich nauczyłem się najwięcej.

  **Baza w iCloud.** Przeszukanie 256 plików trwało 35,9 sekundy, a sprawdzenie stanu repozytorium kończyło się timeoutem po dwóch minutach. Po przeniesieniu bazy na lokalny dysk to samo wyszukiwanie zajmuje 0,038 sekundy. Najgorsze było to, co działo się po drodze: skoro jedno wyszukanie kosztuje 36 sekund, agent po prostu go nie robi. Odpowiada z ogólnej wiedzy, a Ty nawet nie wiesz, że baza nie została użyta.

  **Pamięć, która milczała przez 3,5 miesiąca.** Narzędzie do pamięci między sesjami (claude-mem) przestało działać przez jeden zerwany link w systemie plików. Żadnego błędu, tylko cisza. Pamięć, która psuje się po cichu, jest gorsza niż jej brak, bo zakładasz, że działa.

  **152 skille, z czego używanych 25.** Opis każdego zainstalowanego skilla siedzi w kontekście każdej sesji, więc nieużywane skille to stały, ukryty koszt. Po audycie zostały 94, a zasada jest prosta: 30 dni bez użycia i skill wylatuje.

  ## Nawyk, który zdejmuje najwięcej

  Ta rzecz nie wymaga żadnego narzędzia. Dwadzieścia tur rozmowy przy 100 tysiącach tokenów kontekstu to 2 miliony przetworzonych tokenów. Ta sama praca podzielona na cztery krótkie sesje po pięć tur przy 25 tysiącach kontekstu to 500 tysięcy. Cztery razy mniej.

  Długa rozmowa z agentem jest wygodna, ale każda kolejna wiadomość płaci za całą dotychczasową historię. Stąd moja zasada: jedno zadanie to jedna sesja, a to, co ważne, ląduje w pliku, nie w rozmowie. Plik z zasadami przetrwa kompresję kontekstu. Rozmowa nie.

  ## A co z wektorami i grafami?

  Naturalne pytanie brzmi: po co grep, skoro są bazy wektorowe i grafy wiedzy? Trend jest wyraźny: nowe rozwiązania łączą wyszukiwanie wektorowe, graf i klasyczne wyszukiwanie pełnotekstowe w jednym. Wektor znajduje rzeczy podobne, graf idzie po relacjach. Mem0 pokazuje w tym roku warstwę pamięci, która zużywa około 6 900 tokenów na zapytanie wobec 26 000 przy pełnym kontekście.

  U mnie warstwa semantyczna jest odłożona świadomą decyzją z lipca. Zwykłe przeszukiwanie tekstu trafia we właściwą stronę na pierwszej pozycji w każdym moim teście. Złożoność dokładam wtedy, kiedy pomiar mówi, że jest potrzebna, a nie wtedy, kiedy jest modna.

  ## Trzy myśli na wynos

  Na koniec webinaru zostawiłem trzy rzeczy, z których każda to najwyżej pół godziny pracy:

  - **Sprawdź, ile płacisz, zanim zadasz pytanie.** Sam start sesji potrafi kosztować więcej, niż się wydaje.
  - **Plik z zasadami ma mówić, gdzie i jak szukać, a nie co jest w bazie.** Wskaźnik zamiast wczytywania wszystkiego.
  - **Jedno zadanie, jedna sesja.** To, co ważne, zapisuj do pliku, zamiast trzymać w rozmowie.

  ---

  Cały webinar, razem z demo na żywo, obejrzysz [na YouTube](https://youtu.be/i1sN9PiTeBk). Dzięki ekipie AI Now Polska za zaproszenie.

  Drugi mózg to nie tylko temat dla programistów. O tym, jak baza wiedzy sprawdza się w zespole obsługi klienta, pisałem w tekście o tym, [co przekonało sceptyków w moim zespole](/blog/baza-wiedzy-ktora-przekonala-sceptykow). A jeśli chcesz pogadać, jak taka baza mogłaby wyglądać u Ciebie, [odezwij się](/#kontakt). W bezpłatnej 30-minutowej rozmowie diagnostycznej ocenimy, czy jest sens iść dalej.
  