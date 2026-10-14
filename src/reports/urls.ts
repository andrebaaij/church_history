import type { Dataset } from "../model/dataset";

export function collectUrls(ds: Dataset): { url: string; where: string }[] {
  const all = [
    ...ds.sources.filter((s) => s.url).map((s) => ({ url: s.url!, where: `source:${s.id}` })),
    ...ds.referenceWorks.filter((r) => r.url).map((r) => ({ url: r.url!, where: `referenceWork:${r.id}` })),
    ...ds.places.filter((p) => p.pleiades).map((p) => ({ url: p.pleiades!, where: `place:${p.id}` })),
    ...ds.media.map((m) => ({ url: m.sourceUrl, where: `media:${m.id}` })),
  ];
  const seen = new Set<string>();
  return all.filter((u) => (seen.has(u.url) ? false : (seen.add(u.url), true)));
}
