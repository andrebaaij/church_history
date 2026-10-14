// Derives the territory geometry files in data/geo/territories/ from historical-basemaps
// (world_bc1 and world_100, downloaded by `pnpm fetch:geo`) and Natural Earth land.
//
//  - Every polity is clipped to land, so borders follow real coastlines when zoomed in.
//  - Roman expansion between 1 BC and AD 100 is split into "annexation pieces"
//    (world_100 minus world_bc1), assigned to a dated, sourced event by location.
//    data/territories.yaml then combines base + pieces per year range.
//
// Usage: pnpm tsx scripts/build-territories.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { bbox, booleanIntersects, centroid, difference, featureCollection, intersect, union } from "@turf/turf";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

type Poly = Feature<Polygon | MultiPolygon>;
const ROOT = join(import.meta.dirname, "..");
const raw = (f: string) => JSON.parse(readFileSync(join(ROOT, "data/geo/raw", `${f}.geojson`), "utf8")) as FeatureCollection;
const land = (JSON.parse(readFileSync(join(ROOT, "data/geo/base/land.geojson"), "utf8")) as FeatureCollection).features as Poly[];

const merge = (fs: Poly[]): Poly | null => {
  if (fs.length === 0) return null;
  return fs.length === 1 ? fs[0] : (union(featureCollection(fs)) as Poly | null);
};

function polity(file: string, name: string): Poly {
  const fs = raw(file).features.filter((f) => f.properties?.NAME === name) as Poly[];
  const m = merge(fs);
  if (!m) throw new Error(`no ${name} in ${file}`);
  return m;
}

/** Intersect with the land features that overlap, so coastlines follow Natural Earth. */
function clipToLand(p: Poly): Poly | null {
  const [x0, y0, x1, y1] = bbox(p);
  const parts: Poly[] = [];
  for (const l of land) {
    const [a0, b0, a1, b1] = bbox(l);
    if (a1 < x0 || a0 > x1 || b1 < y0 || b0 > y1) continue;
    if (!booleanIntersects(l, p)) continue;
    const i = intersect(featureCollection([l, p])) as Poly | null;
    if (i) parts.push(i);
  }
  return merge(parts);
}

const OUT = join(ROOT, "data/geo/territories");
mkdirSync(OUT, { recursive: true });
const write = (file: string, p: Poly | null) => {
  if (!p) throw new Error(`${file}: empty geometry`);
  writeFileSync(join(OUT, file), JSON.stringify(featureCollection([{ ...p, properties: {} }])));
  console.log(`wrote ${file}`);
};

// ---------- Roman Empire core + regions whose status changed between AD 30 and 100 ----------
// Each changing region becomes its own territory (client kingdom → province, coloured by its
// overlord), so the Roman core itself never changes shape.
const rome100 = polity("world_100", "Roman Empire");
const rome1 = polity("world_bc1", "Roman Empire");
const box = (w: number, s: number, e: number, n: number): Poly => ({
  type: "Feature", properties: {},
  geometry: { type: "Polygon", coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] },
});
const cut = (a: Poly, b: Poly) => intersect(featureCollection([a, b])) as Poly | null;
const minus = (a: Poly, b: Poly | null) => (b ? (difference(featureCollection([a, b])) as Poly) : a);

// Britain and Thrace: what world_100 has that world_bc1 lacks, located by box.
const gained = difference(featureCollection([rome100, rome1])) as Poly;
const gainedIn = (b: Poly) => cut(gained, b);
const britain = gainedIn(box(-11, 49, 3, 61));
const thrace = gainedIn(box(21, 40, 30.5, 45));
const mauretania = cut(rome100, box(-11, 27, 5.5, 37.2));
const commagene = cut(rome100, box(37.4, 37.0, 39.2, 38.4));
const judea = polity("world_bc1", "Judea"); // Herodian lands: Judea, Samaria, Galilee, Perea, Batanea
const beyondEuphrates = box(39.5, 28, 50, 37.5); // world_100 includes Trajan's later Mesopotamia

let core = rome100;
for (const p of [beyondEuphrates, judea, mauretania, commagene, britain, thrace]) core = minus(core, p);

write("roman-empire.geojson", clipToLand(core));
write("britannia.geojson", clipToLand(britain!));
write("thrace.geojson", clipToLand(thrace!));
write("mauretania.geojson", clipToLand(mauretania!));
write("commagene.geojson", clipToLand(commagene!));
write("judea.geojson", clipToLand(judea));

// ---------- other polities (world_100 shapes, clipped) ----------
// Optional [w, s, e, n] box keeps only part of a historical-basemaps shape.
const OTHERS: [string, string, [number, number, number, number]?][] = [
  ["Parthian Empire", "parthian-empire.geojson"],
  ["Armenia", "armenia.geojson"],
  ["Nabatean Kingdom", "nabataea.geojson"],
  ["Bosporian Kingdom", "bosporan-kingdom.geojson"],
  ["Meroe", "meroe.geojson"],
  ["Axum", "axum.geojson"],
  ["Himyarite Kingdom", "himyar.geojson"],
  ["Hadramaut", "hadramaut.geojson"],
  ["Kushan Empire", "kushan-empire.geojson"],
  ["Suren Kingdom", "indo-parthian-kingdom.geojson"],
  ["Saka Kingdom", "western-satraps.geojson"],
  ["Satavahanihara", "satavahana.geojson"],
  ["Hindu kingdoms", "tamil-kingdoms.geojson", [70, 5, 82, 15.5]], // the Tamil south only, not Bengal
  ["Simhala", "anuradhapura.geojson"],
  ["Dacia", "dacia.geojson"],
];
for (const [name, file, keep] of OTHERS) {
  const shape = polity("world_100", name);
  write(file, clipToLand(keep ? cut(shape, box(...keep))! : shape));
}
