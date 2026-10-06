const { chromium } = require("playwright");
const path = require("path");
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
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  console.log("Creating a post with an image...");
  await page.click("text=Commencer un post");
  await page.waitForTimeout(500);
  await page.fill("textarea", "Post de test avec image");
  const imgInputs = page.locator('input[type="file"]');
  await imgInputs.first().setInputFiles(path.join(__dirname, "public/logose.png"));
  await page.waitForTimeout(500);
  await page.getByRole("dialog").locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/tmp/postimg-01-created.png" });

  console.log("Opening edit dialog...");
  await page.locator('button[aria-label="Modifier le post"]').first().click();
  await page.waitForTimeout(500);
  await page.getByRole("dialog").screenshot({ path: "/tmp/postimg-02-edit-open.png" });

  console.log("Replacing the image...");
  await page.getByRole("dialog").getByText("Remplacer l'image").click();
  await page.waitForTimeout(300);
  const editFileInput = page.getByRole("dialog").locator('input[type="file"]');
  await editFileInput.setInputFiles(path.join(__dirname, "public/logose.jpg"));
  await page.waitForTimeout(500);
  await page.getByRole("dialog").screenshot({ path: "/tmp/postimg-03-replaced.png" });
  await page.getByRole("dialog").locator('button[type="submit"]:has-text("Enregistrer")').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/tmp/postimg-04-after-replace.png" });

  console.log("Removing the image entirely...");
  await page.locator('button[aria-label="Modifier le post"]').first().click();
  await page.waitForTimeout(500);
  await page.getByRole("dialog").locator('button[aria-label="Supprimer l\'image"]').click();
  await page.waitForTimeout(300);
  await page.getByRole("dialog").screenshot({ path: "/tmp/postimg-05-marked-removed.png" });
  await page.getByRole("dialog").locator('button[type="submit"]:has-text("Enregistrer")').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/tmp/postimg-06-after-remove.png" });

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
