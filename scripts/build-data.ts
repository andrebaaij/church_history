import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";
import { validateReferences } from "../src/pipeline/validate";
import { compileTerritories } from "../src/pipeline/emit";
import { formatErrors } from "../src/pipeline/errors";

const ROOT = join(import.meta.dirname, "..");
const DATA = join(ROOT, "data");
const OUT = join(ROOT, "public");

const { dataset, errors } = loadDataset(DATA);
if (errors.length === 0) errors.push(...validateReferences(dataset, (rel) => existsSync(join(DATA, rel))));
if (errors.length > 0) {
  console.error(`✗ data invalid (${errors.length} problem${errors.length === 1 ? "" : "s"}):\n${formatErrors(errors)}`);
  process.exit(1);
}

rmSync(join(OUT, "data"), { recursive: true, force: true });
rmSync(join(OUT, "media"), { recursive: true, force: true });
mkdirSync(join(OUT, "data"), { recursive: true });
writeFileSync(join(OUT, "data/dataset.json"), JSON.stringify(dataset));
const territories = compileTerritories(dataset, (rel) => JSON.parse(readFileSync(join(DATA, rel), "utf8")));
writeFileSync(join(OUT, "data/territories.geojson"), JSON.stringify(territories));
for (const f of ["land.geojson", "rivers.geojson"]) cpSync(join(DATA, "geo/base", f), join(OUT, "data", f));
if (existsSync(join(DATA, "media/files"))) cpSync(join(DATA, "media/files"), join(OUT, "media"), { recursive: true });

console.log(
  `✓ data ok: ${dataset.claims.length} claims, ${dataset.sources.length} sources, ${dataset.places.length} places, ` +
    `${dataset.journeys.length} journeys, ${territories.features.length} territory shapes`,
);
