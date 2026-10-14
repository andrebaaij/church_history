import { it, expect } from "vitest";
import { buildRouteFeatures, buildStayFeatures, buildPlaceFeatures } from "./features";
import { buildIndex } from "../model/index";
import { makeDataset } from "../test/fixtures";
import { GRADES } from "../schema/common";

const ds = makeDataset();
const idx = buildIndex(ds);
const all = { people: null, grades: [...GRADES] };

it("splits legs into done/remaining by year", () => {
  const parts = (y: number) => buildRouteFeatures(ds, idx, y, all).features.map((f) => f.properties!.part);
  expect(parts(40)).toEqual(["remaining"]);
  expect(parts(47)).toEqual(["done", "remaining"]);
  expect(parts(48)).toEqual(["done"]);
});

it("filters by person and grade", () => {
  expect(buildRouteFeatures(ds, idx, 48, { people: ["john"], grades: [...GRADES] }).features).toEqual([]);
  expect(buildRouteFeatures(ds, idx, 48, { people: null, grades: ["B"] }).features).toEqual([]);
  expect(buildRouteFeatures(ds, idx, 48, all).features[0].properties).toMatchObject({ id: "paul-to-seleucia", person: "paul", color: "#c0392b", grade: "A" });
});

it("only shows active stays", () => {
  expect(buildStayFeatures(ds, idx, 44, all).features.map((f) => f.properties!.id)).toEqual(["paul-antioch"]);
  expect(buildStayFeatures(ds, idx, 50, all).features).toEqual([]);
});

it("labels places with ancient and modern names and rank", () => {
  const f = buildPlaceFeatures(ds, idx, 40, "en").features.find((x) => x.properties!.id === "antioch")!;
  expect(f.properties).toEqual({ id: "antioch", ancient: "Antiochia", modern: "Antakya", rank: 2 });
});
