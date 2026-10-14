import { describe, it, expect } from "vitest";
import { Claim, Place, Step, Media } from "./entities";
import { When, I18nText } from "./common";

describe("schemas", () => {
  it("rejects a claim without citations", () => {
    const r = Claim.safeParse({ id: "x", text: { en: "t" }, grade: "A", citations: [] });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown grade", () => {
    const r = Claim.safeParse({ id: "x", text: { en: "t" }, grade: "F", citations: [{ source: "acts", locator: "1:1" }] });
    expect(r.success).toBe(false);
  });

  it("applies defaults for referenceWorks and alternativeTo", () => {
    const c = Claim.parse({ id: "x", text: { en: "t" }, grade: "B", citations: [{ source: "acts", locator: "1:1" }] });
    expect(c.referenceWorks).toEqual([]);
    expect(c.alternativeTo).toEqual([]);
  });

  it("rejects when.from > when.to", () => {
    expect(When.safeParse({ from: 50, to: 40 }).success).toBe(false);
  });

  it("requires English text", () => {
    expect(I18nText.safeParse({ nl: "alleen Nederlands" }).success).toBe(false);
    expect(I18nText.parse({ en: "Rome", nl: "Rome" })).toEqual({ en: "Rome", nl: "Rome" });
  });

  it("rejects ids that are not kebab-case", () => {
    expect(Place.safeParse({ id: "Jerusalem", name: { ancient: { en: "x" } }, coords: [35, 31], kind: "city" }).success).toBe(false);
  });

  it("rejects coordinates out of range", () => {
    expect(Place.safeParse({ id: "x", name: { ancient: { en: "x" } }, coords: [200, 31], kind: "city" }).success).toBe(false);
  });

  it("requires exactly one of episode or text in a story step", () => {
    const base = { year: 40, camera: { center: [30, 30], zoom: 4 } };
    expect(Step.safeParse(base).success).toBe(false);
    expect(Step.safeParse({ ...base, episode: "a", text: { en: "b" } }).success).toBe(false);
    expect(Step.safeParse({ ...base, text: { en: "b" } }).success).toBe(true);
  });

  it("requires licence and creator on media", () => {
    const r = Media.safeParse({ id: "m", file: "a.jpg", kind: "image", caption: { en: "c" }, role: "illustration", sourceUrl: "https://example.org" });
    expect(r.success).toBe(false);
  });
});
