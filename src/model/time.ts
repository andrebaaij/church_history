export function isActive(when: { from: number; to: number }, year: number): boolean {
  return when.from <= year && year <= when.to;
}

export function clampYear(year: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(year)));
}

export type Era = { from: number; to: number; label: import("../schema/common").I18nText; claim: string };

/** The era covering a year; on a boundary year (one reign ends, the next begins) the later wins. */
export function eraAt(eras: Era[], year: number): Era | null {
  return [...eras].reverse().find((e) => isActive(e, year)) ?? null;
}
