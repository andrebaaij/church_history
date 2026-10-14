import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Dataset } from "../model/dataset";
import { LANGS } from "../schema/common";

export function compileTerritories(ds: Dataset, readGeo: (relPathInsideData: string) => FeatureCollection | Feature): FeatureCollection {
  const byId = new Map(ds.territories.map((t) => [t.id, t]));
  const features: Feature[] = [];
  for (const t of ds.territories) {
    t.versions.forEach((v, version) => {
      const geo = readGeo(`geo/territories/${v.geometry}`);
      const geometries: Geometry[] = geo.type === "FeatureCollection" ? geo.features.map((f) => f.geometry) : [geo.geometry];
      const overlord = v.overlord ? byId.get(v.overlord) : undefined;
      const names = Object.fromEntries(LANGS.filter((l) => t.name[l]).map((l) => [`name:${l}`, t.name[l]]));
      for (const geometry of geometries) {
        features.push({
          type: "Feature",
          geometry,
          properties: {
            id: t.id, version, from: v.when.from, to: v.when.to, status: v.status, precision: v.precision,
            color: t.color, fillColor: v.status === "client-kingdom" && overlord ? overlord.color : t.color, ...names,
          },
        });
      }
    });
  }
  return { type: "FeatureCollection", features };
}
