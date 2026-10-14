import { it, expect } from "vitest";
import type { Feature } from "geojson";
import { compileTerritories } from "./emit";
import { makeDataset } from "../test/fixtures";

const square: Feature = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] } };

it("emits one feature per geometry with time and style properties", () => {
  const ds = makeDataset();
  ds.territories.push({
    id: "judea", name: { en: "Judea", nl: "Judea" }, color: "#2e86c1",
    versions: [{ when: { from: 30, to: 40, circa: false }, status: "client-kingdom", overlord: "roman-empire", geometry: "judea.geojson", geometrySource: "historical-basemaps", precision: 2, claim: "c-rome" }],
  });
  const fc = compileTerritories(ds, () => ({ type: "FeatureCollection", features: [square, square] }));
  expect(fc.features).toHaveLength(4);
  const judea = fc.features.find((f) => f.properties?.id === "judea")!;
  expect(judea.properties).toMatchObject({ from: 30, to: 40, status: "client-kingdom", precision: 2, color: "#2e86c1", fillColor: "#b03a2e", "name:en": "Judea", "name:nl": "Judea" });
});

it("colours provinces with an overlord in the overlord's colour (no hatch status)", () => {
  const ds = makeDataset();
  ds.territories.push({
    id: "britannia", name: { en: "Britannia" }, color: "#888888",
    versions: [{ when: { from: 43, to: 100, circa: false }, status: "province", overlord: "roman-empire", geometry: "britannia.geojson", geometrySource: "historical-basemaps", precision: 1, claim: "c-rome" }],
  });
  const fc = compileTerritories(ds, () => square);
  expect(fc.features.find((f) => f.properties?.id === "britannia")!.properties).toMatchObject({ status: "province", fillColor: "#b03a2e", color: "#b03a2e" });
});

it("emits one label point per territory version, inside its largest polygon", async () => {
  const { compileTerritoryLabels } = await import("./emit");
  const ds = makeDataset();
  const big: Feature = { type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates: [[[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]], [[[20, 20], [21, 20], [21, 21], [20, 20]]]] } };
  const fc = compileTerritoryLabels(ds, () => big);
  expect(fc.features).toHaveLength(1);
  expect(fc.features[0].geometry).toEqual({ type: "Point", coordinates: [5, 5] });
  expect(fc.features[0].properties).toMatchObject({ id: "roman-empire", from: 30, to: 100, "name:en": "Roman Empire" });
});
