import { chromium } from 'playwright';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto('http://localhost:3000/auth/dev-preview-article');
await page.waitForTimeout(1000);
await page.screenshot({ path: '/Users/alamierhaidi/Documents/2026/superentreprise/superentreprise/style-preview.png', fullPage: true });

await browser.close();
