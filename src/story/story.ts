import { stringify } from "yaml";
import type { Camera } from "../model/focus";
import type { Index } from "../model/index";

export type StoryKeyAction = "next" | "prev" | "notes" | "exit";

export function keyToStoryAction(key: string): StoryKeyAction | null {
  switch (key) {
    case "ArrowRight": case " ": case "PageDown": return "next";
    case "ArrowLeft": case "PageUp": return "prev";
    case "n": case "N": return "notes";
    case "Escape": return "exit";
    default: return null;
  }
}

export function yearAt(from: number, to: number, t: number): number {
  const c = Math.min(1, Math.max(0, t));
  const e = c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
  return Math.round(from + (to - from) * e);
}

export function stepYaml({ year, camera, selected, idx }: { year: number; camera: Camera; selected: string | null; idx: Index }): string {
  const step: Record<string, unknown> = { year, camera: { center: camera.center, zoom: camera.zoom, bearing: camera.bearing }, highlight: selected ? [selected] : [] };
  if (selected && idx.episodes.has(selected)) step.episode = selected;
  else step.text = { en: "" };
  return stringify([step]);
}
