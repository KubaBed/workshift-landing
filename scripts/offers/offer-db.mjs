#!/usr/bin/env node
// Oferty w Supabase (schemat offers, bucket offer-pdfs) z linii komend.
// Klucz: SUPABASE_URL + SUPABASE_SECRET_KEY z env albo z .env.local (nigdy z repo).
//
//   npm run offer:db -- push <slug> [--activate|--draft] [--expires 2026-11-30|+30d] [--deal <cuid>]
//                              [--pdf <plik.pdf>|--no-pdf] [--title "..."] [--test]
//       Wgrywa treść z api/_data/offers/<slug>.js i PDF (domyślnie najnowszy offers/out/<slug>-*.pdf).
//   npm run offer:db -- secret <slug> [--password <hasło>|--random-password] [--link] [--rotate]
//                                [--save-local] [--base https://www.workshift.pl]
//       Hasło i token hashowane lokalnie; jawna wartość pojawia się tylko raz na stdout.
//       --rotate podbija access_epoch (wszystkie wydane cookie tracą ważność).
//       --save-local dopisuje hasło do .env.local jako OFFER_PASSWORD_<SLUG> (do testów curl).
//   npm run offer:db -- status <slug>
//       Stan oferty i log otwarć.

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { hashPassword, hashToken, newToken } from '../../api/_lib/offers/secrets.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ENV_LOCAL = path.join(ROOT, '.env.local');
const BUCKET = 'offer-pdfs';

function die(msg) {
    console.error(`offer-db: ${msg}`);
    process.exit(1);
}

function parseArgs(argv) {
    const [cmd, slug, ...rest] = argv;
    const flags = {};
    for (let i = 0; i < rest.length; i++) {
        const key = rest[i].replace(/^--/, '');
        const next = rest[i + 1];
        if (next !== undefined && !next.startsWith('--')) {
            flags[key] = next;
            i++;
        } else {
            flags[key] = true;
        }
    }
    return { cmd, slug, flags };
}

async function loadEnvLocal() {
    try {
        const raw = await fs.readFile(ENV_LOCAL, 'utf-8');
        for (const line of raw.split('\n')) {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
    } catch { /* .env.local opcjonalny */ }
}

function db() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) die('brak SUPABASE_URL / SUPABASE_SECRET_KEY (env albo .env.local)');
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        db: { schema: 'offers' },
    });
}

function must({ data, error }, what) {
    if (error) die(`${what}: ${error.message}`);
    return data;
}

function parseExpires(value) {
    if (!value || value === true) return undefined;
    const rel = String(value).match(/^\+(\d+)d$/);
    if (rel) return new Date(Date.now() + Number(rel[1]) * 86400 * 1000).toISOString();
    // Sama data = koniec dnia (23:59:59 UTC+1); godzina różnicy latem nie ma znaczenia dla klienta.
    const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T23:59:59+01:00`) : new Date(value);
    if (Number.isNaN(d.getTime())) die(`zła data --expires: ${value}`);
    return d.toISOString();
}

async function newestPdf(slug) {
    const dir = path.join(ROOT, 'offers', 'out');
    let files;
    try {
        files = await fs.readdir(dir);
    } catch {
        return null;
    }
    const candidates = files.filter((f) => f.startsWith(`${slug}-`) && f.endsWith('.pdf'));
    if (candidates.length === 0) return null;
    const stats = await Promise.all(candidates.map(async (f) => ({ f, t: (await fs.stat(path.join(dir, f))).mtimeMs })));
    stats.sort((a, b) => b.t - a.t);
    return path.join(dir, stats[0].f);
}

async function push(slug, flags) {
    const file = path.join(ROOT, 'api', '_data', 'offers', `${slug}.js`);
    let content;
    try {
        const mod = await import(pathToFileURL(file).href);
        content = mod.default || mod[slug];
    } catch (err) {
        die(`nie mogę wczytać ${path.relative(ROOT, file)}: ${err.message}`);
    }
    if (!content || typeof content !== 'object') die('plik oferty nie eksportuje obiektu');
    content = JSON.parse(JSON.stringify({ ...content, slug }));

    const client = db();
    const existing = must(await client.from('offer').select('id, status').eq('slug', slug).maybeSingle(), 'odczyt');
    const row = {
        slug,
        title: flags.title || content.client?.name || slug,
        content,
    };
    if (flags.activate) row.status = 'active';
    if (flags.draft) row.status = 'draft';
    if (flags.test) row.is_test = true;
    if (flags.deal) row.deal_id = flags.deal;
    const expires = parseExpires(flags.expires);
    if (expires) row.expires_at = expires;

    const saved = must(
        await client.from('offer').upsert(row, { onConflict: 'slug' }).select('id, status, expires_at').single(),
        'zapis oferty',
    );

    if (!flags['no-pdf']) {
        const pdf = flags.pdf ? path.resolve(flags.pdf) : await newestPdf(slug);
        if (pdf) {
            const objectPath = `${saved.id}/${path.basename(pdf)}`;
            const bytes = await fs.readFile(pdf);
            must(
                await client.storage.from(BUCKET).upload(objectPath, bytes, { contentType: 'application/pdf', upsert: true }),
                'upload PDF',
            );
            must(await client.from('offer').update({ pdf_path: objectPath }).eq('id', saved.id), 'zapis pdf_path');
            console.log(`PDF: ${path.relative(ROOT, pdf)} -> ${BUCKET}/${objectPath} (${Math.round(bytes.length / 1024)} KB)`);
        } else {
            console.log('PDF: brak (wygeneruj: npm run offer:pdf -- ' + slug + ')');
        }
    }

    console.log(`${existing ? 'Zaktualizowano' : 'Utworzono'} ofertę ${slug}: status ${saved.status}, wygasa ${saved.expires_at || 'nigdy'}`);
    if (saved.status !== 'active') console.log('Szkic: strona pokazuje starą wersję z env albo 404. Publikacja: --activate');
}

function randomPassword() {
    // 12 znaków bez mylących liter (0/O, 1/l), czytelne do przepisania z maila.
    const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
    return Array.from(crypto.randomBytes(12), (b) => alphabet[b % alphabet.length]).join('');
}

async function upsertEnvLocal(name, value) {
    let raw = '';
    try { raw = await fs.readFile(ENV_LOCAL, 'utf-8'); } catch { /* nowy plik */ }
    const line = `${name}=${value}`;
    const re = new RegExp(`^${name}=.*$`, 'm');
    raw = re.test(raw) ? raw.replace(re, line) : `${raw.replace(/\n?$/, '\n')}${line}\n`;
    await fs.writeFile(ENV_LOCAL, raw, 'utf-8');
}

async function secret(slug, flags) {
    const client = db();
    const offer = must(await client.from('offer').select('id, access_epoch').eq('slug', slug).maybeSingle(), 'odczyt');
    if (!offer) die(`brak oferty ${slug} w bazie (najpierw push)`);

    const update = {};
    let password = null;
    let token = null;
    if (flags.password || flags['random-password']) {
        password = flags.password && flags.password !== true ? String(flags.password) : randomPassword();
        update.password_hash = await hashPassword(password);
    }
    if (flags.link) {
        token = newToken();
        update.token_hash = hashToken(token);
    }
    if (flags.rotate) update.access_epoch = offer.access_epoch + 1;
    if (Object.keys(update).length === 0) die('podaj --password, --random-password, --link albo --rotate');

    must(await client.from('offer').update(update).eq('id', offer.id), 'zapis');

    const base = (flags.base && flags.base !== true ? flags.base : 'https://www.workshift.pl').replace(/\/$/, '');
    if (password) {
        console.log(`Hasło: ${password}`);
        if (flags['save-local']) {
            const name = `OFFER_PASSWORD_${slug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`;
            await upsertEnvLocal(name, password);
            console.log(`Zapisane w .env.local jako ${name}`);
        }
    }
    if (token) console.log(`Link: ${base}/oferta/${slug}?k=${token}`);
    if (flags.rotate) console.log(`access_epoch: ${update.access_epoch} (stare cookie nieważne)`);
    console.log('Hasło i link pokazuję tylko raz; w bazie są wyłącznie skróty.');
}

async function status(slug) {
    const client = db();
    const offer = must(
        await client.from('offer')
            .select('id, title, status, deal_id, expires_at, pdf_path, access_epoch, is_test, password_hash, token_hash, updated_at')
            .eq('slug', slug).maybeSingle(),
        'odczyt',
    );
    if (!offer) die(`brak oferty ${slug} w bazie`);
    const events = must(
        await client.from('offer_event').select('kind, occurred_at, country').eq('offer_id', offer.id)
            .order('occurred_at', { ascending: false }).limit(500),
        'log',
    );
    const counts = events.reduce((acc, e) => ({ ...acc, [e.kind]: (acc[e.kind] || 0) + 1 }), {});
    console.log(`${slug} (${offer.title}) status=${offer.status}${offer.is_test ? ' [test]' : ''}`);
    console.log(`  deal: ${offer.deal_id || '-'}  wygasa: ${offer.expires_at || 'nigdy'}  PDF: ${offer.pdf_path ? 'tak' : 'nie'}`);
    console.log(`  hasło: ${offer.password_hash ? 'tak' : 'nie'}  link: ${offer.token_hash ? 'tak' : 'nie'}  epoka: ${offer.access_epoch}`);
    console.log(`  zdarzenia: ${JSON.stringify(counts)}`);
    for (const e of events.slice(0, 10)) console.log(`    ${e.occurred_at}  ${e.kind}  ${e.country || ''}`);
}

const { cmd, slug, flags } = parseArgs(process.argv.slice(2));
if (!cmd || !slug) die('użycie: push|secret|status <slug> [flagi], opis w nagłówku pliku');
if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(slug)) die(`zły slug: ${slug}`);
await loadEnvLocal();
if (cmd === 'push') await push(slug, flags);
else if (cmd === 'secret') await secret(slug, flags);
else if (cmd === 'status') await status(slug);
else die(`nieznana komenda: ${cmd}`);
