const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1000, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/auth/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "ephemeral-test-contactinfo@example.com");
  await page.fill('input[type="password"]', "Test1234!");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  await page.goto("http://localhost:3000/profile/contact-info-tester", { waitUntil: "networkidle" });
  await page.click("text=Mes objectifs");
  await page.waitForTimeout(400);
  await page.click("text=Recherche d'un nouvel emploi");
  await page.waitForTimeout(500);
  const dialog = page.getByRole("dialog");

  // Type a NEW job title but click Save directly without pressing Enter.
  await dialog.getByText("Ajouter un poste").click();
  await page.keyboard.type("Développeur sans Entrée");
  await dialog.locator('button[type="button"]:has-text("Enregistrer et continuer")').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "/tmp/blurfix-debug.png" });

  await page.getByRole("button", { name: "Mes objectifs" }).click();
  await page.waitForTimeout(400);
  await page.click("text=Recherche d'un nouvel emploi");
  await page.waitForTimeout(500);
  await page.getByRole("dialog").screenshot({ path: "/tmp/blurfix-01.png" });

  // Also verify Escape still cancels without adding a stray tag.
  await page.getByRole("dialog").getByText("Ajouter un poste").click();
  await page.keyboard.type("Ne doit pas être ajouté");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.getByRole("dialog").screenshot({ path: "/tmp/blurfix-02-after-escape.png" });

  await browser.close();
})();
