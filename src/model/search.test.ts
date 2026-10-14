import { it, expect } from "vitest";
import { searchEntities } from "./search";
import { buildIndex } from "./index";
import { focusFor, startYearFor } from "./focus";
import { makeDataset } from "../test/fixtures";

const ds = makeDataset();
const idx = buildIndex(ds);

it("finds places by ancient or modern name, ignoring case and accents", () => {
  expect(searchEntities("antakya", ds, idx, "en").map((r) => r.id)).toEqual(["antioch"]);
  expect(searchEntities("SÉLEU", ds, idx, "en").map((r) => r.id)).toEqual(["seleucia"]);
});

it("finds people and episodes, ignores 1-letter queries", () => {
  expect(searchEntities("paul", ds, idx, "en")[0]).toEqual({ id: "paul", kind: "person", label: "Paul" });
  expect(searchEntities("teaching", ds, idx, "en").map((r) => r.id)).toEqual(["paul-teaches"]);
  expect(searchEntities("a", ds, idx, "en")).toEqual([]);
});

it("focuses on places, stays, episodes and leg midpoints", () => {
  expect(focusFor("antioch", idx)).toEqual({ center: [36.18, 36.22], zoom: 7, bearing: 0 });
  expect(focusFor("paul-teaches", idx)).toEqual({ center: [36.18, 36.22], zoom: 7, bearing: 0 });
  expect(focusFor("paul-to-seleucia", idx)!.zoom).toBe(5);
  expect(focusFor("roman-empire", idx)).toBeNull();
  expect(startYearFor("paul-to-seleucia", idx)).toBe(46);
  expect(startYearFor("antioch", idx)).toBeNull();
});
