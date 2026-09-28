// Zrzuty ekranu oferty /oferta/<slug> (logowanie przez API, kazda sekcja osobno).
// Uzycie: node scripts/screenshot-offer.mjs http://localhost:5183 <slug> <haslo> <katalog-wyjsciowy>
import puppeteer from 'puppeteer';
import fs from 'node:fs';
const [,, base, slug, password, outDir] = process.argv;
const browser = await puppeteer.launch({ headless: 'new', channel: 'chrome', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(`${base}/oferta/${slug}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('form, h1', { timeout: 20000 });
await new Promise(r => setTimeout(r, 600));
// gate
await page.screenshot({ path: `${outDir}/00-gate.png` });
const r = await page.evaluate(async (slug, password) => {
  const res = await fetch('/api/offers/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ slug, password }) });
  return res.status;
}, slug, password);
console.log('verify status', r);
await page.goto(`${base}/oferta/${slug}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main h1', { timeout: 20000 });
await new Promise(r => setTimeout(r, 1200));
// czyste zrzuty: bez baneru cookies, bez przyklejonej nawigacji i widgetu czatu
try { const btn = await page.$$('button'); for (const b of btn) { const t = await b.evaluate(el => el.textContent.trim()); if (t === 'Tylko niezbędne') { await b.click(); break; } } } catch {}
await page.addStyleTag({ content: 'header, nav, [class*="fixed"], [class*="sticky"] { display: none !important; }' });
await new Promise(r => setTimeout(r, 400));
// wymus widocznosc framer-motion (whileInView): przewin cala strone
const total = await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  window.scrollTo(0, 0);
  return h;
});
await new Promise(r => setTimeout(r, 800));
console.log('page height', total);
await page.screenshot({ path: `${outDir}/01-full.png`, fullPage: true });
// per sekcja
const sections = await page.$$('main section');
console.log('sections', sections.length);
let i = 0;
for (const s of sections) {
  i++;
  const label = await s.evaluate(el => (el.querySelector('span')?.textContent || el.querySelector('h1,h2')?.textContent || 'sekcja').trim().slice(0, 30).replace(/[^\wÀ-ſ]+/g, '-'));
  await s.screenshot({ path: `${outDir}/${String(i).padStart(2, '0')}-${label}.png` });
}
const errors = [];
page.on('pageerror', e => errors.push(e.message));
console.log('done', errors);
await browser.close();
