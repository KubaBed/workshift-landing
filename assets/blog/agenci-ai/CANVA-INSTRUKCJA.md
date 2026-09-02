# Okładka „Agenci AI" — spec & instrukcja edycji

**Format:** `1280 × 720 px` (16:9, hero artykułu blogowego)
**Style:** Casino Royale homage — sage paper background, czarna sylwetka Bonda, lime krawat jako AI accent
**Brand:** Workshift (sage `#E6E8DD`, lime `#9CE069`, czerń `#0a0a0a`, fonty Inter + IBM Plex Mono)

---

## Pliki w folderze

| Plik | Status | Do czego |
|---|---|---|
| `cover-casino-royale.svg` | **finalny** | wektor źródłowy — edycja w Inkscape / Figma / Illustratorze |
| `inline-1-mission-briefing.svg` | finalny | grafika śródtekstowa #1 (Mission Brief — 4 wymagania agenta) |
| `inline-2-id-card.svg` | finalny | grafika śródtekstowa #2 (Identification File — Agent vs Imposter) |
| `cover-2000x600.svg` / `.pdf` / `@3x.png` | **archiwum** (Spectre wariant 2000×600 — można usunąć) |
| `cover-no-figure.svg` / `.pdf` / `@3x.png` | **archiwum** (do usunięcia, niespójne z finalem) |

---

## Eksport do Canvy / blogu

Z `cover-casino-royale.svg` wygeneruj formaty potrzebne na publikację:

```bash
INK="/Applications/Inkscape.app/Contents/MacOS/inkscape"
"$INK" cover-casino-royale.svg --export-type=pdf --export-filename=cover-casino-royale.pdf
"$INK" cover-casino-royale.svg --export-type=png --export-width=2560 --export-filename=cover-casino-royale@2x.png
```

PNG @2× = 2560×1440 (wystarczy dla retina); PDF zachowuje wektor dla edycji w Canvie/Figmie.

---

## Spec typografii (do rebuildu w Canvie / dla designera)

Canvas: 1280 × 720, anchor (0,0) lewy górny róg.

### Górny tag „DOSSIER"
- Pozycja kontenera: `x=485, y=240`
- **Plakietka**: `148 × 22 px`, fill `#9CE069`
- **Tekst „// DOSSIER #001"**: IBM Plex Mono Bold (700), 11px, fill `#0a0a0a`, letter-spacing 2, padding-left 9px, baseline y=15px (od top plakietki)
- **Tekst „CLASSIFIED — FOR OPERATORS ONLY"**: IBM Plex Mono Medium (500), 11px, fill `#0a0a0a` opacity 0.65, letter-spacing 2, x=160px od początku kontenera

### Headline (tytuł)
- Pozycja kontenera: `x=485, y=290`
- Font: **Inter Black (900)**, 84px, letter-spacing -2, fill `#0a0a0a`
- Linia 1: „O CO CHODZI" — baseline y=68
- Linia 2: „Z TYMI AGENTAMI?" — baseline y=148 (line-height 80px)

### Lead / hook
- Pozycja kontenera: `x=485, y=490`
- **Krótka kreska**: `50 × 2.5 px`, fill `#0a0a0a`, x=0..50
- **Tekst**: „Bond. Briefing. Cztery zasady prawdziwego agenta AI." — Inter Medium (500), 16px, fill `#0a0a0a` opacity 0.8, x=62, baseline y=5px

### Branding (prawy dolny róg)
- Pozycja kontenera: `x=1200, y=672` (text-anchor: end)
- **Lime kropka**: circle, cx=-128, cy=-4, r=3, fill `#9CE069`
- **Tekst „WORKSHIFT.PL"**: IBM Plex Mono Bold (700), 12px, fill `#0a0a0a`, letter-spacing 3

### Codename (lewy dolny róg)
- Pozycja kontenera: `x=80, y=672`
- **Tekst „CODENAME: WS-007"**: IBM Plex Mono Medium (500), 10px, fill `#0a0a0a` opacity 0.55, letter-spacing 3

### Sylwetka
- Pozycja kontenera: `x=280, y=228` (center x=280, top of head ~y=228)
- Wszystkie elementy (głowa, ciało, koszula, krawat, buty) jako jednolite ścieżki bez gradientów
- Czerń: `#0a0a0a`
- Koszula: `#F5F7EE` (jaśniejsza niż sage tło o 1 stop)
- Krawat: `#9CE069` (lime — jedyny kolor accent na figurze)
- Subtelny cień podłogi: ellipse cx=280, cy=712, rx=100, ry=8, fill `#0a0a0a` opacity 0.18

---

## Paleta kolorów (HEX — do Canva Brand Kit)

| Nazwa | HEX | Zastosowanie |
|---|---|---|
| Sage Paper | `#E6E8DD` | tło (jasna część gradientu) |
| Sage Edge | `#DCDFD2` / `#C8CDBE` | gradient vignette (ciemniejsze rogi) |
| Workshift Lime | `#9CE069` | krawat, DOSSIER plakietka, kropka przy WORKSHIFT.PL |
| Lime Shadow | `#7DBD52` | subtelna kreska na krawacie (opacity 0.5) |
| Noir Black | `#0a0a0a` | sylwetka, cały headline, tekst, linie |
| Shirt Off-White | `#F5F7EE` | trójkąt koszuli + kołnierzyk |

---

## Fonty (wszystkie dostępne w Canvie za darmo)

- **Inter** — Black 900 (headline 84px), Medium 500 (lead 16px) → wyszukaj „Inter" w Canva Fonts
- **IBM Plex Mono** — Bold 700 (DOSSIER tag, branding), Medium 500 (CLASSIFIED, codename) → wyszukaj „IBM Plex Mono"

---

## Cleanup folderu (rekomendowany)

Po finalizacji można usunąć stare warianty:

```bash
rm cover-2000x600.svg cover-2000x600.pdf cover-2000x600@3x.png
rm cover-no-figure.svg cover-no-figure.pdf cover-no-figure@3x.png
```

Zostaje czysty zestaw: 1× okładka 1280×720 + 2× grafiki śródtekstowe.
