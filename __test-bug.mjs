import { chromium } from 'playwright';
const B = 'http://localhost:3000';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  locale: 'fr-FR', viewport: { width: 500, height: 500 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
});
const page = await ctx.newPage();
await page.goto(B + '/auth/login', { waitUntil: 'networkidle' });
await page.fill('#email', 'claude-bannerstacktest@mailinator.com');
await page.fill('#password', 'TestPassword-123!');
await page.click('button:has-text("Se connecter")');
await page.waitForURL('**/protected', { timeout: 15000 }).catch(() => {});

await page.goto(B + '/', { waitUntil: 'networkidle' });
const href = await page.locator('nav a[href*="/profile/"]').getAttribute('href');
await page.goto(B + href, { waitUntil: 'networkidle' });
await page.setInputFiles('input[type="file"]', '/tmp/red-banner.png');
await page.waitForTimeout(2000);

await page.goto(B + '/', { waitUntil: 'networkidle' });
const card = page.locator('aside').first();
await card.screenshot({ path: '/tmp/bug-repro.png' });
console.log('done');
await ctx.close();
await browser.close();
