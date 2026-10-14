import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import type { Dataset } from "../model/dataset";
import type { Index } from "../model/index";
import type { Filters } from "../state/urlState";
import { legCoords, legProgress, splitLine, type Coord } from "../model/routes";
import { isActive } from "../model/time";
import { tx } from "../i18n/tx";

const line = (coordinates: Coord[], properties: Record<string, unknown>): Feature<LineString> => ({ type: "Feature", geometry: { type: "LineString", coordinates }, properties });
const point = (coordinates: Coord, properties: Record<string, unknown>): Feature<Point> => ({ type: "Feature", geometry: { type: "Point", coordinates }, properties });
const shown = (filters: Filters, person: string) => filters.people === null || filters.people.includes(person);

export function buildRouteFeatures(ds: Dataset, idx: Index, year: number, filters: Filters): FeatureCollection<LineString> {
  const features: Feature<LineString>[] = [];
  for (const j of ds.journeys) {
    if (!shown(filters, j.person)) continue;
    const color = idx.people.get(j.person)!.color;
    for (const item of j.items) {
      if (item.type !== "leg") continue;
      const grade = idx.claims.get(item.claim)!.grade;
      if (!filters.grades.includes(grade)) continue;
      const { done, remaining } = splitLine(legCoords(item, idx.places), legProgress(item.when, year));
      const props = { id: item.id, person: j.person, color, grade };
      if (done.length > 1) features.push(line(done, { ...props, part: "done" }));
      if (remaining.length > 1) features.push(line(remaining, { ...props, part: "remaining" }));
    }
  }
  return { type: "FeatureCollection", features };
}

export function buildStayFeatures(ds: Dataset, idx: Index, year: number, filters: Filters): FeatureCollection<Point> {
  const features: Feature<Point>[] = [];
  for (const j of ds.journeys) {
    if (!shown(filters, j.person)) continue;
    for (const item of j.items) {
      if (item.type !== "stay" || !isActive(item.when, year)) continue;
      const grade = idx.claims.get(item.claim)!.grade;
      if (!filters.grades.includes(grade)) continue;
      features.push(point(idx.places.get(item.place)!.coords, { id: item.id, person: j.person, color: idx.people.get(j.person)!.color, grade }));
    }
  }
  return { type: "FeatureCollection", features };
}

export function buildPlaceFeatures(ds: Dataset, idx: Index, year: number, lang: string): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: ds.places
      .filter((p) => !p.exists || isActive(p.exists, year))
      .map((p) => {
        const ancient = tx(p.name.ancient, lang);
        const modern = tx(p.name.modern, lang);
        return point(p.coords, { id: p.id, ancient, modern: modern === ancient ? "" : modern, rank: idx.placeRank.get(p.id) ?? 0, kind: p.kind });
      }),
  };
}
