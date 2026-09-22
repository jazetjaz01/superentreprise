import { chromium } from 'playwright';
const B = 'http://localhost:3000';
const browser = await chromium.launch();
const errors = [];
for (const w of [1440, 1280, 1024]) {
  const ctx = await browser.newContext({ locale: 'fr-FR', viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type()==='error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  if (w === 1440) {
    await page.goto(B + '/auth/login', { waitUntil: 'networkidle' });
    await page.fill('#email', 'claude-aligntest@mailinator.com');
    await page.fill('#password', 'TestPassword-123!');
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL('**/protected', { timeout: 15000 }).catch(() => {});
  }
  await page.goto(B + '/profile/ada-align', { waitUntil: 'networkidle' });
  const logo = await page.locator('nav a[href="/"]').first().boundingBox();
  const card = await page.locator('[data-slot="card"]').first().boundingBox();
  console.log(`width ${w}: logo.x=${Math.round(logo.x)} card.x=${Math.round(card.x)} aligned=${Math.abs(logo.x - card.x) < 1} | overflow=${await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)}`);
  if (w === 1440) await page.screenshot({ path: '/tmp/align-1440.png' });
  await ctx.close();
}
console.log('errors:', errors);
await browser.close();
