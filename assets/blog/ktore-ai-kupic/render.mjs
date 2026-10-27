// Renderuje grafiki wpisu do public/images/blog/ (WebP).
// Uzycie: node assets/blog/ktore-ai-kupic/render.mjs
import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../../public/images/blog');
const jobs = [
  { file: 'hero.html', name: 'ktore-ai-kupic-dla-firmy', width: 1280, height: 720 },
  { file: 'tabela.html', name: 'ktore-ai-kupic-tabela', width: 1200, height: 800 },
];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
for (const job of jobs) {
  await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(here, job.file)}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const frame = await page.$('.frame');
  await frame.screenshot({ path: path.join(out, `${job.name}.webp`), type: 'webp', quality: 90 });
  console.log('ok', job.name);
}
await browser.close();
