import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function takeScreenshots() {
    const screenshotsDir = join(__dirname, 'Screenshots');
    await mkdir(screenshotsDir, { recursive: true });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set a large viewport
    await page.setViewport({ width: 1440, height: 1080 });

    console.log('Navigating to local site...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });

    // Hide the hero switcher and global margin lines to avoid overlaying on screenshots
    await page.evaluate(() => {
        const switcher = document.querySelector('.fixed.top-4');
        if (switcher) switcher.style.display = 'none';
    });

    // Wait a bit for initial animations to settle
    await new Promise(r => setTimeout(r, 2000));

    const sections = await page.evaluate(() => {
        // Get header + all main elements + footer
        const elements = Array.from(document.querySelectorAll('header, main > div, main > section, footer'));
        return elements.map((el, index) => {
            if (!el.id) {
                el.id = `section-idx-${index}`;
            }
            return { id: el.id, tagName: el.tagName.toLowerCase() };
        });
    });

    console.log(`Found ${sections.length} sections. Taking screenshots...`);

    for (let i = 0; i < sections.length; i++) {
        const { id, tagName } = sections[i];
        console.log(`Scrolling to ${id} (${tagName})...`);

        // Scroll element into view
        await page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        }, `#${id}`);

        // Wait for GSAP/Framer Motion animations to trigger
        await new Promise(r => setTimeout(r, 1500));

        const element = await page.$(`#${id}`);
        if (element) {
            await element.screenshot({ path: join(screenshotsDir, `${String(i + 1).padStart(2, '0')}_${id}.png`) });
            console.log(`Saved screenshot for ${id}`);
        }
    }

    await browser.close();
    console.log('All screenshots saved!');
}

takeScreenshots().catch(console.error);
