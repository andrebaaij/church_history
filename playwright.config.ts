import { defineConfig, devices } from "@playwright/test";

const base = process.env.BASE_PATH ?? "/";
const url = `http://localhost:4173${base}`;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  use: { baseURL: url, launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } },
  webServer: { command: "pnpm preview --port 4173 --strictPort", url, reuseExistingServer: !process.env.CI },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
