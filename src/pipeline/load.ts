import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "yaml";
import type { z } from "zod";
import {
  ClaimsFile, JourneyFile, MediaFile, PeopleFile, PlacesFile, SourcesFile, Story, TerritoriesFile, Timeline,
} from "../schema/entities";
import type { Dataset } from "../model/dataset";
import type { ValidationError } from "./errors";

const EMPTY_TIMELINE = { start: { year: 0, circa: true, claim: "missing-timeline" }, end: { year: 0, circa: true, claim: "missing-timeline" }, keyEvents: [] };

export function loadDataset(dataDir: string): { dataset: Dataset; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  const parseFile = <T>(file: string, schema: z.ZodType<T>): T | undefined => {
    const rel = relative(dataDir, file);
    let raw: unknown;
    try {
      raw = parse(readFileSync(file, "utf8"));
    } catch (e) {
      errors.push({ file: rel, path: "", message: `YAML parse error: ${(e as Error).message}` });
      return undefined;
    }
    const r = schema.safeParse(raw);
    if (!r.success) {
      for (const issue of r.error.issues) errors.push({ file: rel, path: issue.path.join("."), message: issue.message });
      return undefined;
    }
    return r.data;
  };

  const many = <T>(sub: string, schema: z.ZodType<T>): T[] => {
    const dir = join(dataDir, sub);
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith(".yaml"))
      .sort()
      .map((f) => parseFile(join(dir, f), schema))
      .filter((x): x is T => x !== undefined);
  };

  const one = <T>(rel: string, schema: z.ZodType<T>, optional = false): T | undefined => {
    const file = join(dataDir, rel);
    if (!existsSync(file)) {
      if (!optional) errors.push({ file: rel, path: "", message: "missing file" });
      return undefined;
    }
    return parseFile(file, schema);
  };

  const sourceFiles = many("sources", SourcesFile);
  const journeyFiles = many("journeys", JourneyFile);

  const dataset: Dataset = {
    sources: sourceFiles.flatMap((f) => f.sources),
    referenceWorks: sourceFiles.flatMap((f) => f.referenceWorks),
    claims: [...many("claims", ClaimsFile).flatMap((f) => f.claims), ...journeyFiles.flatMap((f) => f.claims)],
    people: one("people.yaml", PeopleFile)?.people ?? [],
    places: many("places", PlacesFile).flatMap((f) => f.places),
    territories: one("territories.yaml", TerritoriesFile)?.territories ?? [],
    journeys: journeyFiles.map((f) => ({ person: f.person, items: f.items })),
    media: one("media/media.yaml", MediaFile, true)?.media ?? [],
    stories: many("stories", Story),
    timeline: one("timeline.yaml", Timeline) ?? EMPTY_TIMELINE,
  };
  return { dataset, errors };
}
