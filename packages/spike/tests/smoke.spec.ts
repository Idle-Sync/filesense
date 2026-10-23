import { expect, test } from "@playwright/test";

for (const name of ["jpeg-worker", "pdf", "save"]) {
  test(`stub page ${name} has the spike skeleton`, async ({ page }) => {
    await page.goto(`/pages/${name}/index.html`);
    await expect(page.locator("#file")).toBeVisible();
    await expect(page.locator("#run")).toBeVisible();
    await expect(page.locator("#result")).toBeAttached();
  });
}
