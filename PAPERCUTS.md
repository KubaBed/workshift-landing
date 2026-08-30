# Papercuts - lista drobnych uszczerbków UI/UX

> **Po co ten plik:** żeby nie grać w design-wackamole. Oczywisty fix robimy od razu,
> drobiazg trafia tutaj i czeka na spójny redesign obszaru. Chodzi o to, by nie być
> nadreaktywnym i nie zamienić strony w patchwork punktowych poprawek.
>
> Metoda: `~/Projekty/baza-wiedzy/wiki/playbooks/design-with-ai-de-slop.md` (punkt 1).

## Jak tego używać

1. **Zauważasz drobiazg** (własny albo z feedbacku) - dopisz wiersz do tabeli. 30 sekund, bez ceregieli.
2. **Nie naprawiaj od razu**, chyba że fix jest oczywisty i mieści się w jednym commicie bez decyzji projektowych.
3. **Przed redesignem obszaru** przeczytaj wiersze z tego obszaru naraz. Często trzy papercuty to jeden błąd ograniczenia, nie trzy błędy UI.
4. **Zanim zaczniesz naprawiać** - sprawdź, czy pozycja zmienia ograniczenie projektowe (`BRAND.md`, sekcja Design Constraints w `CLAUDE.md`). Jeśli tak, najpierw popraw ograniczenie, potem UI.
5. Naprawione wiersze przenieś na dół, do sekcji "Zamknięte", z datą i hashem commita.

Ostrość: wiersz ma być na tyle konkretny, żeby dało się go zweryfikować bez tej rozmowy.
"Header jakiś taki dziwny" nie jest pozycją. "Header: logo skacze o 2 px przy przejściu na scroll" jest.

## Obszary

`home` · `services` · `blog` · `audyt` · `kalkulator` · `prompty` · `oferta` · `global` (nagłówek, stopka, formularze, consent)

## Otwarte

| Data | Obszar | Co jest nie tak | Skąd | Zmienia ograniczenie? |
|------|--------|-----------------|------|----------------------|
| 2026-08-27 | blog | Linki `<a>` w `.prose-workshift` renderują się bez koloru i podkreślenia | własne (przeniesione z CLAUDE.md „Next Actions" #9) | nie - brak tokenu dla linku w treści |
| 2026-08-27 | oferta | `OfferPage.jsx:82` dokłada drugi `<meta name="robots">` obok `index, follow` z `index.html` - w `<head>` lądują dwa sprzeczne tagi. Skutek jest dziś poprawny (przy konflikcie wygrywa dyrektywa restrykcyjna), ale to przypadek, nie projekt. Wzorzec do podmiany: `ShowcasePage.jsx` nadpisuje istniejący tag i przywraca wartość w cleanupie | znalezione przy budowie /showcase | nie - błąd implementacji, nie ograniczenia |

| 2026-08-30 | blog | `og:image` dwóch postów to hotlink do Unsplash z `w=800`, poniżej zalecanych 1200x630 - karta na FB/LinkedIn wyrenderuje się jako mniejszy wariant. Posty: `google-turboquant-kompresja-ai`, `vibe-coding-demokratyzacja-software` (pole `image` w `blogPosts.js`). Pozostałe 7 ma lokalne pliki w `/images/blog/` | znalezione przy wdrażaniu meta per trasa | nie - dane wpisu, nie ograniczenie |
| 2026-08-30 | global | Lead i akapit wstępny 6 stron statycznych (`/`, `/blog`, `/audyt-ai`, `/kalkulator`, `/prompty`, `/polityka-prywatnosci`) są pisane ręcznie w `scripts/seo-routes.mjs` (`STATIC_FALLBACK`), bo te strony nie mają jednego pola z opisem. Zmiana copy w komponencie ich nie zaktualizuje. Sekcje pod spodem już nie dryfują - idą z danych (`audytQuestions.js`, `kalkulator.js`, `prompty-data/`, `PrivacyPolicyPage.jsx`), tak samo jak usługi i wpisy | wdrożenie generatora statycznego `<head>`/`<body>`, zakres uściślony 2026-08-30 po PR #12 | nie - świadomy kompromis, dotyczy leadów 6 tras |
| 2026-08-30 | global | Nieużywane importy `motion` w 5 plikach (`AudytAiPage`, `BlogPostPage`, `KalkulatorStratPage`, `PromptyPage`, `ThankYouPage`) - `no-unused-vars`. Rollup i tak je wycina | lint | nie - szum w lincie, zero wpływu na bundel |
| 2026-08-30 | blog | `BlogPostPage.jsx` woła `useScroll` i `useSpring` po wczesnym `return <Navigate />` (`react-hooks/rules-of-hooks`). Działa, bo przy braku posta komponent natychmiast przekierowuje, więc kolejność hooków nie zmienia się w żywym renderze - ale to poleganie na przypadku | lint | nie - fix to przeniesienie hooków nad wczesny return |
| 2026-08-30 | global | JSON-LD w `index.html` ma tylko `LocalBusiness`. Brakuje `Article` na wpisach, `Service` na stronach usług, `BreadcrumbList` i `FAQPage`. `patchHead()` w `scripts/build-seo-html.mjs` podmienia wyłącznie tagi z własnej listy, więc blok JSON-LD jest ten sam na wszystkich 23 trasach. Wpływa na rich results i na to, co cytują LLM-y | audyt SEO, `SEO_KEYWORDS.md` | nie - brak warstwy, nie błąd |
| 2026-08-30 | global | `SITE_ORIGIN` w `src/lib/seo.js` to `https://www.workshift.pl` i tam celują canonical oraz `og:url`, ale `@id`, `url` i `image` w bloku `LocalBusiness` w `index.html` nadal wskazują apex `https://workshift.pl`. Schema mówi co innego niż canonical. Fix: wyprowadzić JSON-LD z `SITE_ORIGIN` zamiast trzymać zahardkodowany apex | przegląd po wdrożeniu meta per trasa | nie - niespójność danych |

## Zamknięte

| Data zgłoszenia | Data fixu | Obszar | Co było | Commit |
|-----------------|-----------|--------|---------|--------|
| 2026-08-04 (reguła) | 2026-08-30 | global | 59 wystąpień pauz (U+2014, U+2013) w widocznym copy i komentarzach - sygnatura tekstu AI, a te treści idą pod nazwiskiem Kuby. Kontrola: `perl -CSD -ne '$c+=()=/\x{2014}|\x{2013}/g; END{print $c+0,"\n"}' plik` | 55ea06b + 55877ed |
| 2026-08-30 | 2026-08-30 | global | `robots.txt` nie miał `Disallow: /showcase`, choć `CLAUDE.md` twierdził, że ma. Od teraz regułę dodaje generator `scripts/build-seo-html.mjs` | 55ea06b + 55877ed |
| 2026-08-30 | 2026-08-30 | services | Fallback SEO dla `/uslugi/kreacje` miał 78 słów - najmniej w serwisie. Rozwiązane bez pisania tekstu pod crawlera: generator spłaszcza teraz `innerCards` usługi, więc fallback pokazuje treść, którą React i tak renderuje (291 wyrazów, audyt czysty). Copy usługi nadal jest najkrótsze w serwisie - przeniesione do `AGENT_CONTEXT.md` sekcja 9 jako zadanie redakcyjne, nie papercut | 630344f |
