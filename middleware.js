// Vercel Edge Middleware: haslo na statyczne demo pod /demo/<slug>.
// Haslo w env DEMO_PASSWORD_<SLUG_UPPER>, podpis cookie z OFFER_JWT_SECRET (Web Crypto, HMAC-SHA256).
// Bez waznego cookie kazdy plik pod /demo/<slug>/ zwraca strone logowania (200, noindex).
// POST na /demo/<slug>/login z polem `password` ustawia cookie i przekierowuje do demo.

export const config = { matcher: ['/demo/:path*'] };

const COOKIE_DAYS = 30;
const enc = new TextEncoder();

function slugFromPath(pathname) {
    const m = pathname.match(/^\/demo\/([a-z0-9_-]+)/);
    return m ? m[1] : null;
}
const envKey = (slug) => `DEMO_PASSWORD_${slug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`;
const cookieName = (slug) => `demo_token_${slug}`;

function b64url(bytes) {
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(str) {
    const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
    const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
async function hmac(secret, data) {
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}
async function mint(secret, slug) {
    const payload = b64url(enc.encode(JSON.stringify({ slug, exp: Math.floor(Date.now() / 1000) + COOKIE_DAYS * 86400 })));
    return `${payload}.${b64url(await hmac(secret, payload))}`;
}
async function verify(secret, token, slug) {
    if (!token || !token.includes('.')) return false;
    const [payload, sig] = token.split('.');
    const expected = b64url(await hmac(secret, payload));
    if (expected.length !== sig.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    if (diff !== 0) return false;
    try {
        const p = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
        return p.slug === slug && p.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}
function getCookie(header, name) {
    if (!header) return null;
    for (const part of header.split(';')) {
        const [k, ...v] = part.trim().split('=');
        if (k === name) return v.join('=');
    }
    return null;
}
function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const max = Math.max(a.length, b.length);
    let diff = a.length ^ b.length;
    for (let i = 0; i < max; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    return diff === 0;
}

function loginPage(slug, error) {
    const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive"><title>Dostęp do demo</title>
<style>
:root{color-scheme:light}*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F6F6F4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Arial,sans-serif;color:#1A1A1A;-webkit-font-smoothing:antialiased}
.box{width:min(400px,92vw);background:#fff;border-radius:14px;padding:32px 32px 28px;box-shadow:0 0 0 1px rgba(20,20,20,.06),0 1px 2px -1px rgba(20,20,20,.06),0 10px 30px rgba(20,20,20,.08)}
h1{font-size:18px;font-weight:600;letter-spacing:-.01em;margin:0 0 6px}
p{margin:0 0 20px;color:#6B6B67;font-size:13.5px;line-height:1.5}
label{display:block;font-size:12.5px;color:#6B6B67;margin-bottom:6px}
input{width:100%;font:inherit;font-size:15px;padding:10px 12px;border:1px solid #E4E4DF;border-radius:8px;background:#fff;color:inherit}
input:focus{outline:none;border-color:#A8A8A3;box-shadow:0 0 0 3px rgba(233,83,31,.2)}
button{margin-top:14px;width:100%;font:inherit;font-size:14px;font-weight:500;padding:10px 14px;border:0;border-radius:8px;background:#1A1A1A;color:#fff;cursor:pointer}
button:active{transform:scale(.98)}
.err{color:#C0392B;font-size:12.5px;margin-top:10px}
.foot{margin-top:22px;font-size:11.5px;color:#A8A8A3}
</style></head><body><form class="box" method="post" action="/demo/${slug}/login" autocomplete="off">
<h1>Makieta koncepcyjna</h1><p>Materiał roboczy dla jednego odbiorcy. Wpisz hasło, które dostałeś od Workshift.</p>
<label for="pw">Hasło</label><input id="pw" name="password" type="password" required autofocus>
<button type="submit">Otwórz demo</button>${error ? '<div class="err">Nieprawidłowe hasło.</div>' : ''}
<div class="foot">Workshift · strona nieindeksowana</div></form></body></html>`;
    return new Response(html, {
        status: error ? 401 : 200,
        headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store, private',
            'x-robots-tag': 'noindex, nofollow, noarchive',
        },
    });
}

export default async function middleware(request) {
    const url = new URL(request.url);
    const slug = slugFromPath(url.pathname);
    if (!slug) return;
    const password = process.env[envKey(slug)];
    const secret = process.env.OFFER_JWT_SECRET;
    // Brak konfiguracji = brak dostepu (nigdy nie serwujemy demo "przypadkiem").
    if (!password || !secret) return new Response('Demo not configured', { status: 404 });

    // Adres bez ukosnika na koncu lamie wzgledne sciezki (styles.css -> /demo/styles.css). Zawsze na /demo/<slug>/.
    if (url.pathname === `/demo/${slug}`) {
        return new Response(null, { status: 308, headers: { location: `/demo/${slug}/${url.search}`, 'cache-control': 'no-store' } });
    }
    const isLogin = url.pathname === `/demo/${slug}/login`;
    if (isLogin && request.method === 'POST') {
        let provided = '';
        try {
            const form = await request.formData();
            provided = String(form.get('password') || '');
        } catch {
            provided = '';
        }
        if (!timingSafeEqual(provided, password)) return loginPage(slug, true);
        const token = await mint(secret, slug);
        const cookie = `${cookieName(slug)}=${token}; Path=/demo/${slug}; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; SameSite=Lax; Secure`;
        return new Response(null, { status: 303, headers: { location: `/demo/${slug}/`, 'set-cookie': cookie, 'cache-control': 'no-store' } });
    }

    const ok = await verify(secret, getCookie(request.headers.get('cookie'), cookieName(slug)), slug);
    if (!ok) return loginPage(slug, false);
    // Cookie wazny: przepuszczamy do statycznych plikow (rewrites z vercel.json dzialaja dalej).
    return;
}
