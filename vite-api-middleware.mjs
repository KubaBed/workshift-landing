// Local API dev — mapuje requesty /api/* na pliki api/*.js w stylu Vercel
// functions. Pozwala uruchamiać te same handlery lokalnie (vite) i produkcyjnie
// (Vercel) bez wymagania `vercel dev` ani `vercel` CLI.
//
// Mapowanie:
//   GET  /api/offers/get?slug=x    →  api/offers/get.js
//   POST /api/offers/verify        →  api/offers/verify.js
//   GET  /api/offers/views?slug=x  →  api/offers/views.js
//
// Każdy handler musi eksportować `default async function(req, res)` w stylu
// Vercel/Next API routes.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseQuery(urlString) {
    const url = new URL(urlString, 'http://localhost');
    const query = {};
    for (const [k, v] of url.searchParams.entries()) {
        if (query[k] === undefined) query[k] = v;
        else if (Array.isArray(query[k])) query[k].push(v);
        else query[k] = [query[k], v];
    }
    return { pathname: url.pathname, query };
}

async function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => { raw += chunk; });
        req.on('end', () => {
            if (!raw) return resolve(null);
            try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
        });
        req.on('error', reject);
    });
}

function patchResponse(res) {
    // Wzbogać res o helpery w stylu Vercel: status().json(), status().send().
    if (typeof res.status !== 'function') {
        res.status = (code) => { res.statusCode = code; return res; };
    }
    if (typeof res.json !== 'function') {
        res.json = (data) => {
            if (!res.getHeader('Content-Type')) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
            res.end(JSON.stringify(data));
            return res;
        };
    }
    if (typeof res.send !== 'function') {
        res.send = (data) => {
            if (typeof data === 'object' && data !== null) {
                return res.json(data);
            }
            res.end(String(data));
            return res;
        };
    }
    return res;
}

async function resolveHandler(pathname) {
    // Strip leading /api/
    const rel = pathname.replace(/^\/api\//, '').replace(/\/+$/, '');
    if (!rel) return null;

    // Sanity — tylko alfanumeryczne, myślniki, slash, kropka.
    if (!/^[a-z0-9/_-]+$/i.test(rel)) return null;

    const candidate = path.join(__dirname, 'api', `${rel}.js`);
    try {
        await fs.access(candidate);
        return candidate;
    } catch {
        return null;
    }
}

export default function apiMiddlewarePlugin() {
    return {
        name: 'workshift-api-middleware',
        // Plugin obsługuje tylko local dev (Vite middleware → /api/* requests).
        // W production (Vercel) functions w api/*.js obsługuje Vercel runtime,
        // więc plugin jest niepotrzebny w build phase. `apply: 'serve'` wyklucza
        // plugin z `vite build` — eliminujemy ryzyko interakcji z Rollup AST
        // parser, które wcześniej powodowało false "Expected ',', got 'ident'"
        // w nieskorelowanych plikach (np. src/data/blogPosts.js).
        apply: 'serve',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url || !req.url.startsWith('/api/')) return next();

                try {
                    const { pathname, query } = parseQuery(req.url);
                    const file = await resolveHandler(pathname);
                    if (!file) {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify({ error: 'API route not found' }));
                    }

                    // Wczytaj env z .env.local jeśli istnieje
                    if (!process.env.__OFFER_ENV_LOADED) {
                        try {
                            const envPath = path.join(__dirname, '.env.local');
                            const envRaw = await fs.readFile(envPath, 'utf-8');
                            for (const line of envRaw.split('\n')) {
                                const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
                                if (m && !process.env[m[1]]) {
                                    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
                                }
                            }
                            process.env.__OFFER_ENV_LOADED = '1';
                        } catch {
                            // .env.local optional
                        }
                    }

                    // Importuj handler z bust-cache (żeby zmiany w api/ pliku reloadowały).
                    const url = `${pathToFileURL(file).href}?t=${Date.now()}`;
                    const mod = await import(url);
                    const handler = mod.default;
                    if (typeof handler !== 'function') {
                        res.statusCode = 500;
                        return res.end(JSON.stringify({ error: 'Handler missing default export' }));
                    }

                    req.query = query;
                    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
                        req.body = await readJsonBody(req);
                    }
                    patchResponse(res);
                    await handler(req, res);
                } catch (err) {
                    console.error('[api-middleware]', err);
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Internal error', message: err.message }));
                    }
                }
            });
        },
    };
}
