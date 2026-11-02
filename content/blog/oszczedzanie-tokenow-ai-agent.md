---
slug: "oszczedzanie-tokenow-ai-agent"
title: "Ciągle brakuje tokenów? Naucz swojego agenta AI oszczędnego gospodarowania zasobami"
seoTitle: "Jak oszczędzać tokeny w agencie AI"
category: "Wiedza"
date: "2026-07-04"
author: "Jakub Bednarz"
image: "/images/blog/oszczedzanie-tokenow-ai-agent.webp"
excerpt: "Wchodzimy w drugą fazę AI - tę, w której tokeny i narzędzia zaczynają realnie kosztować. Trzy konkretne sposoby, żeby nauczyć swojego agenta AI oszczędnego gospodarowania zasobami - i jeden nawyk, który oszczędza jeszcze więcej."
---

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

Jedno zastrzeżenie, o którym warto wiedzieć przed wdrożeniem: **tryb proxy przepuszcza ruch do Anthropic czy OpenAI przez lokalny proces** - to technicznie man-in-the-middle, i projekt sam ostrzega w dokumentacji, żeby nie wystawiać takiego proxy publicznie bez autoryzacji. Jeśli pracujesz z danymi klientów albo kluczami API - zacznij od trybu biblioteki (`from headroom import compress`) albo `headroom wrap`, nie od proxy na produkcji.

### Sposób 3: Caveman - agent, który mówi mniej, ale nie mniej precyzyjnie

[Caveman](https://github.com/JuliusBrussee/caveman) celuje w gadatliwość samego modelu - te wszystkie wstępy, dygresje i uprzejmości, które nic nie wnoszą do odpowiedzi. Instaluje się jako skill w agencie i zmienia styl komunikacji na skondensowany: bez zdań w stylu "Chętnie Ci w tym pomogę", za to z pełną techniczną dokładnością - kod, komendy i komunikaty błędów zostają nietknięte co do znaku.

Na 10 testowych promptach dało to średnio **65% redukcji tokenów odpowiedzi** (zakres 22-87%). Przykład: wyjaśnienie buga z re-renderem w React spadło z 1180 do 159 tokenów - **87% oszczędności**. Jest tu jednak uczciwe zastrzeżenie z dokumentacji: *Caveman zmniejsza tylko tokeny wyjściowe. Tokeny wejściowe i rozumowania zostają nietknięte, a sam skill dokłada ~1-1,5k tokenów wejściowych na turę.* To narzędzie do gadatliwości, nie do wszystkiego - ale tam, gdzie boli najbardziej (długie wyjaśnienia, częste interakcje), robi realną różnicę.

### Bonus: second brain, żeby agent nie zaczynał każdej rozmowy od zera

Wszystkie trzy narzędzia powyżej oszczędzają tokeny **w obrębie jednej rozmowy**. Jest jeszcze jeden nawyk, który oszczędza tokeny **między rozmowami** - i w mojej praktyce daje najwięcej: własny "second brain", czyli uporządkowana baza wiedzy, z której agent czerpie kontekst na żądanie, zamiast dostawać (albo odpytywać) wszystko od nowa przy każdej sesji.

Zamiast tłumaczyć agentowi za każdym razem, kim jestem, nad czym pracuję i jakie decyzje już podjąłem, mam to zapisane - a agent sam sięga po konkretną notatkę, kiedy jest potrzebna, zamiast ładować cały kontekst na wejściu. Mniej tokenów wejściowych, mniej powtórzeń, więcej trafności.

To temat na osobny, dłuższy wpis - sam koncept zasługuje na więcej niż akapit. Trochę o pokrewnym podejściu (ustandaryzowany format wiedzy dla agenta) pisałem już w [Open Knowledge Format](/blog/open-knowledge-format-google-cloud) - to fragment tej samej układanki.

### Co z tym zrobić dzisiaj

Nie musisz wdrażać wszystkiego naraz. Jeśli piszesz kod z agentem - zacznij od Ponytail, to jedna komenda instalacji i natychmiastowy efekt na rachunku. Jeśli Twój agent dużo czyta (logi, RAG, wyniki narzędzi) - Headroom da największy zwrot. Jeśli po prostu rozmawiasz z agentem cały dzień i płacisz za każde jego "chętnie wyjaśnię" - Caveman jest najszybszy do wdrożenia (30 sekund, jedna komenda w terminalu).

A jeśli robisz to wszystko na raz - prawdopodobnie czas pomyśleć o second brain. Chętnie pogadam, jak by to wyglądało u Ciebie - [napisz do mnie](/#kontakt). Bezpłatna rozmowa diagnostyczna, 30 minut, zero zobowiązań.
    