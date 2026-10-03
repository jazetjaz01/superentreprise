const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1400, height: 1000 },
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/auth/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "ephemeral-test-followcheck@example.com");
  await page.fill('input[type="password"]', "Test1234!");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  await page.goto("http://localhost:3000/company/superentreprise?view=admin&tab=posts", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/tmp/followcheck.png", fullPage: true });
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.slice(0, 2000));
  await browser.close();
})();
