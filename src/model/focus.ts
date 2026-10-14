import type { Index } from "./index";

export type Camera = { center: [number, number]; zoom: number; bearing: number };

/** Frames Rome, Ethiopia/Meroë and South India at once. */
export const DEFAULT_CAMERA: Camera = { center: [48, 22], zoom: 2.4, bearing: 0 };

const at = (center: [number, number], zoom: number): Camera => ({ center, zoom, bearing: 0 });

export function focusFor(id: string, idx: Index): Camera | null {
  const place = (pid: string) => idx.places.get(pid)?.coords ?? null;
  const legMid = (from: string, to: string): Camera | null => {
    const a = place(from);
    const b = place(to);
    return a && b ? at([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], 5) : null;
  };
  const p = place(id);
  if (p) return at(p, 7);
  const stay = idx.stays.get(id);
  if (stay) return at(place(stay.stay.place)!, 7);
  const leg = idx.legs.get(id);
  if (leg) return legMid(leg.leg.from, leg.leg.to);
  const ep = idx.episodes.get(id);
  if (ep) return ep.parent.type === "stay" ? at(place(ep.parent.place)!, 7) : legMid(ep.parent.from, ep.parent.to);
  return null;
}

export function startYearFor(id: string, idx: Index): number | null {
  return idx.legs.get(id)?.leg.when.from ?? idx.stays.get(id)?.stay.when.from ?? idx.episodes.get(id)?.episode.when.from ?? idx.claims.get(id)?.when?.from ?? null;
}
