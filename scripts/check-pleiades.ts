import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";

const { dataset } = loadDataset(join(import.meta.dirname, "..", "data"));
const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const tokens = (s: string) => new Set(norm(s).split(/[^a-z]+/).filter((t) => t.length > 3));

console.log("| place | our name | Pleiades title | match |\n|---|---|---|---|");
for (const p of dataset.places.filter((x) => x.pleiades)) {
  const r = await fetch(`${p.pleiades}/json`, { signal: AbortSignal.timeout(15000) });
  const title = r.ok ? ((await r.json()) as { title: string }).title : `HTTP ${r.status}`;
  const ours = [p.name.ancient.en, p.name.modern?.en ?? ""].join(" ");
  const theirs = tokens(title);
  const ok = [...tokens(ours)].some((t) => [...theirs].some((u) => u.startsWith(t.slice(0, 5)) || t.startsWith(u.slice(0, 5))));
  console.log(`| ${p.id} | ${ours} | ${title} | ${ok ? "ok" : "**CHECK**"} |`);
}
