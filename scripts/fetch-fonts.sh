#!/usr/bin/env bash
# Pobiera TTF-y potrzebne do generate_brand_pdf.py.
#
# Dlaczego osobno: repo trzyma fonty jako woff2 (public/fonts/) dla przegladarki,
# a reportlab czyta wylacznie TTF. Katalog scripts/fonts/ jest gitignorowany,
# zeby nie wrzucac ~2.5 MB binariow do repo.
#
# Uzycie:  bash scripts/fetch-fonts.sh
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/fonts"
INTER_URL="https://github.com/rsms/inter/releases/download/v3.19/Inter-3.19.zip"
PLEX_BASE="https://github.com/google/fonts/raw/main/ofl/ibmplexmono"

mkdir -p "$DIR"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "==> Inter 3.19 (rsms/inter)"
curl -sSL --fail -o "$TMP/inter.zip" "$INTER_URL"
for w in Regular Medium Bold Italic; do
  unzip -j -o "$TMP/inter.zip" "Inter Hinted for Windows/Desktop/Inter-$w.ttf" -d "$DIR" >/dev/null
  echo "    Inter-$w.ttf"
done

echo "==> IBM Plex Mono (google/fonts)"
for w in Regular Bold; do
  curl -sSL --fail -o "$DIR/IBMPlexMono-$w.ttf" "$PLEX_BASE/IBMPlexMono-$w.ttf"
  echo "    IBMPlexMono-$w.ttf"
done

echo
echo "Gotowe. Teraz: python3 scripts/generate_brand_pdf.py"
