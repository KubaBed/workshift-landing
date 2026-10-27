// Renderuje grafiki wpisu do public/images/blog/ (WebP) i grafiki social do public/social/ (PNG).
// Uzycie: node assets/blog/ktore-ai-kupic/render.mjs
import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../../public/images/blog');
const socialOut = path.resolve(here, '../../../public/social');
const jobs = [
  { file: 'hero.html', name: 'ktore-ai-kupic-dla-firmy', width: 1280, height: 720 },
  { file: 'tabela.html', name: 'ktore-ai-kupic-tabela', width: 1200, height: 800 },
  { file: 'social-post.html', name: 'WS-post-12-ktore-ai-1080x1080', width: 1080, height: 1080, social: true },
  { file: 'social-post-fb.html', name: 'WS-post-12-ktore-ai-fb-1080x1080', width: 1080, height: 1080, social: true },
  { file: 'social-story.html', name: 'WS-story-12-ktore-ai-1080x1920', width: 1080, height: 1920, social: true },
];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
for (const job of jobs) {
  await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(here, job.file)}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const frame = await page.$('.frame');
  const target = job.social ? path.join(socialOut, `${job.name}.png`) : path.join(out, `${job.name}.webp`);
  await frame.screenshot(job.social ? { path: target, type: 'png' } : { path: target, type: 'webp', quality: 90 });
  console.log('ok', job.name);
}
await browser.close();
