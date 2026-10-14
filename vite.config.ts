import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  // MapLibre 6 loads its worker relative to its own module; pre-bundling breaks that URL.
  optimizeDeps: { exclude: ["maplibre-gl"] },
  test: {
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    environment: "node",
  },
});
