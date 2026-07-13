#!/usr/bin/env node
/**
 * Konfiguracja Meta Ads pod kampanię "Mikro-audyt AI" (czerwiec 2026).
 *
 * Tworzy przez Marketing API (idempotentnie - pomija istniejące po nazwie):
 *  1. Custom conversion: pixel event `InitiateCheckout` z
 *     content_name=mikro-audyt-ai (start quizu) - do optymalizacji dostarczania.
 *  2. Custom audience (WEBSITE): "zaczął quiz, nie ukończył" -
 *     InitiateCheckout bez CompleteRegistration, okno 30 dni - do retargetingu.
 *
 * Wymagane env (w .env.local, NIE commitować):
 *  - META_SYSTEM_USER_TOKEN  token systemowego użytkownika (scope: ads_management)
 *  - META_AD_ACCOUNT_ID      opcjonalnie, np. act_123... - bez tego skrypt
 *                            wylistuje konta dostępne dla tokenu i poprosi o wybór.
 *
 * Uruchomienie:  node --env-file=.env.local scripts/meta-campaign-setup.mjs
 */

const API = 'https://graph.facebook.com/v21.0';
const PIXEL_ID = '1350172243839037'; // = META_PIXEL_ID w src/lib/consent.js
const CONVERSION_NAME = 'Mikro-audyt AI - start quizu (InitiateCheckout)';
const AUDIENCE_NAME = 'Mikro-audyt AI - zaczął, nie ukończył (30 dni)';
const RETENTION_SECONDS = 30 * 24 * 3600;

const TOKEN = process.env.META_SYSTEM_USER_TOKEN;
if (!TOKEN) {
    console.error('Brak META_SYSTEM_USER_TOKEN w env. Uruchom: node --env-file=.env.local scripts/meta-campaign-setup.mjs');
    process.exit(1);
}

async function graph(path, { method = 'GET', body } = {}) {
    const res = await fetch(`${API}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.error) {
        const e = json.error || {};
        throw new Error(`Graph API ${method} ${path} → ${e.message || res.status} (code ${e.code ?? '?'}, fbtrace ${e.fbtrace_id ?? '-'})`);
    }
    return json;
}

// ── 1. Sanity check tokenu ──────────────────────────────────────────────────
const me = await graph('/me?fields=id,name');
console.log(`Token OK - działa jako: ${me.name || 'system user'} (id ${me.id})`);

// ── 2. Konto reklamowe ──────────────────────────────────────────────────────
let account = process.env.META_AD_ACCOUNT_ID;
if (account && !account.startsWith('act_')) account = `act_${account}`;
if (!account) {
    const { data = [] } = await graph('/me/adaccounts?fields=id,name,account_status&limit=25');
    if (data.length === 1) {
        account = data[0].id;
        console.log(`Jedno konto dostępne, używam: ${data[0].name} (${account})`);
    } else {
        console.log('Token ma dostęp do wielu kont - ustaw META_AD_ACCOUNT_ID na jedno z:');
        for (const a of data) console.log(`  ${a.id}  ${a.name}  (status ${a.account_status})`);
        process.exit(data.length ? 2 : 1);
    }
}

// ── 3. Custom conversion (idempotentnie) ────────────────────────────────────
const existingConv = await graph(`/${account}/customconversions?fields=id,name&limit=100`);
const conv = (existingConv.data || []).find((c) => c.name === CONVERSION_NAME);
if (conv) {
    console.log(`Custom conversion już istnieje: ${conv.id} - pomijam.`);
} else {
    const created = await graph(`/${account}/customconversions`, {
        method: 'POST',
        body: {
            name: CONVERSION_NAME,
            event_source_id: PIXEL_ID,
            custom_event_type: 'INITIATED_CHECKOUT',
            rule: JSON.stringify({
                and: [
                    { event: { eq: 'InitiateCheckout' } },
                    { 'custom_data.content_name': { eq: 'mikro-audyt-ai' } },
                ],
            }),
        },
    });
    console.log(`Utworzono custom conversion: ${created.id}`);
}

// ── 4. Audience retargetingu (idempotentnie) ────────────────────────────────
const existingAud = await graph(`/${account}/customaudiences?fields=id,name&limit=100`);
const aud = (existingAud.data || []).find((a) => a.name === AUDIENCE_NAME);
if (aud) {
    console.log(`Audience już istnieje: ${aud.id} - pomijam.`);
} else {
    const eventRule = (event) => ({
        event_sources: [{ id: PIXEL_ID, type: 'pixel' }],
        retention_seconds: RETENTION_SECONDS,
        filter: { operator: 'and', filters: [{ field: 'event', operator: 'eq', value: event }] },
    });
    const created = await graph(`/${account}/customaudiences`, {
        method: 'POST',
        body: {
            name: AUDIENCE_NAME,
            description: 'Start quizu /audyt-ai bez dojścia do wyniku - retargeting fazy 2.',
            rule: JSON.stringify({
                inclusions: { operator: 'or', rules: [eventRule('InitiateCheckout')] },
                exclusions: { operator: 'or', rules: [eventRule('CompleteRegistration')] },
            }),
            prefill: true,
        },
    });
    console.log(`Utworzono audience: ${created.id}`);
}

console.log('\nGotowe. W Ads Managerze: ustaw kampanię na optymalizację pod tę custom conversion,');
console.log('a audience użyj w ad secie retargetingowym (faza 2 wg draftu kreacji).');
