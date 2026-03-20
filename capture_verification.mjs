import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
  
  // Wait a moment for any initial animations
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: '/Users/kuba/.gemini/antigravity/brain/16d51f5b-9679-4cbf-bf2d-64c18b9b0c93/site_mockup_verification_final.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to site_mockup_verification_final.png');
})();
