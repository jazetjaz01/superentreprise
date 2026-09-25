import { chromium } from 'playwright';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 1200 } });
const page = await context.newPage();

await page.goto('http://localhost:3000/auth/login');
await page.fill('input[type="email"]', 'titleinframe-test-jazetjaz@example.test');
await page.fill('input[type="password"]', 'TestPass123!');
await page.click('button[type="submit"]');
await page.waitForURL('**/', { timeout: 15000 }).catch(() => {});

await page.goto('http://localhost:3000/articles/premier-article-superentreprise');
await page.waitForTimeout(1200);

await page.screenshot({ path: '/Users/alamierhaidi/Documents/2026/superentreprise/superentreprise/titleinframe-preview.png', fullPage: true });

await browser.close();
