// Render kreacji social z HTML przez Puppeteer (zgodnie z zasada "kreacje w kodzie").
import puppeteer from '/Users/kuba/Projekty/workshift-landing/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
const DIR = '/Users/kuba/Projekty/workshift-landing/scripts/social-blog-07';
const b = await puppeteer.launch({ channel: 'chrome', headless: 'new' });
for (const [file, w, h] of [['feed', 1080, 1080], ['story', 1080, 1920]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.goto(`file://${DIR}/${file}.html`, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 400));
  await p.screenshot({ path: `${DIR}/${file}.png` });
  console.log(`${file}.png -> ${w}x${h}`);
  await p.close();
}
await b.close();
