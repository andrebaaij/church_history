import { test, expect } from "@playwright/test";

test("works without internet: no cross-origin requests", async ({ page }) => {
  const external: string[] = [];
  await page.route("**/*", (route) => {
    const u = new URL(route.request().url());
    if (u.hostname !== "localhost") {
      external.push(u.href);
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("./");
  await expect(page.getByTestId("map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await page.getByTestId("year-slider").fill("95");
  await page.waitForLoadState("networkidle");
  expect(external).toEqual([]);
});
