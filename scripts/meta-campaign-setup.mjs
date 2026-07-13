#!/usr/bin/env node
/**
 * Konfiguracja Meta Ads pod kampanię "Mikro-audyt AI" (czerwiec 2026).
 *
 * Tworzy przez Marketing API (idempotentnie - pomija istniejące po nazwie):
 *  1. Custom conversion: pixel event `InitiateCheckout` z
 *     content_name=mikro-audyt-ai (start quizu) - do optymalizacji dostarczania.
 *  2. Custom audience (WEBSITE): "zaczął quiz, nie ukończył" -
 *     InitiateCheckout bez CompleteRegistration, okno 30 dni - do retargetingu.
 *  3. Kampanię "Mikro-audyt AI - czerwiec 2026" (PAUSED - zero wydatków
 *     do ręcznego włączenia) + ad set retargetingowy fazy 2 z audience z pkt 2,
 *     optymalizowany pod dokończenie audytu (CompleteRegistration).
 *     Kreacje/reklamy dodajesz w Ads Managerze po finalizacji statyków i reels.
 *  4. Ad set prospectingowy fazy 1 (PAUSED) z targetingiem persony "Marek"
 *     wg MARKETING_SALES_PLAN.md §9.3: PL, 30-55, zainteresowania biznes/AI/
 *     automatyzacja + stack e-commerce. ID zainteresowań wyszukiwane w API
 *     w momencie uruchomienia (są dynamiczne, nie da się ich zahardkodować).
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
const CAMPAIGN_NAME = 'Mikro-audyt AI - czerwiec 2026';
const RETARGETING_ADSET_NAME = 'Retargeting - zaczął, nie ukończył (faza 2)';
// 10 PLN/dzień w groszach (konto rozlicza się w PLN). Placeholder - budżet
// fazy 2 ustalisz w Ads Managerze przed włączeniem (ad set startuje PAUSED).
const RETARGETING_DAILY_BUDGET = 1000;

const PROSPECTING_ADSET_NAME = 'Prospecting - MŚP decydenci (faza 1)';
// ~22 PLN/dzień wg planu testu (300 PLN / 14 dni, faza 1).
const PROSPECTING_DAILY_BUDGET = 2200;
// Persona "Marek" (MARKETING_SALES_PLAN §9.3) + stack e-commerce (draft kreacji).
// Frazy do wyszukania w Meta Targeting Search - brakujące są pomijane z logiem.
const INTEREST_QUERIES = [
    // Polskie nazwy = trafniejsze pierwsze wyniki w Targeting Search (locale pl_PL).
    'Przedsiębiorczość', // biznes i finanse
    'Drobna przedsiębiorczość', // proxy MŚP
    'Business process automation',
    'Automatyzacja marketingu',
    'Sztuczna inteligencja', // usługi komputerowe
    'E-handel', // handel detaliczny (merchant-side)
    'Shopify',
    'WooCommerce',
];
const PROSPECTING_AGE = { min: 30, max: 55 };

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
        const detail = e.error_user_msg ? ` | ${e.error_user_title}: ${e.error_user_msg}` : '';
        throw new Error(`Graph API ${method} ${path} → ${e.message || res.status} (code ${e.code ?? '?'}, fbtrace ${e.fbtrace_id ?? '-'})${detail}`);
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
let audienceId;
if (aud) {
    audienceId = aud.id;
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
    audienceId = created.id;
    console.log(`Utworzono audience: ${created.id}`);
}

// ── 5. Kampania (PAUSED) + ad set retargetingowy fazy 2 ────────────────────
const existingCamp = await graph(`/${account}/campaigns?fields=id,name&limit=100`);
let campaignId = (existingCamp.data || []).find((c) => c.name === CAMPAIGN_NAME)?.id;
if (campaignId) {
    console.log(`Kampania już istnieje: ${campaignId} - pomijam.`);
} else {
    const created = await graph(`/${account}/campaigns`, {
        method: 'POST',
        body: {
            name: CAMPAIGN_NAME,
            objective: 'OUTCOME_SALES',
            status: 'PAUSED',
            special_ad_categories: [],
            // Budżety trzymamy na poziomie ad setów (faza 1 vs 2 rozdzielnie),
            // bez współdzielenia 20% między ad setami - czysty test budżetów.
            is_adset_budget_sharing_enabled: false,
        },
    });
    campaignId = created.id;
    console.log(`Utworzono kampanię (PAUSED): ${campaignId}`);
}

const existingSets = await graph(`/${campaignId}/adsets?fields=id,name&limit=100`);
const set = (existingSets.data || []).find((s) => s.name === RETARGETING_ADSET_NAME);
if (set) {
    console.log(`Ad set retargetingowy już istnieje: ${set.id} - pomijam.`);
} else {
    const created = await graph(`/${account}/adsets`, {
        method: 'POST',
        body: {
            name: RETARGETING_ADSET_NAME,
            campaign_id: campaignId,
            status: 'PAUSED',
            daily_budget: RETARGETING_DAILY_BUDGET,
            billing_event: 'IMPRESSIONS',
            bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
            optimization_goal: 'OFFSITE_CONVERSIONS',
            // Retargeting celuje w DOKOŃCZENIE audytu, nie kolejny start.
            promoted_object: { pixel_id: PIXEL_ID, custom_event_type: 'COMPLETE_REGISTRATION' },
            targeting: {
                geo_locations: { countries: ['PL'] },
                custom_audiences: [{ id: audienceId }],
            },
            // Wymóg DSA dla reklam kierowanych do UE.
            dsa_beneficiary: 'Workshift',
            dsa_payor: 'Workshift',
        },
    });
    console.log(`Utworzono ad set retargetingowy (PAUSED): ${created.id}`);
}

// ── 6. Ad set prospectingowy fazy 1 (PAUSED) ────────────────────────────────
const setsNow = await graph(`/${campaignId}/adsets?fields=id,name&limit=100`);
const prospecting = (setsNow.data || []).find((s) => s.name === PROSPECTING_ADSET_NAME);
if (prospecting) {
    console.log(`Ad set prospectingowy już istnieje: ${prospecting.id} - pomijam.`);
} else {
    // Wyszukaj ID zainteresowań (Targeting Search API). Bierzemy top wynik
    // o dokładnej nazwie, a gdy brak - pierwszy zwrócony; brakujące pomijamy.
    const interests = [];
    for (const q of INTEREST_QUERIES) {
        const res = await graph(`/search?type=adinterest&q=${encodeURIComponent(q)}&limit=5&locale=pl_PL`);
        const hits = res.data || [];
        const exact = hits.find((h) => h.name.toLowerCase() === q.toLowerCase());
        const pick = exact || hits[0];
        if (pick) {
            interests.push({ id: pick.id, name: pick.name });
            console.log(`  zainteresowanie: "${q}" → ${pick.name} (${pick.id}, zasięg ~${pick.audience_size_lower_bound ?? '?'})`);
        } else {
            console.log(`  zainteresowanie: "${q}" → brak w Meta, pomijam`);
        }
    }
    if (!interests.length) throw new Error('Nie znaleziono żadnych zainteresowań - sprawdź uprawnienia tokenu.');

    // Odfiltruj zdeprecjonowane ID (Meta odrzuca cały ad set, gdy trafi się choć jedno).
    const validation = await graph(`/search?type=adinterestvalid&interest_fbid_list=${encodeURIComponent(JSON.stringify(interests.map((i) => i.id)))}`);
    const validIds = new Set((validation.data || []).filter((v) => v.valid).map((v) => String(v.id)));
    const dropped = interests.filter((i) => !validIds.has(String(i.id)));
    for (const d of dropped) console.log(`  zainteresowanie zdeprecjonowane, pomijam: ${d.name} (${d.id})`);
    const activeInterests = interests.filter((i) => validIds.has(String(i.id)));
    if (!activeInterests.length) throw new Error('Wszystkie znalezione zainteresowania są nieaktywne.');

    const created = await graph(`/${account}/adsets`, {
        method: 'POST',
        body: {
            name: PROSPECTING_ADSET_NAME,
            campaign_id: campaignId,
            status: 'PAUSED',
            daily_budget: PROSPECTING_DAILY_BUDGET,
            billing_event: 'IMPRESSIONS',
            bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
            // Faza 1: za mało konwersji w pixelu na OFFSITE_CONVERSIONS -
            // optymalizujemy pod LP views, custom conversion służy jako metryka.
            // Po ~50 startach quizu/tydz przełącz na OFFSITE_CONVERSIONS.
            optimization_goal: 'LANDING_PAGE_VIEWS',
            targeting: {
                geo_locations: { countries: ['PL'] },
                age_min: PROSPECTING_AGE.min,
                age_max: PROSPECTING_AGE.max,
                flexible_spec: [{ interests: activeInterests.map(({ id, name }) => ({ id, name })) }],
                // Wyklucz tych, którzy już ukończyli quiz (audience z pkt 2 ich
                // zawiera tylko częściowo - completerzy odpadają sami przez exclusion
                // w regule; tu wykluczamy startujących, by prospecting był czysty).
                excluded_custom_audiences: [{ id: audienceId }],
                // Advantage audience OFF - test persony na małym budżecie ma być
                // czysty; rozszerzanie grupy przez Meta włączysz świadomie później.
                targeting_automation: { advantage_audience: 0 },
            },
            dsa_beneficiary: 'Workshift',
            dsa_payor: 'Workshift',
        },
    });
    console.log(`Utworzono ad set prospectingowy (PAUSED): ${created.id}`);
}

console.log('\nGotowe. Kampania i ad sety są ZAPAUZOWANE - nic nie wydaje pieniędzy.');
console.log('W Ads Managerze zostało: wgrać kreacje do obu ad setów, zweryfikować');
console.log('budżety (22 PLN/d prospecting, 10 PLN/d retargeting) i włączyć fazę 1.');
