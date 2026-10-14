import { test, expect } from "@playwright/test";

test("story mode: keys, notes, exit and resume", async ({ page }) => {
  await page.goto("./");
  await page.getByTestId("story-open").first().click();
  await expect(page.getByTestId("story-step")).toHaveText(/^1 \/ \d+$/);
  await page.keyboard.press("n");
  await expect(page.getByTestId("story-notes")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("story-step")).toHaveText(/^2 \/ \d+$/);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("search-input")).toBeVisible();
  await page.getByRole("button", { name: "Back to story" }).click();
  await expect(page.getByTestId("story-step")).toHaveText(/^2 \/ \d+$/);
});
