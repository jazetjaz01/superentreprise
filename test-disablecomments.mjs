import { chromium } from "playwright";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: UA, viewport: { width: 1000, height: 900 } });
const page = await context.newPage();

await page.goto("http://localhost:3000/auth/login", { waitUntil: "networkidle" });
await page.fill('input#email', 'ephemeral-test-disablecomments@example.com');
await page.fill('input#password', 'Test1234!');
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Commencer un post" }).click();
await page.waitForTimeout(300);
await page.fill("textarea", "Ceci est un post sans commentaires.");
await page.getByLabel("Désactiver les commentaires sur ce post").check();
await page.screenshot({ path: "/tmp/disablecomments-1-dialog.png", fullPage: false });

await page.getByRole("button", { name: "Publier" }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/disablecomments-2-feed.png", fullPage: false, clip: { x: 0, y: 150, width: 1000, height: 400 } });

await browser.close();
console.log("done");
