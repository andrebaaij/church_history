import { GRADES, LANGS, type Grade } from "../schema/common";
import type { Camera } from "../model/focus";
import { clampYear } from "../model/time";

export type ThemeName = "default" | "projector";
export type Filters = { people: string[] | null; grades: Grade[] };
export type UrlState = {
  year: number; camera: Camera | null; selected: string | null; filters: Filters;
  lang: string; theme: ThemeName; story: string | null; step: number;
};

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const id = (v: string | null) => (v !== null && ID.test(v) ? v : null);
const num = (v: string | null) => {
  if (v === null || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function defaultUrlState(startYear: number): UrlState {
  return { year: startYear, camera: null, selected: null, filters: { people: null, grades: [...GRADES] }, lang: "en", theme: "default", story: null, step: 0 };
}

export function parseUrlState(search: string, d: UrlState, range: { min: number; max: number }): UrlState {
  const q = new URLSearchParams(search);
  const year = num(q.get("y"));
  const c = q.get("c")?.split(",").map(Number);
  const cameraOk = !!c && c.length >= 3 && c.every(Number.isFinite) && Math.abs(c[0]) <= 180 && Math.abs(c[1]) <= 90 && c[2] >= 0 && c[2] <= 22;
  const g = q.get("g");
  const p = q.get("p");
  const lang = q.get("lang");
  const theme = q.get("theme");
  const step = num(q.get("step"));
  return {
    year: year === null ? d.year : clampYear(year, range.min, range.max),
    camera: cameraOk ? { center: [c![0], c![1]], zoom: c![2], bearing: c![3] ?? 0 } : d.camera,
    selected: id(q.get("sel")) ?? d.selected,
    filters: {
      people: p === null ? d.filters.people : p.split(",").filter((x) => ID.test(x)),
      grades: g === null ? d.filters.grades : GRADES.filter((gr) => g.toUpperCase().includes(gr)),
    },
    lang: lang && (LANGS as readonly string[]).includes(lang) ? lang : d.lang,
    theme: theme === "projector" || theme === "default" ? theme : d.theme,
    story: id(q.get("story")) ?? d.story,
    step: step === null || step < 0 ? d.step : Math.floor(step),
  };
}

export function serializeUrlState(s: UrlState, d: UrlState): string {
  const q = new URLSearchParams();
  if (s.year !== d.year) q.set("y", String(s.year));
  if (s.camera) q.set("c", [s.camera.center[0], s.camera.center[1], s.camera.zoom, s.camera.bearing].map((n) => +n.toFixed(3)).join(","));
  if (s.selected) q.set("sel", s.selected);
  if (s.filters.people !== null) q.set("p", s.filters.people.join(","));
  if (s.filters.grades.join("") !== d.filters.grades.join("")) q.set("g", s.filters.grades.join(""));
  if (s.lang !== d.lang) q.set("lang", s.lang);
  if (s.theme !== d.theme) q.set("theme", s.theme);
  if (s.story) {
    q.set("story", s.story);
    q.set("step", String(s.step));
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}
