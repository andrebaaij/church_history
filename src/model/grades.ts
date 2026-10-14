import type { Grade } from "../schema/common";

/** MapLibre line-dasharray per grade; null = solid. Colour never carries reliability. */
export const GRADE_DASH: Record<Grade, number[] | null> = {
  A: null,
  B: [6, 3],
  C: [3, 3],
  D: [0.5, 2.5],
  E: [0.5, 6],
};
