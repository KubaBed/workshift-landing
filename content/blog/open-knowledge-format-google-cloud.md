---
slug: "open-knowledge-format-google-cloud"
title: "Jak nakarmić agenta wiedzą o Twojej firmie? - Open Knowledge Format"
seoTitle: "Open Knowledge Format - wiedza dla agentów AI"
category: "Wiedza"
date: "2026-06-14"
author: "Jakub Bednarz"
image: "/images/blog/open-knowledge-format.webp"
excerpt: "Google Cloud opublikowało otwartą specyfikację formatu na wiedzę dla agentów AI - po prostu katalog plików markdown z YAML-em. Zero SDK, zero vendor lock-in. Wyjaśniam, co to oznacza dla polskiej firmy, która chce, żeby AI wreszcie znała jej procesy."
---

  Większość firm, które wdrażają AI, trafia po dwóch miesiącach na ten sam mur: model odpowiada mądrze, ale **nie zna naszej firmy**. Pyta o rzeczy, które są w wewnętrznej wiki. Wymyśla procesy, które u nas wyglądają inaczej. Nie pamięta, że u nas faktura idzie najpierw do Kasi, a potem do systemu.

  To nie jest wina modelu. To jest wina **braku ustandaryzowanego sposobu, w jaki firmy dają modelowi swoją wiedzę**.

  12 czerwca 2026 Google Cloud opublikował coś, co może to zmienić. Nazywa się **Open Knowledge Format (OKF)** - otwarta specyfikacja, która zamienia "wiki dla agenta" w coś, co różne narzędzia, różne firmy i różne agenty potrafią ze sobą bezboleśnie wymieniać.

  A pod spodem to zwykły katalog plików markdown z YAML-em. Zero magii.

  ### Co konkretnie Google opublikowało

  OKF to propozycja formatu, w jakim wiedza firmy ma żyć, żeby była zjadliwa dla agentów AI. Trzy rzeczy, które warto wiedzieć od razu:

  [image:/images/blog/okf-folder-structure.webp|Przykładowa struktura katalogu OKF: foldery z plikami markdown, YAML frontmatter, konsumpcja przez agenta]

  **To jest tylko markdown z YAML-em.** Każdy "concept" (tabela w bazie, metryka, runbook, klient, procedura) to jeden plik `.md` z krótkim blokiem frontmatter na górze - `type`, `title`, `description`, `tags`, `timestamp`. Reszta to zwykły markdown z linkami między plikami. Otwierasz w VSCode, edytujesz w Obsidian, commitujesz do gita, renderujesz na GitHubie - jak chcesz.

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

  **1. Minimally opinionated** - jedyne wymagane pole to `type`. Każdy concept musi powiedzieć, czym jest (tabela? metryka? procedura? klient?). Co to za typ, jakie ma pod-pola, jakie sekcje w body - to już decyzja producenta. Specyfikacja definiuje tylko **warstwę interoperacyjności**, nie model treści.

  **2. Producer/consumer independence** - kto pisze wiedzę i kto ją czyta to dwie niezależne decyzje. Człowiek pisze ręcznie - agent czyta. Pipeline eksportuje metadane z bazy - człowiek przegląda w wizualizerze. Jeden LLM syntetyzuje opis tabeli - drugi LLM go konsumuje. Każda ze stron może być wymieniona bez ruszania drugiej.

  **3. Format, not platform** - OKF nigdy nie będzie wymagał konta Google, konta w chmurze ani konkretnego SDK. Wartość formatu polega na tym, **ile stron się nim posługuje**, a nie kto go wymyślił. Dlatego to jest otwarta specyfikacja od dnia pierwszego.

  ### Co to zmienia w praktyce firmy

  OKF v0.1 to specyfikacja, nie gotowy produkt. Nie ma jeszcze "OKF dla firmy w pudełku". Są za to przykłady, referencyjne implementacje i wizualizer, który renderuje dowolny bundle jako klikalny graf w jednym statycznym pliku HTML.

  Co warto zrobić dzisiaj, jeśli interesuje Cię ten kierunek:

  **1. Sprawdź, jak wygląda Twoja obecna wiedza.** Otwórz firmową wiki, CRM, bazę procedur, folder z runbookami. Czy to, co tam masz, dałoby się opisać jako "katalog plików markdown z YAML-em"? Jeśli tak - jesteś bliżej, niż myślisz. Jeśli nie - to jest osobny projekt porządkowy, który i tak warto zrobić niezależnie od AI.

  **2. Zacznij od jednego obszaru.** Nie próbuj "okfizować" całej firmy. Wybierz jeden proces, który agent ma wspierać - np. odpowiadanie klientom na pytania o status sprawy. Opisz w markdownie 5-10 typów sytuacji, dodaj tagi, podepnij agenta. Przetestuj.

  **3. Trzymaj się minimalnej konwencji.** Pliki w katalogu. Frontmatter z `type`, `title`, `description`, `tags`, `timestamp`. Linki między plikami. Jeden `index.md` w katalogu, jeśli ma sens. To wystarczy. Wszystko inne to overengineering, który ktoś będzie musiał utrzymywać.

  **4. Planuj wymianę, nie tylko konsumpcję.** W którymś momencie będziesz chciał przenieść tę wiedzę do innego systemu albo podzielić się nią z partnerem. Jeśli trzymasz się otwartego formatu - to jest trywialne. Jeśli zapiszesz w czymś własnym - masz vendor lock-in w jednym z najważniejszych miejsc w firmie.

  ### Hype check

  Trzeba uczciwie powiedzieć: OKF to specyfikacja z dnia 12 czerwca 2026. Nie ma polskiego community, nie ma sprawdzonych wdrożeń produkcyjnych w MŚP, nie ma polskich tłumaczeń pól. Na tym etapie to lektura, nie zakup - przeczytaj specyfikację, oceń, czy pasuje do Twojego kierunku, i zacznij od jednego pliku.

  Ale właśnie to w niej najlepsze. Format, który **nie wymaga od Ciebie niczego poza markdownem** - to najniższy możliwy próg wejścia. Nie musisz nikogo pytać o zgodę, nie musisz podpisywać umowy z dostawcą, nie musisz nawet wierzyć Google'owi, że specyfikacja przetrwa. Pliki markdown z YAML-em przetrwają. A jeśli OKF nie wypali - zostaniesz z porządną firmową wiki, która i tak jest wartością samą w sobie.

  Dla mnie to jest najciekawsza infrastrukturalna publikacja tego kwartału. Nie dlatego, że rewolucjonizuje AI. Dlatego, że **wreszcie ujednolica warstwę pod spodem** - tę, o której nikt nie mówi, bo nie jest sexy. A bez niej każdy agent w każdej firmie buduje od zera to samo koło.

  Jak chcesz pogadać, jak Twoja obecna wiedza firmowa wyglądałaby po przełożeniu na OKF - [napisz do mnie](/#kontakt). Bezpłatna rozmowa diagnostyczna, 30 minut, zero zobowiązań. Powiem Ci, czy jest w ogóle o czym rozmawiać, czy lepiej najpierw posprzątać wiki.
    