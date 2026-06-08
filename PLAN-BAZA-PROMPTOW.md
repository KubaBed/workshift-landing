# Plan: Biblioteka Promptów + Skilli AI (lead magnet `/prompty`)

> Status: **Faza 2 + kategorie DONE** (strona `/prompty` działa, build OK) · czeka na tłumaczenie PL · Utworzono: 2026-06-08
> Źródło: [prompts.chat](https://prompts.chat) = repo [`f/awesome-chatgpt-prompts`](https://github.com/f/awesome-chatgpt-prompts)
> Klon roboczy: `~/Projekty/_scratch/awesome-chatgpt-prompts`

## Kategorie tematyczne (DONE 2026-06-08)

Klasyfikacja **keyword-based w `scripts/build-prompts-data.py`** (zero tokenów, deterministyczna, na ang. słowach kluczowych). Taksonomia: **6 branż ICP** (priorytet) + **6 funkcyjnych** + `inne`. Pole `category` w index.json + prompts.json; lista kategorii z licznikami w `meta.categories`. UI: chipy w 2 grupach (branże wyróżnione lime), badge kategorii na karcie.

Rozkład (1845): **ICP** prawo 18 · hr 40 · ecommerce 15 · marketing 89 · produkcja 11 · konsulting 57 (**razem ~230**). **Funkcyjne** programowanie 442 · kreatywne 292 · pisanie 127 · produktywnosc 85 · edukacja 73 · dane 18 · **inne 578**. Źródło jest dev/creative-heavy — stąd małe buckety branżowe (to one są celem kuracji/wzbogacenia).

> Etykiety PL kategorii są w 2 miejscach (muszą być zsynchronizowane): `CATEGORY_META` w skrypcie + `CATEGORY_LABELS` w `PromptyPage.jsx`.

## Tłumaczenie — analiza tokenowa (decyzja)

Całość (4.4 MB ≈ ~1.1M tok źródła) przez LLM inline = **~2–2.5M tokenów**, drogo/wolno/trudna kontrola jakości. **Decyzja: NIE tłumaczyć masowo** — źródłowe bufory branżowe są zaszumione (dev/CN/śmieci). Zamiast tego: **kuracja + autorskie prompty PL**.

## Lokalizacja PL — overlay (DONE 2026-06-08, batch 1)

Architektura: **`scripts/prompts-pl.json`** (ręcznie edytowalny) doklejany przez build:
- `translations`: `id → {act, prompt}` — nadpisuje PL na promptach źródłowych (pola `actPl`/`promptPl`, `lang=pl`).
- `additions`: autorskie prompty Workshift (`source=workshift`, sortowane NA GÓRĘ listy).

Build dodaje do rekordów: `lang`, `source`, `actPl`, `promptPl`. Index: `act`/`preview` są **PL-preferred** → polskie wyszukiwanie działa. Strona: badge **WORKSHIFT**/**PL** na kartach, modal+kopiowanie biorą `promptPl||prompt`.

**Batch 1+2+3: 68 tłumaczeń + 37 autorskich PL = 105 pozycji.** Razem 1882 prompty. Rozmiar: index 634 KB, full 4.6 MB.
- **Batch 3 dodał:** 58 tłumaczeń wyselekcjonowanych klasyków/uniwersalnych z prompts.chat (produktywność, pisanie, edukacja, marketing, konsulting, dane, programowanie, HR) + 6 autorskich pod usługi Workshift (Audyt procesu pod automatyzację, Projekt agenta AI, Scenariusz chatbota, Mapa procesu, Workflow Make/Zapier/n8n, Brief wdrożenia AI).
- Selekcja: filtr anglojęzyczne + długość 160-1100 + ręczny dobór; pominięto CN/dev-spec/niszowe.

## Persony (DONE 2026-06-08) — zamiast „Skilli"

Zakładka **„Skille" (link-out) zastąpiona „Persony"** — autorskie system prompty PL do wklejenia jako opis gema (Gemini) / instrukcje Custom GPT / system prompt. Treść: `scripts/personas-pl.json` (generowana przez `scripts/gen-personas.py`), build emituje `public/prompty/personas.json`. **12 person** (asystent operacyjny, strateg treści, copywriter, analityk automatyzacji, asystent prawny, HR, obsługa klienta, sprzedaż B2B, mentor produktowy, redaktor PL, nauczyciel, krytyczny recenzent). UI: karty + modal (reuse `PromptModal`, przycisk „Kopiuj instrukcję").

## Toggle „Tylko polskie" (DONE)

Przełącznik na zakładce Prompty filtruje do `lang==='pl'` (licznik 105). Przedsmak docelowego stanu **PL-only** — gdy PL dobije ~200, rozważyć ustawienie go domyślnie / ukrycie EN.

**Batch 4+5 (2026-06-08): CEL OSIĄGNIĘTY — 200 PL promptów** (156 tłumaczeń + 44 autorskie) + 12 person. Rozkład po 12 kategoriach (konsulting/produktywność 29, HR/pisanie 23, marketing 21, edukacja 18, programowanie 17, prawo/ecommerce 11, dane 8, produkcja 6, kreatywne 4). Wszystkie polskie prompty mają kategorię ICP/funkcyjną — żaden nie wpadł do „Inne".

**PL-only domyślnie WŁĄCZONE** (`onlyPl` default `true` w `PromptyPage.jsx`): widok pokazuje 200 PL, toggle wyłącza → pełna baza 1889. Liczniki kategorii respektują toggle (PL-only chowa puste). H1 = „Baza promptów i person AI", hero/meta zaktualizowane.

**TODO:** review treści przez Kubę → wydzielić branch `feat/baza-promptow` → commit/GitHub. Później: SEO (sitemap/OG, linkowanie z homepage/bloga), więcej person/promptów wg potrzeb.

> Etykiety PL kategorii nadal w 2 miejscach (skrypt `CATEGORY_META` + `PromptyPage.jsx` `CATEGORY_LABELS`) — trzymać w sync.

---

## Faza 0 — WYNIKI REKONESANSU (2026-06-08)

**Dane (`prompts.csv`):** 1 863 rekordów. Kolumny: `act, prompt, for_devs, type, contributor`.
- `type`: **TEXT 1551 · STRUCTURED 291 · IMAGE 21** (modalność, nie prompt-vs-skill).
- `for_devs=TRUE`: 153. Każdy rekord ma `contributor`.
- **Prompty zwykłe: ~1 845.** Skille multi-plik (z separatorem `\x1FFILE:`): **18**.

**Skille:** w CSV jest tylko 18 (multi-plik, treść sklejona separatorami ASCII `\x1F`/`\x1E`, parsowalne wg `src/lib/skill-files.ts`). Pełny katalog z `prompts.chat/skills` (~55) jest **seedowany z repo [`anthropics/skills`](https://github.com/anthropics/skills)** (patrz `scripts/seed-skills.ts`) — to oryginalne źródło.

**LICENCJE — kluczowe rozróżnienie:**
- ✅ **Prompty = CC0 1.0** (domena publiczna). Zero ryzyka, pełna swoboda republikacji/tłumaczenia.
- ⚠️ **Skille = NIE jednoznacznie wolne.** Pochodzą z `anthropics/skills` + autorów zewnętrznych (np. „Lead Generator (WordPilot.pro)", „trello-integration-skill", „MoltPass…"). Z 18 w CSV: 2 odsyłają do własnego `LICENSE.txt`, 16 bez jawnej licencji w frontmatter. **Republikacja każdego skilla wymaga sprawdzenia jego licencji osobno.**

**Implikacja techniczna:** 1 845 promptów to duży zbiór — **nie bundlować do JS**; trzymać jako statyczny JSON ładowany leniwie / stronicowany (ochrona LCP — pamięć o three.js).

### Decyzja do podjęcia przed Fazą 1 (skille)
- **Opcja A (rekomendowana, bezpieczna):** publikujemy **prompty (CC0)** w pełni; **skille linkujemy na zewnątrz** (do prompts.chat/skills + `anthropics/skills`) zamiast rehostować — zero ryzyka licencyjnego, nadal dajemy wartość.
- **Opcja B:** rehostujemy **tylko skille z wyraźnie permisywną licencją** (po audycie `anthropics/skills` + per-skill), z atrybucją.
- **Opcja C:** rehostujemy wszystkie 18/55 z atrybucją „as-is" — najwyższe ryzyko, niezalecane.

---


## Decyzje (zatwierdzone)

| Decyzja | Wybór |
|---|---|
| Zakres | **Pełny zbiór** promptów **+ skille (Agent Skills)** |
| Integracja | **Natywna przebudowa danych** w stacku Workshift (nie klon apki) |
| Model magnetu | **W pełni darmowa** (bez bramki e-mail), miękkie CTA: newsletter + WhatsApp/audyt |
| Tłumaczenie | **Odłożone** — budujemy na treści EN, lokalizacja PL = osobny późniejszy etap |
| Route | **`/prompty`** + zakładki „Prompty" / „Skille"; tytuł „Baza promptów i skilli AI" |

## Licencja (kluczowe)

- **Prompty = CC0 1.0** (domena publiczna) → pełna swoboda republikacji/modyfikacji.
- **Kod/treści serwisu = MIT.**
- **Skille (Agent Skills)** — format multi-plik `SKILL.md`; **licencja do weryfikacji per-skill** (część może mieć obcą proweniencję). Jedyny twardy punkt prawny.
- Grzecznościowa atrybucja: „Inspirowane prompts.chat (CC0)".

## Architektura docelowa

- Dane: `src/data/prompts.js` (`act, prompt` → pola PL puste na przyszłość) + `src/data/skills.js` (`nazwa, opis, kategoria, body md, pliki?, zrodlo, licencja`).
- Strona: `src/pages/PromptyPage.jsx`, lazy route w `src/App.jsx`, link w `navLinks` w `src/components/Header.jsx`.
- UI: zakładki Prompty/Skille, wyszukiwarka + filtry kategorii (chipy), karty z „Kopiuj" + toast + modal. Skille: reuse renderera markdown z `src/pages/BlogPostPage.jsx` (`renderContent`).
- Design system: `bg-sage` / `lime` / `font-display` / `font-mono` (treść) / `glass-panel` / `framer-motion`, responsywne do 320px.
- Konwersja: DOI Resend (`api/subscribe-newsletter.js`), eventy w `src/lib/analytics.js`: `LIBRARY_VIEW`, `PROMPT_COPY`, `SKILL_VIEW`, `SKILL_COPY`, `LIBRARY_SEARCH`.

## Fazy

- **Faza 0 — rekonesans + licencja**: klon repo poza projektem; zlokalizować `prompts.csv` (kolumny, liczba); znaleźć fizyczne źródło ~55 skilli (folder/seed/scrape); sprawdzić licencje skilli; notka licencyjna.
- **Faza 1 — dane**: `prompts.js` + `skills.js` (treść EN, schemat gotowy na PL).
- **Faza 2 — UI**: strona + route + nav + zakładki + karty + modale.
- **Faza 3 — konwersja**: darmowy dostęp, CTA newsletter/WhatsApp/audyt, eventy analytics.
- **Faza 4 — SEO**: meta/title/OG, deep-linki `?tab=…&q=…`, sitemap, linkowanie wewnętrzne, atrybucja.
- **Faza 5 — weryfikacja**: `npm run dev` (port **5183**), test zakładek/kopiowania/modali/mobile 320px, `npm run build` + `npm run lint`.

## Ryzyka

1. Licencje pojedynczych skilli (weryfikacja w Fazie 0).
2. Lokalizacja źródła treści skilli w repo.
3. Rozmiar bundla — pełny zbiór ładować leniwie / dzielić dane (pamięć o problemie LCP/three.js z PageSpeed).
