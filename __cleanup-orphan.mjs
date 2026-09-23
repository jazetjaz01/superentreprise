import { chromium } from 'playwright';
const B = 'http://localhost:3000';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'fr-FR', viewport: { width: 1280, height: 900 }, userAgent: UA });
const page = await ctx.newPage();
await page.goto(B + '/auth/login', { waitUntil: 'networkidle' });
await page.fill('#email', 'claude-postauthor@mailinator.com');
await page.fill('#password', 'TestPassword-123!');
await page.click('button:has-text("Se connecter")');
await page.waitForURL('**/protected', { timeout: 15000 }).catch(() => {});

const result = await page.evaluate(async () => {
  const { createClient } = await import('/_next/static/chunks/node_modules_%40supabase_ssr_dist_module_5486d996._.js').catch(() => ({}));
  return 'skip';
});
console.log(result);
await browser.close();
