import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";
const HB = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const FONT = "https://protomaps.github.io/basemaps-assets/fonts/Noto%20Sans%20Regular";
const RANGES = ["0-255", "256-511", "512-767", "768-1023", "7680-7935", "8192-8447", "8448-8703"];

async function get(url: string): Promise<Buffer> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

async function save(url: string, file: string) {
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, await get(url));
  console.log(`saved ${file}`);
}

await save(`${NE}/ne_50m_land.geojson`, join(ROOT, "data/geo/base/land.geojson"));
await save(`${NE}/ne_50m_rivers_lake_centerlines.geojson`, join(ROOT, "data/geo/base/rivers.geojson"));
await save(`${HB}/world_bc1.geojson`, join(ROOT, "data/geo/raw/world_bc1.geojson"));
await save(`${HB}/world_100.geojson`, join(ROOT, "data/geo/raw/world_100.geojson"));
for (const r of RANGES) await save(`${FONT}/${r}.pbf`, join(ROOT, "public/fonts/Noto Sans Regular", `${r}.pbf`));
