export function isActive(when: { from: number; to: number }, year: number): boolean {
  return when.from <= year && year <= when.to;
}

export function clampYear(year: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(year)));
}
