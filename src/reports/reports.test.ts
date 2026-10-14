import { it, expect } from "vitest";
import { missingTranslations } from "./translations";
import { collectUrls } from "./urls";
import { makeDataset } from "../test/fixtures";

it("lists i18n fields missing a language", () => {
  const value = { a: { en: "x", nl: "y" }, b: [{ title: { en: "only en" } }], c: { en: 3 } };
  expect(missingTranslations(value, "nl")).toEqual(["b.0.title"]);
});

it("collects and dedupes URLs", () => {
  const ds = makeDataset();
  ds.places[1].pleiades = ds.places[0].pleiades;
  const urls = collectUrls(ds).map((u) => u.url);
  expect(urls).toContain("https://ccel.org/ccel/schaff/anf01");
  expect(urls.filter((u) => u.includes("658381"))).toHaveLength(1);
});
