import { chromium } from 'playwright';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.goto('http://localhost:3000/');
await page.waitForTimeout(1500);

const info = await page.locator('video').evaluate((el) => ({
  currentSrc: el.currentSrc,
  readyState: el.readyState,
  paused: el.paused,
  videoWidth: el.videoWidth,
  duration: el.duration,
}));
console.log('video info:', info);

await page.screenshot({ path: '/Users/alamierhaidi/Documents/2026/superentreprise/superentreprise/video-preview.png' });

await browser.close();
