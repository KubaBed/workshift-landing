# Sesja 2026-07-13 — Kampania „Mikro-audyt AI" + social z bloga

> **UPDATE 2026-07-13 wieczór (sesja lokalna):** wykonane. Tokeny w `.env.local`,
> IG test opublikowany (post+story „agenci"), 7 postów FB zaplanowanych natywnie,
> cron IG w crontab (co 15 min, 9-22). Kampania DOKOŃCZONA na koncie (handoff był zbyt
> optymistyczny - kampania+ad sety nie istniały; skrypt załatany na nowe wymogi API):
> kampania `120247366356500240` + prospecting `120247366435870240` (30 PLN/d) +
> retargeting `120247366388610240` (10 PLN/d), wszystko PAUSED, **spend_cap 500 PLN**.
> Kreacje odtworzone lokalnie (`ad-creatives/`, gitignored). Reklamy: skrypt
> `scripts/meta-campaign-ads.mjs` gotowy, obrazy wgrane — **BLOKER: aplikacja
> 2089061569158895 w trybie dev, wymaga Live**. Monitoring: scheduled task
> `meta-audyt-ai-daily-check` 9:05. Pełny plan: `KAMPANIA-AUDYT-AI.md` (gitignored).

> Zapis kontekstu do wznowienia w nowej sesji (Kuba przełącza środowisko na lokalne).
> Wszystko poniżej jest **zmergowane do `main`**. Stan na koniec sesji.

## TL;DR — gdzie jesteśmy

1. Landing `/audyt-ai` (mikro-audyt AI) — dopracowany pod konwersję i przetestowany. ✅ w `main`.
2. Struktura kampanii Meta Ads — utworzona przez skrypt (custom conversion + audience + kampania PAUSED + 2 ad sety PAUSED). ✅ na koncie Meta.
3. Kreacje reklamowe (statyki + stories) — wygenerowane, zaakceptowane przez Kubę. Reels nagrywa Kuba (miał nagrać „jutro", czyli ~14.07).
4. Posty z bloga na FB+IG — skrypt + 14 grafik w `main`. **Jeszcze nie opublikowane** — czekają na uruchomienie z lokalnego środowiska.

## Następny krok (start nowej sesji)

Kuba przełącza się na **środowisko lokalne** (znika blokada sieci na `graph.facebook.com` z sesji zdalnej — API Meta zadziała bezpośrednio).

**Do zrobienia po przełączeniu:**
1. `git pull` na `main` (ma wszystkie zmiany).
2. Przenieść tokeny do lokalnego `.env.local` (NIE są w repo, były tylko w zdalnym `.env.local`):
   - `SOCIAL_ACCESS_TOKEN=...` (scope: pages_manage_posts, instagram_content_publish, ...)
   - `META_SYSTEM_USER_TOKEN=...` + `META_AD_ACCOUNT_ID=act_2354114885157007`
3. Poczekać na deploy `main` na Vercel → grafiki publiczne pod `workshift.pl/social/...` (wymóg IG API).
4. Publikacja postów — patrz sekcja „Skrypty".

## Konta i ID (Meta)

- System user do reklam: **ClaudeCode**, id `122095668537400893`
- Konto reklamowe: **Workshift-platnosci** = `act_2354114885157007`
- Pixel ID: `1350172243839037` (w `src/lib/consent.js`)
- Custom conversion (start quizu): `1745760736616425`
- Custom audience „zaczął, nie ukończył (30 dni)": `120247358505410240`
- Kampania „Mikro-audyt AI - czerwiec 2026" + ad sety: PAUSED (utworzone skryptem; ID w logu przy uruchomieniu)
- Uwaga: oba tokeny (ads i social) przechodziły przez czat — **rotacja zalecana** po konfiguracji.

## Skrypty (w repo)

### `scripts/meta-campaign-setup.mjs`
Idempotentny (pomija istniejące po nazwie). Tworzy: custom conversion, audience retargetingu, kampanię PAUSED, ad set retargetingowy fazy 2 (audience, opt. CompleteRegistration), ad set prospectingowy fazy 1 (targeting persony „Marek" wg MARKETING_SALES_PLAN §9.3: PL 30-55, zainteresowania biznes/AI/automatyzacja + stack e-commerce; opt. LANDING_PAGE_VIEWS).
Uruchom: `node --env-file=.env.local scripts/meta-campaign-setup.mjs`
Status: kroki 1-4 już wykonane na koncie; przy ponownym runie dokończy tylko ad set prospectingowy (jeśli jeszcze go nie ma).

### `scripts/social-posts.js`
Publikacja 7 wpisów z bloga na FB (planowanie natywne) + IG feed/Stories (bez natywnego planowania — cron lub `--force`). Link jako 1. komentarz na IG. Stan w `.social-state.json` (gitignored, idempotencja).
- `node --env-file=.env.local scripts/social-posts.js --plan` — podgląd (bez sieci)
- `... --fb` — planuje wszystkie posty FB (Meta publikuje o czasie)
- `... --ig` — publikuje dojrzałe IG (do crona co ~15 min)
- `... --ig --force <slug>` — 1 pozycja IG od razu (test tokenu + podpięcia IG)
Harmonogram: 3/tydz (wt/czw/sob 10:00), od najstarszego wpisu do najświeższego.
**Kolejność:** merge → deploy → dopiero publikacja (IG wymaga publicznych URL grafik).

## Co zmienialiśmy w landingu (`/audyt-ai`) — zmergowane

- Pixel `InitiateCheckout` przy starcie quizu (Meta optymalizuje pod start + audience retargetingu).
- Message match hero ↔ kreacje; hero finalnie: **„Twoi ludzie robią ręcznie to, co AI zrobi za nich."** (czas przyszły — obietnica).
- Minimalny header na `/audyt-ai` (logo + telefon, bez nawigacji — mniej wycieków uwagi płatnego ruchu).
- Persystencja postępu quizu w `localStorage` (refresh/powrót nie kasuje odpowiedzi).
- Rozdział eventów: `audit_scroll_to_quiz` (hero/sticky) vs `audit_start` (1. odpowiedź).
- Social proof (case 20h/tydz) na czerwonym progu wyniku.
- WhatsApp prefill z wynikiem i branżą (atrybucja hot leadów).
- Sticky CTA na mobile poniżej quizu.

### Poprawki z testów UX quizu (feedback od Zuzi + decyzje Kuby)
- Opcja „Nie wiem / nie mierzymy tego" (1 pkt) we wszystkich 12 pytaniach; przy 4+ takich → 1. rekomendacja = pomiar procesów.
- q6: opcja „Nie wysyłamy follow-upów" (2 pkt).
- q9: doprecyzowane przykładami (status zamówienia, oferta, reklamacja).
- Ekran wyniku: **„Potencjał automatyzacji"** + podpis skali zamiast „Twój wynik" (x/36 było czytane jak ocena z testu — odwracało sens: niski wynik = dobrze).
- „2h roboczych" → „2 godzin (w dni robocze 9-17)".
- „Bez maila do startu" → „bez podawania e-maila" / „Zrób test i zobacz wynik natychmiast".

Źródło prawdy pytań quizu: `src/data/audytQuestions.js`. Progi scoringu oznaczone TUNABLE — **skalibrować po 20-30 realnych wynikach** (event `audit_complete` niesie score). KB do zaktualizowania u Kuby: `workshift-czerwiec-mikro-audyt-pytania.md` (locked v1) — rozjechała się z produkcją po zmianach opcji.

## Kreacje (scratchpad — NIE w repo, poza public/social/)

- Reklamy: K1 typography, K2 split (zdjęcie Kuby), K4 „20h+", Story A, Story B. Brand sage `#E6E8DD` + lime `#9CE069` + Inter.
- Liczba w kreacjach: **20h+** (nie 27h — brak źródła w case Informax; do weryfikacji).
- Copy reklam: Zestaw A (Rational, z „zrobi za nich"), B (case study), C (curiosity), D (e-commerce). W `META_ADS_CREATIVE.md` / draft kampanii.
- Posty blog: 7 feed (1080×1080) + 7 stories (1080×1920) w `public/social/`, copy FB+IG w scratchpadzie (COPY-posty-social.md).
- Pominięte wpisy (eventy): `value-builders-talks-pm-w-erze-ai`, `brave-ai-community-meetup-poznan`.

## Do zrobienia po stronie Kuby (poza kodem)

- Ads Manager: wgrać kreacje do ad setów, ustawić budżety (22 PLN/d prospecting, 10 PLN/d retargeting), włączyć fazę 1. Rozważyć optymalizację LP views w fazie 1 (mały budżet), przełączyć na custom conversion po ~50 startach/tydz.
- Podpiąć konto IG w Business Settings (reklamy z tożsamości IG).
- Reels: nagrać 1 body + 3 hooki (A/B/C), dodać do ad setów.
- Rotacja tokenów Meta.
