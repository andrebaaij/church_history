import { it, expect } from "vitest";
import { buildStyle, territoryFilter } from "./style";

it("keeps the glyph URL template intact and same-origin", () => {
  const s = buildStyle("default", "http://localhost:4173", "/church_history/", "en");
  expect(s.glyphs).toBe("http://localhost:4173/church_history/fonts/{fontstack}/{range}.pbf");
  for (const src of Object.values(s.sources)) {
    if ("data" in src && typeof src.data === "string") expect(src.data.startsWith("http://localhost:4173/church_history/")).toBe(true);
  }
});

it("has one done and one remaining route layer per grade", () => {
  const ids = buildStyle("default", "http://x", "/", "en").layers.map((l) => l.id);
  for (const g of ["A", "B", "C", "D", "E"]) {
    expect(ids).toContain(`routes-done-${g}`);
    expect(ids).toContain(`routes-remaining-${g}`);
  }
});

it("projector theme draws thicker routes", () => {
  const w = (t: "default" | "projector") => (buildStyle(t, "http://x", "/", "en").layers.find((l) => l.id === "routes-done-A") as unknown as { paint: Record<string, number> }).paint["line-width"];
  expect(w("projector")).toBeGreaterThan(w("default"));
});

it("filters territories by year inclusively", () => {
  expect(territoryFilter(44)).toEqual(["all", ["<=", ["get", "from"], 44], [">=", ["get", "to"], 44]]);
});

it("draws the ancient-sea correction directly above land", () => {
  const ids = buildStyle("default", "http://x", "/", "en").layers.map((l) => l.id);
  expect(ids.indexOf("ancient-sea")).toBe(ids.indexOf("land") + 1);
});
