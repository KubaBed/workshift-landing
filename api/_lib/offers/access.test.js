// npm run test:api
// Testy przez interfejs createOfferAccess z adapterami w pamięci (bez sieci i bez Supabase).

import test from 'node:test';
import assert from 'node:assert/strict';
import { createOfferAccess } from './access.js';
import { hashPassword, hashToken } from './secrets.js';

const SECRET = 'test-secret-0123456789';
const T0 = Date.parse('2026-10-15T12:00:00Z');
const DAY = 86400 * 1000;

function memoryDb(rows) {
    const events = [];
    const failures = [];
    return {
        events,
        failures,
        broken: false,
        async findBySlug(slug) {
            if (this.broken) throw new Error('connection refused');
            return rows.find((r) => r.slug === slug) || null;
        },
        async authGate(slug, ipHash) {
            const perIp = failures.filter((f) => f.slug === slug && f.ipHash === ipHash).length;
            return perIp >= 8 ? 'locked' : 'ok';
        },
        async recordFailure(slug, ipHash) { failures.push({ slug, ipHash }); },
        async recordEvent(offerId, kind, visitor) { events.push({ offerId, kind, visitor }); },
        async viewStats(offerId) {
            const views = events.filter((e) => e.offerId === offerId && e.kind === 'view');
            return { count: views.length, first: null, last: null };
        },
        async signPdf(path, filename, expiresIn) { return `https://storage.test/${path}?download=${filename}&exp=${expiresIn}`; },
    };
}

function memoryLegacy(offers) {
    return {
        async find(slug) { return offers[slug] || null; },
        async recordView() { return { count: 0, first: null, last: null }; },
    };
}

async function setup({ rowOverrides = {}, legacy = {} } = {}) {
    const row = {
        id: 'offer-1',
        slug: 'test-supabase',
        status: 'active',
        content: { client: { name: 'Piekarnia Testowa' }, meta: { title: 'Test' }, contact: { phone: '+48 555 111 222' } },
        password_hash: await hashPassword('chleb-2026'),
        token_hash: hashToken('tok-abc'),
        access_epoch: 0,
        expires_at: new Date(T0 + 30 * DAY).toISOString(),
        pdf_path: 'offer-1/test.pdf',
        deal_id: 'deal-secret',
        ...rowOverrides,
    };
    const db = memoryDb([row]);
    const clock = { now: T0 };
    const access = createOfferAccess({
        db,
        legacy: memoryLegacy(legacy),
        secret: SECRET,
        now: () => clock.now,
        sleep: async () => {},
        log: () => {},
    });
    return { access, db, row, clock };
}

const cookieHeader = (slug, value) => `${'offer_token_' + slug}=${value}`;
const visitor = { ip: '203.0.113.7', country: 'PL', userAgent: 'curl/8' };

test('hasło: dobre daje cookie, złe daje invalid i zapisuje porażkę', async () => {
    const { access, db } = await setup();
    const bad = await access.unlock({ slug: 'test-supabase', password: 'zle', visitor });
    assert.deepEqual(bad, { error: 'invalid' });
    assert.equal(db.failures.length, 1);
    assert.notEqual(db.failures[0].ipHash, visitor.ip, 'IP zapisane tylko jako skrót');

    const good = await access.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor });
    assert.equal(good.ok, true);
    assert.equal(db.events.at(-1).kind, 'unlock_password');
});

test('token z linku otwiera ofertę, zły token nie', async () => {
    const { access, db } = await setup();
    assert.equal((await access.unlock({ slug: 'test-supabase', token: 'tok-abc', visitor })).ok, true);
    assert.equal(db.events.at(-1).kind, 'unlock_token');
    assert.deepEqual(await access.unlock({ slug: 'test-supabase', token: 'tok-xyz', visitor }), { error: 'invalid' });
});

test('rate limit: po 8 złych hasłach locked, także dla dobrego hasła', async () => {
    const { access } = await setup();
    for (let i = 0; i < 8; i++) await access.unlock({ slug: 'test-supabase', password: `zle${i}`, visitor });
    assert.deepEqual(await access.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor }), { error: 'locked' });
    // Token z linku nie podlega blokadzie hasła.
    assert.equal((await access.unlock({ slug: 'test-supabase', token: 'tok-abc', visitor })).ok, true);
});

test('read: treść bez pól wewnętrznych, z hasPdf i expiresAt', async () => {
    const { access } = await setup();
    const { cookie } = await access.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor });
    const { offer } = await access.read({ slug: 'test-supabase', cookieHeader: cookieHeader('test-supabase', cookie.value) });
    assert.equal(offer.client.name, 'Piekarnia Testowa');
    assert.equal(offer.hasPdf, true);
    const json = JSON.stringify(offer);
    for (const leak of ['password_hash', 'token_hash', 'deal-secret', 'offer-1/test.pdf', 'scrypt$', '555 111']) {
        assert.ok(!json.includes(leak), `odpowiedź nie może zawierać ${leak}`);
    }
});

test('cookie innej oferty nie otwiera tej oferty', async () => {
    const { access } = await setup({ legacy: { '4mat': { content: { client: { name: '4MAT' } }, password: 'x' } } });
    const { cookie } = await access.unlock({ slug: 'test-supabase', token: 'tok-abc', visitor });
    const res = await access.read({ slug: '4mat', cookieHeader: cookieHeader('4mat', cookie.value) });
    assert.deepEqual(res, { error: 'unauthorized' });
});

test('wygasanie: cookie krótsze niż do końca ważności, potem 410', async () => {
    const { access, clock } = await setup({ rowOverrides: { expires_at: new Date(T0 + 2 * 3600 * 1000).toISOString() } });
    const { cookie } = await access.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor });
    assert.equal(cookie.maxAge, 7200);
    clock.now = T0 + 3 * 3600 * 1000;
    // verifyToken sprawdza exp według zegara systemowego, więc tu weryfikujemy 410 w unlock.
    assert.deepEqual(await access.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor }), { error: 'expired' });
});

test('podbicie access_epoch unieważnia wydane cookie', async () => {
    const { access, row } = await setup();
    const { cookie } = await access.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor });
    row.access_epoch = 1;
    const res = await access.read({ slug: 'test-supabase', cookieHeader: cookieHeader('test-supabase', cookie.value) });
    assert.deepEqual(res, { error: 'unauthorized' });
});

test('szkic w bazie: oferta niewidoczna, a stara wersja z env działa dalej', async () => {
    const { access } = await setup({
        rowOverrides: { status: 'draft' },
        legacy: { 'test-supabase': { content: { client: { name: 'Z env' } }, password: 'stare-haslo' } },
    });
    assert.deepEqual(await access.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor }), { error: 'invalid' });
    const { cookie } = await access.unlock({ slug: 'test-supabase', password: 'stare-haslo', visitor });
    const { offer } = await access.read({ slug: 'test-supabase', cookieHeader: cookieHeader('test-supabase', cookie.value) });
    assert.equal(offer.client.name, 'Z env');
});

test('oferta wycofana: brak dostępu, bez powrotu do env', async () => {
    const { access } = await setup({
        rowOverrides: { status: 'revoked' },
        legacy: { 'test-supabase': { content: {}, password: 'stare-haslo' } },
    });
    assert.deepEqual(await access.unlock({ slug: 'test-supabase', password: 'stare-haslo', visitor }), { error: 'invalid' });
});

test('awaria Supabase: oferty z env działają', async () => {
    const { access, db } = await setup({ legacy: { pet: { content: { client: { name: 'PET' } }, password: 'pet-haslo' } } });
    db.broken = true;
    const { cookie } = await access.unlock({ slug: 'pet', password: 'pet-haslo', visitor });
    const { offer } = await access.read({ slug: 'pet', cookieHeader: cookieHeader('pet', cookie.value) });
    assert.equal(offer.client.name, 'PET');
    assert.equal(offer.hasPdf, undefined);
});

test('cookie z env bez ep działa po przeniesieniu oferty do bazy (epoka 0)', async () => {
    const legacyOnly = createOfferAccess({
        db: null,
        legacy: memoryLegacy({ 'test-supabase': { content: {}, password: 'chleb-2026' } }),
        secret: SECRET,
        sleep: async () => {},
    });
    const { cookie } = await legacyOnly.unlock({ slug: 'test-supabase', password: 'chleb-2026', visitor });
    const { access } = await setup();
    const res = await access.read({ slug: 'test-supabase', cookieHeader: cookieHeader('test-supabase', cookie.value) });
    assert.ok(res.offer, 'stare cookie nadal ważne');
});

test('licznik otwarć i PDF zapisują zdarzenia, PDF wymaga cookie', async () => {
    const { access, db } = await setup();
    assert.deepEqual(await access.pdfUrl({ slug: 'test-supabase', cookieHeader: '', visitor }), { error: 'unauthorized' });
    const { cookie } = await access.unlock({ slug: 'test-supabase', token: 'tok-abc', visitor });
    const ch = cookieHeader('test-supabase', cookie.value);
    assert.equal((await access.recordView({ slug: 'test-supabase', cookieHeader: ch, visitor })).count, 1);
    assert.equal((await access.recordView({ slug: 'test-supabase', cookieHeader: ch, visitor })).count, 2);
    const { url } = await access.pdfUrl({ slug: 'test-supabase', cookieHeader: ch, visitor });
    assert.match(url, /exp=300/);
    assert.deepEqual(db.events.map((e) => e.kind), ['unlock_token', 'view', 'view', 'pdf']);
});

test('nieznany slug i zły format: invalid / not_found', async () => {
    const { access } = await setup();
    assert.deepEqual(await access.unlock({ slug: 'nie-ma', password: 'x', visitor }), { error: 'invalid' });
    assert.deepEqual(await access.unlock({ slug: '../etc', password: 'x', visitor }), { error: 'invalid' });
    assert.deepEqual(await access.read({ slug: 'nie-ma', cookieHeader: '' }), { error: 'unauthorized' });
});
