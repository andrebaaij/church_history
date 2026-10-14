import { tx } from "../i18n/tx";
import type { Dataset } from "./dataset";
import type { Index } from "./index";

export type SearchResult = { id: string; kind: "person" | "place" | "episode"; label: string };

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function searchEntities(query: string, ds: Dataset, idx: Index, lang: string, limit = 8): SearchResult[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  const all: SearchResult[] = [
    ...ds.people.map((p) => ({ id: p.id, kind: "person" as const, label: tx(p.name, lang) })),
    ...ds.places.map((p) => ({ id: p.id, kind: "place" as const, label: p.name.modern ? `${tx(p.name.ancient, lang)} / ${tx(p.name.modern, lang)}` : tx(p.name.ancient, lang) })),
    ...[...idx.episodes.values()].map((e) => ({ id: e.episode.id, kind: "episode" as const, label: tx(e.episode.title, lang) })),
  ];
  return all
    .filter((r) => norm(r.label).includes(q))
    .sort((a, b) => Number(!norm(a.label).startsWith(q)) - Number(!norm(b.label).startsWith(q)) || a.label.localeCompare(b.label))
    .slice(0, limit);
}
