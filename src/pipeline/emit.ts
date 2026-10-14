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
            // A province looks like part of its overlord; a client kingdom gets the overlord's fill
            // (plus hatching in the style) but keeps its own border colour.
            color: v.status === "province" && overlord ? overlord.color : t.color,
            fillColor: overlord ? overlord.color : t.color,
            ...names,
          },
        });
      }
    });
  }
  return { type: "FeatureCollection", features };
}

type Ring = number[][];

/** Shoelace area and centroid of a ring (planar, in degrees — fine for label placement). */
function ringStats(ring: Ring): { area: number; cx: number; cy: number } {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const f = x0 * y1 - x1 * y0;
    a += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  a /= 2;
  return a === 0 ? { area: 0, cx: ring[0][0], cy: ring[0][1] } : { area: Math.abs(a), cx: cx / (6 * a), cy: cy / (6 * a) };
}

function outerRings(g: Geometry): Ring[] {
  if (g.type === "Polygon") return [g.coordinates[0]];
  if (g.type === "MultiPolygon") return g.coordinates.map((p) => p[0]);
  return [];
}

/** One label point per territory version, at the centroid of its largest polygon. */
export function compileTerritoryLabels(ds: Dataset, readGeo: (relPathInsideData: string) => FeatureCollection | Feature): FeatureCollection {
  const features: Feature[] = [];
  for (const t of ds.territories) {
    t.versions.forEach((v, version) => {
      const geo = readGeo(`geo/territories/${v.geometry}`);
      const rings = (geo.type === "FeatureCollection" ? geo.features.map((f) => f.geometry) : [geo.geometry]).flatMap(outerRings);
      if (rings.length === 0) return;
      const best = rings.map(ringStats).sort((a, b) => b.area - a.area)[0];
      const names = Object.fromEntries(LANGS.filter((l) => t.name[l]).map((l) => [`name:${l}`, t.name[l]]));
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [best.cx, best.cy] },
        properties: { id: t.id, version, from: v.when.from, to: v.when.to, status: v.status, area: best.area, ...names },
      });
    });
  }
  return { type: "FeatureCollection", features };
}
