#!/usr/bin/env node
/**
 * Reklamy kampanii "Mikro-audyt AI" - upload kreacji + ad creatives + ads (PAUSED).
 *
 * Idempotentny: obrazy deduplikowane hashem po stronie Meta, creatives i ads
 * pomijane po nazwie. Wszystkie reklamy powstają PAUSED - włączasz w Ads Managerze.
 *
 * Kreacje PNG bierze z katalogu podanego w AD_CREATIVES_DIR (default: ./ad-creatives).
 *
 * Wymagane env (.env.local): META_SYSTEM_USER_TOKEN, META_AD_ACCOUNT_ID
 * Uruchomienie: AD_CREATIVES_DIR=<dir> node --env-file=.env.local scripts/meta-campaign-ads.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const API = 'https://graph.facebook.com/v21.0';
const TOKEN = process.env.META_SYSTEM_USER_TOKEN;
const ACCOUNT = process.env.META_AD_ACCOUNT_ID?.startsWith('act_')
    ? process.env.META_AD_ACCOUNT_ID : `act_${process.env.META_AD_ACCOUNT_ID}`;
const DIR = process.env.AD_CREATIVES_DIR || './ad-creatives';

const PAGE_ID = '1117204771471948';
const PROSPECTING_ADSET = '120247366435870240';
const RETARGETING_ADSET = '120247366388610240';
const LANDING = 'https://workshift.pl/audyt-ai';
const UTM_BASE = 'utm_source=facebook&utm_medium=paid&utm_campaign=audyt-ai-2026-07';

// Definicje reklam: kreacja (plik PNG) × copy × ad set.
const ADS = [
    {
        name: 'K1 typografia × copy A (rational)', file: 'k1.png', adset: PROSPECTING_ADSET, utm: 'k1-rational',
        message: 'Twoi ludzie robią ręcznie to, co AI zrobi za nich. Kopiowanie danych między systemami, odpowiadanie na te same maile, ręczne raporty.\n\nMikro-audyt AI pokaże Ci, gdzie automatyzacja zwróci się najszybciej: 12 pytań, 3 minuty, wynik od razu - bez podawania e-maila.',
        headline: 'Ile godzin tygodniowo odzyska Twoja firma?',
        description: 'Mikro-audyt AI · 3 minuty · bez e-maila',
    },
    {
        name: 'K2 założyciel × copy C (curiosity)', file: 'k2.png', adset: PROSPECTING_ADSET, utm: 'k2-founder',
        message: 'Większość firm nie wie, ile czasu traci na powtarzalną robotę - dopóki tego nie policzy.\n\n12 pytań o Twoje procesy i wiesz: jaki masz potencjał automatyzacji i od którego procesu zacząć, żeby zwrot był najszybszy. 3 minuty, bez podawania e-maila, wynik natychmiast.',
        headline: 'Zrób mikro-audyt AI swojej firmy',
        description: 'Wynik od razu · zero zobowiązań',
    },
    {
        name: 'K4 case 20h+ × copy B (social proof)', file: 'k4.png', adset: PROSPECTING_ADSET, utm: 'k4-case',
        message: '15-osobowa kancelaria odzyskała ponad 20 godzin tygodniowo po automatyzacji obiegu dokumentów i notatek ze spotkań.\n\nTwoja firma ma podobne rezerwy. Mikro-audyt AI znajdzie je w 3 minuty - 12 pytań o procesy, wynik od razu, bez podawania e-maila.',
        headline: '20h+ tygodniowo z powrotem. Sprawdź swój potencjał.',
        description: 'Bezpłatny mikro-audyt · Workshift',
    },
    {
        name: 'RT dokończenie × K1', file: 'k1.png', adset: RETARGETING_ADSET, utm: 'rt-finish',
        message: 'Zacząłeś mikro-audyt AI i coś Cię wyrwało? Twoje odpowiedzi czekają - quiz zapamiętuje postęp w przeglądarce.\n\nDokończ ostatnie pytania i zobacz, jaki potencjał automatyzacji ma Twoja firma - i od czego zacząć.',
        headline: 'Dokończ swój mikro-audyt AI',
        description: '2 minuty do wyniku',
    },
];

if (!TOKEN || !process.env.META_AD_ACCOUNT_ID) {
    console.error('Brak META_SYSTEM_USER_TOKEN / META_AD_ACCOUNT_ID w env.');
    process.exit(1);
}

async function graph(pathname, { method = 'GET', body, form } = {}) {
    const opts = { method, headers: { Authorization: `Bearer ${TOKEN}` } };
    if (form) { opts.body = form; }
    else if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    const res = await fetch(`${API}${pathname}`, opts);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.error) {
        const e = json.error || {};
        const detail = e.error_user_msg ? ` | ${e.error_user_title}: ${e.error_user_msg}` : '';
        throw new Error(`Graph ${method} ${pathname} → ${e.message || res.status} (code ${e.code ?? '?'}, sub ${e.error_subcode ?? '-'})${detail}`);
    }
    return json;
}

// ── 1. Upload obrazów (Meta dedupe po zawartości - zwraca istniejący hash) ──
const hashes = {};
for (const file of [...new Set(ADS.map((a) => a.file))]) {
    const p = path.join(DIR, file);
    const form = new FormData();
    form.append(file, new Blob([fs.readFileSync(p)], { type: 'image/png' }), file);
    const res = await graph(`/${ACCOUNT}/adimages`, { method: 'POST', form });
    const img = res.images?.[file];
    hashes[file] = img.hash;
    console.log(`Obraz ${file} → hash ${img.hash}`);
}

// ── 2. Creatives + ads (idempotentnie po nazwie) ────────────────────────────
const { data: existingAds = [] } = await graph(`/${ACCOUNT}/ads?fields=id,name&limit=200`);
for (const ad of ADS) {
    if (existingAds.find((a) => a.name === ad.name)) {
        console.log(`Reklama już istnieje: "${ad.name}" - pomijam.`);
        continue;
    }
    const link = `${LANDING}?${UTM_BASE}&utm_content=${ad.utm}`;
    const creative = await graph(`/${ACCOUNT}/adcreatives`, {
        method: 'POST',
        body: {
            name: `Kreacja: ${ad.name}`,
            object_story_spec: {
                page_id: PAGE_ID,
                link_data: {
                    link,
                    message: ad.message,
                    name: ad.headline,
                    description: ad.description,
                    image_hash: hashes[ad.file],
                    call_to_action: { type: 'LEARN_MORE', value: { link } },
                },
            },
            // Wyłączamy auto-przeróbki kreacji przez Meta na starcie testu -
            // porównanie K1/K2/K4 ma być czyste. Włączysz po wyłonieniu winnera.
            degrees_of_freedom_spec: { creative_features_spec: { standard_enhancements: { enroll_status: 'OPT_OUT' } } },
        },
    });
    const created = await graph(`/${ACCOUNT}/ads`, {
        method: 'POST',
        body: { name: ad.name, adset_id: ad.adset, creative: { creative_id: creative.id }, status: 'PAUSED' },
    });
    console.log(`Reklama (PAUSED): "${ad.name}" → ${created.id}`);
}

console.log('\nGotowe. Wszystkie reklamy PAUSED - przegląd i włączenie w Ads Managerze.');
