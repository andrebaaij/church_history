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
