import type { Leg, Place } from "../schema/entities";

export type Coord = [number, number];

export function legProgress(when: { from: number; to: number }, year: number): number {
  if (year < when.from) return 0;
  if (year >= when.to) return 1;
  return (year - when.from + 1) / (when.to - when.from + 1);
}

export function legCoords(leg: Leg, places: Map<string, Place>): Coord[] {
  const from = places.get(leg.from);
  const to = places.get(leg.to);
  if (!from || !to) throw new Error(`leg ${leg.id}: unknown place`);
  return [from.coords, ...leg.via, to.coords];
}

export function splitLine(coords: Coord[], fraction: number): { done: Coord[]; remaining: Coord[] } {
  if (fraction <= 0) return { done: [], remaining: coords };
  if (fraction >= 1) return { done: coords, remaining: [] };
  const seg = coords.slice(1).map((c, i) => Math.hypot(c[0] - coords[i][0], c[1] - coords[i][1]));
  let target = seg.reduce((a, b) => a + b, 0) * fraction;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const t = seg[i] === 0 ? 0 : target / seg[i];
      const a = coords[i];
      const b = coords[i + 1];
      const p: Coord = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      return { done: [...coords.slice(0, i + 1), p], remaining: [p, ...coords.slice(i + 1)] };
    }
    target -= seg[i];
  }
  return { done: coords, remaining: [] };
}
