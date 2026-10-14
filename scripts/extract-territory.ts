// Usage: tsx scripts/extract-territory.ts <raw-file> "<NAME in historical-basemaps>" <out-file-name>
// Example: tsx scripts/extract-territory.ts world_100 "Roman Empire" roman-empire-100.geojson
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { FeatureCollection } from "geojson";

const [raw, name, out] = process.argv.slice(2);
if (!raw || !name || !out) throw new Error("usage: extract-territory <raw> <NAME> <out.geojson>");
const ROOT = join(import.meta.dirname, "..");
const fc = JSON.parse(readFileSync(join(ROOT, "data/geo/raw", `${raw}.geojson`), "utf8")) as FeatureCollection;
const features = fc.features
  .filter((f) => f.properties?.NAME === name)
  .map((f) => ({ ...f, properties: { hbName: name, hbBorderPrecision: f.properties?.BORDERPRECISION ?? null } }));
if (features.length === 0) throw new Error(`no feature named "${name}" in ${raw}`);
mkdirSync(join(ROOT, "data/geo/territories"), { recursive: true });
writeFileSync(join(ROOT, "data/geo/territories", out), JSON.stringify({ type: "FeatureCollection", features }));
console.log(`wrote ${features.length} feature(s) to data/geo/territories/${out}`);
