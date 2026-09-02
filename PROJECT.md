---
slug: workshift-landing
name: Workshift Landing (workshift.pl)
type: personal
status: active
started: 2026-03-09
last_worked: 2026-09-03
client: personal
---

# Workshift Landing

## What Is This

Strona workshift.pl: landing + blog + baza promptów + strony ofert dla klientów.
Vite 7 + React 19 + Tailwind 4, Vercel Functions (Resend, newsletter DOI, oferty, Meta CAPI).
Repo jest **publiczne** (`KubaBed/workshift-landing`), więc materiały klientów, plany kampanii
i oferty żyją w katalogach gitignorowanych (`docs/internal/`, `offers/`, `assets/print/`) albo
poza repo (vault, `~/Projekty/workshift-marketing/`). Mapa katalogów: `CLAUDE.md`.

## Current Status

- Sprint 1 SEO (`/uslugi/automatyzacja` pod „automatyzacja ai") na produkcji od 31.08; odczyt GSC ~28.09.
- Statyczny fallback SEO w `#root` ukryty dla przeglądarek z JS (`baf1ca3`, 02.09).
- Porządki repo 2026-09-03: root z 62 do ~25 wpisów, `.gitignore` na wzorcach katalogowych,
  Replit/sandbox/screeny skasowane, kreacje wyprowadzone do `workshift-marketing`.
- Oferty: renderer web + PDF (`lead-magnets/build-offer-pdf.mjs`) z etykietami per klient i sekcją potrzeb,
  na produkcji (`7cac906`, 03.09). MG Projekt v2.2 czeka na wysyłkę.

## Next Action

Sprint 2 SEO: wpis definicyjny na `/blog` pod „automatyzacja procesów biznesowych"
wg `docs/seo/PLAN-SEO-WDROZENIE.md`.

## Links & Resources

- Live: https://www.workshift.pl
- Repo: https://github.com/KubaBed/workshift-landing
- Vault: `~/Projekty/baza-wiedzy/wiki/projects/workshift-landing.md`, cel: `wiki/projects/workshift-goal-2026.md`
- Marketing (kreacje): `~/Projekty/workshift-marketing/`
- Vercel: projekt `workshift-landing` (deploy z `main`)

## History

- 2026-03-09: start (Replit), potem migracja na Vite + Vercel.
- 2026-04-24: mail przez Resend (koniec Brevo/PHP).
- 2026-07-28: konsolidacja marki, BRAND.md v2.0 jedynym brand bookiem.
- 2026-08-30: SEO per trasa (head + fallback body), sitemap; 31.08 Sprint 1 na produkcji.
- 2026-09-03: porządki repo (tag `pre-cleanup-2026-09-03`), nowa struktura `docs/ assets/ offers/`.
