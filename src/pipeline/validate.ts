import type { Dataset } from "../model/dataset";
import { allEpisodes } from "../model/walk";
import type { ValidationError } from "./errors";

export type FileExists = (relPathInsideData: string) => boolean;

export function validateReferences(ds: Dataset, fileExists: FileExists): ValidationError[] {
  const errors: ValidationError[] = [];
  const err = (path: string, message: string) => errors.push({ path, message });

  const kindOf = new Map<string, string>();
  const register = (kind: string, id: string) => {
    const prev = kindOf.get(id);
    if (prev) err(`${kind}:${id}`, `duplicate id "${id}" (already used by a ${prev})`);
    else kindOf.set(id, kind);
  };
  ds.sources.forEach((s) => register("source", s.id));
  ds.referenceWorks.forEach((r) => register("referenceWork", r.id));
  ds.claims.forEach((c) => register("claim", c.id));
  ds.people.forEach((p) => register("person", p.id));
  ds.places.forEach((p) => register("place", p.id));
  ds.territories.forEach((t) => register("territory", t.id));
  ds.media.forEach((m) => register("media", m.id));
  ds.stories.forEach((s) => register("story", s.id));
  ds.journeys.forEach((j) => j.items.forEach((item) => register(item.type, item.id)));
  const episodes = allEpisodes(ds);
  episodes.forEach(({ episode }) => register("episode", episode.id));

  const need = (kind: string, id: string, at: string) => {
    if (kindOf.get(id) !== kind) err(at, `unknown ${kind} "${id}"`);
  };

  const claimsById = new Map(ds.claims.map((c) => [c.id, c]));
  for (const c of ds.claims) {
    c.citations.forEach((ct, i) => need("source", ct.source, `claim:${c.id}.citations.${i}`));
    c.referenceWorks.forEach((r, i) => need("referenceWork", r.work, `claim:${c.id}.referenceWorks.${i}`));
    for (const alt of c.alternativeTo) {
      const other = claimsById.get(alt);
      if (!other) err(`claim:${c.id}.alternativeTo`, `unknown claim "${alt}"`);
      else if (!other.alternativeTo.includes(c.id)) err(`claim:${c.id}.alternativeTo`, `"${alt}" does not list "${c.id}" back (alternativeTo must be symmetric)`);
    }
  }

  for (const p of ds.places) {
    if (!p.pleiades && !p.claim) err(`place:${p.id}`, "a place needs a pleiades URL or a claim");
    if (p.claim) need("claim", p.claim, `place:${p.id}.claim`);
  }

  for (const t of ds.territories) {
    t.versions.forEach((v, i) => {
      const at = `territory:${t.id}.versions.${i}`;
      need("claim", v.claim, `${at}.claim`);
      need("source", v.geometrySource, `${at}.geometrySource`);
      if (v.overlord) need("territory", v.overlord, `${at}.overlord`);
      if (!fileExists(`geo/territories/${v.geometry}`)) err(`${at}.geometry`, `missing file data/geo/territories/${v.geometry}`);
    });
  }

  for (const m of ds.media) {
    if (!fileExists(`media/files/${m.file}`)) err(`media:${m.id}.file`, `missing file data/media/files/${m.file}`);
    if (m.role === "evidence" && !m.claim) err(`media:${m.id}`, "evidence media needs a claim");
    if (m.claim) need("claim", m.claim, `media:${m.id}.claim`);
  }

  for (const j of ds.journeys) {
    need("person", j.person, `journey:${j.person}.person`);
    for (const item of j.items) {
      const at = `${item.type}:${item.id}`;
      need("claim", item.claim, `${at}.claim`);
      if (item.type === "leg") {
        need("place", item.from, `${at}.from`);
        need("place", item.to, `${at}.to`);
      } else {
        need("place", item.place, `${at}.place`);
      }
    }
  }

  for (const { episode } of episodes) {
    need("claim", episode.claim, `episode:${episode.id}.claim`);
    episode.media.forEach((m) => need("media", m, `episode:${episode.id}.media`));
  }

  for (const s of ds.stories) {
    s.steps.forEach((st, i) => {
      const at = `story:${s.id}.steps.${i}`;
      if (st.episode) need("episode", st.episode, `${at}.episode`);
      st.highlight.forEach((h) => {
        if (!kindOf.has(h)) err(`${at}.highlight`, `unknown id "${h}"`);
      });
    });
  }

  need("claim", ds.timeline.start.claim, "timeline.start.claim");
  need("claim", ds.timeline.end.claim, "timeline.end.claim");
  ds.timeline.keyEvents.forEach((k, i) => {
    if (!kindOf.has(k.target)) err(`timeline.keyEvents.${i}.target`, `unknown id "${k.target}"`);
  });

  return errors;
}
