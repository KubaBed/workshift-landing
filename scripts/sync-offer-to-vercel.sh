#!/usr/bin/env bash
# Sync zawartości oferty klienta do Vercel jako env var OFFER_DATA_<SLUG>.
#
# Wymagania (jednorazowe, po instalacji):
#   npm install -g vercel
#   vercel login
#   cd ~/Projekty/workshift-landing && vercel link
#
# Użycie:
#   scripts/sync-offer-to-vercel.sh informax
#   # Albo przez npm:
#   npm run offer:sync:informax
#
# Co robi:
#   1. Generuje base64 ze źródłowego `api/_data/offers/<slug>.js`
#   2. Usuwa starą wartość OFFER_DATA_<SLUG> z 3 środowisk (production/preview/development)
#   3. Wstawia świeżą wartość do tych 3 środowisk
#   4. (Opcjonalnie) Triggeruje redeploy production
#
# Skrypt jest idempotent — możesz uruchamiać wielokrotnie.

set -euo pipefail

SLUG="${1:-}"
if [[ -z "$SLUG" ]]; then
    echo "Usage: $0 <slug>" >&2
    echo "Example: $0 informax" >&2
    exit 1
fi

# Walidacja slug: tylko alfanumeryczne + myślniki/podkreślniki
if ! [[ "$SLUG" =~ ^[a-z0-9_-]+$ ]]; then
    echo "Error: slug musi pasować do ^[a-z0-9_-]+$ (lowercase, no spaces, ASCII)" >&2
    exit 1
fi

SLUG_UPPER=$(echo "$SLUG" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
ENV_VAR_NAME="OFFER_DATA_${SLUG_UPPER}"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Sprawdź wymagania
if ! command -v vercel &>/dev/null; then
    echo "Error: vercel CLI nie zainstalowane." >&2
    echo "Zainstaluj: npm install -g vercel" >&2
    exit 2
fi

# Vercel CLI v37+ używa .vercel/repo.json zamiast starego .vercel/project.json.
# Akceptujemy oba formaty.
if [[ ! -f ".vercel/project.json" && ! -f ".vercel/repo.json" ]]; then
    echo "Error: projekt nie jest połączony z Vercel." >&2
    echo "Uruchom raz: vercel link" >&2
    exit 3
fi

if [[ ! -f "api/_data/offers/${SLUG}.js" ]]; then
    echo "Error: brak pliku api/_data/offers/${SLUG}.js" >&2
    echo "Skopiuj template: cp api/_data/offers/_template.example.js api/_data/offers/${SLUG}.js" >&2
    exit 4
fi

# 1. Generuj base64
echo "▶ Generowanie base64 z api/_data/offers/${SLUG}.js..."
TMP_FILE=$(mktemp -t "offer-${SLUG}.XXXXXX")
trap "rm -f $TMP_FILE" EXIT

node lead-magnets/encode-offer-for-vercel.mjs "$SLUG" 2>/dev/null | tail -1 > "$TMP_FILE"
BYTES=$(wc -c < "$TMP_FILE" | tr -d ' ')
echo "  Base64: ${BYTES} bajtów (~$(($BYTES / 1024)) KB)"

if [[ "$BYTES" -lt 100 ]]; then
    echo "Error: base64 wygląda na pusty/uszkodzony (${BYTES} bajtów)" >&2
    exit 5
fi

if [[ "$BYTES" -gt 65000 ]]; then
    echo "Warning: ${BYTES} bajtów przekracza Vercel env var limit 64 KB" >&2
    echo "Rozważ migrację do Vercel Edge Config / Blob storage." >&2
fi

# 2 + 3. Dla każdego środowiska: usuń starą + wstaw nową
for ENV in production preview development; do
    echo ""
    echo "▶ ${ENV_VAR_NAME} → ${ENV}..."

    # Usuń starą (ignoruj błąd jeśli nie istnieje)
    if vercel env rm "$ENV_VAR_NAME" "$ENV" --yes 2>/dev/null; then
        echo "  ✓ Usunięto starą wartość"
    else
        echo "  ℹ Brak starej wartości (OK przy pierwszym uruchomieniu)"
    fi

    # Wstaw nową
    if vercel env add "$ENV_VAR_NAME" "$ENV" < "$TMP_FILE" >/dev/null 2>&1; then
        echo "  ✓ Zapisano nową wartość"
    else
        echo "  ✗ Błąd przy dodawaniu env var" >&2
        echo "    Sprawdź ręcznie: vercel env ls" >&2
        exit 6
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✓ Sync zakończony. OFFER_DATA_${SLUG_UPPER} zaktualizowany w 3 środowiskach."
echo ""
echo "Następny krok — wymuś redeploy production żeby nowa wartość poszła live:"
echo "  vercel --prod"
echo "  # lub: git commit --allow-empty -m 'chore: redeploy after env update' && git push"
echo ""
echo "Verify (sprawdź jako prywatny klient):"
echo "  open https://workshift.pl/oferta/${SLUG}"
echo "═══════════════════════════════════════════════════════════════"
