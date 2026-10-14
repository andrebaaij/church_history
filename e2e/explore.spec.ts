import { test, expect } from "@playwright/test";

test("slider moves routes from remaining to done", async ({ page }) => {
  await page.goto("./");
  const map = page.getByTestId("map");
  await expect(map).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(page.getByTestId("year-display")).toHaveText("30 AD");
  const before = Number(await map.getAttribute("data-done-legs"));
  await page.getByTestId("year-slider").fill("48");
  await expect(page.getByTestId("year-display")).toHaveText("48 AD");
  await expect.poll(async () => Number(await map.getAttribute("data-done-legs"))).toBeGreaterThan(before);
});

test("search opens sources for John on Patmos", async ({ page }) => {
  await page.goto("./");
  await page.getByTestId("search-input").fill("Revelation on");
  await page.getByTestId("search-result").first().click();
  const panel = page.getByTestId("detail-panel");
  await expect(panel).toContainText("Revelation 1:9");
  await expect(panel.getByTestId("grade-badge").first()).toHaveText("A");
  await expect(page).toHaveURL(/sel=john-receives-revelation/);
});

test("a shared link restores year and selection", async ({ page }) => {
  await page.goto("./?y=95&sel=john-patmos");
  await expect(page.getByTestId("year-display")).toHaveText("95 AD");
  await expect(page.getByTestId("detail-panel")).toContainText("Patmos");
});
