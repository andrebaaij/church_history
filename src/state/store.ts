import { GRADES, type Grade } from "../schema/common";
import type { Camera } from "../model/focus";
import type { ThemeName, UrlState } from "./urlState";

export type AppState = UrlState & {
  mode: "explore" | "story";
  showNotes: boolean;
  highlight: string[];
  flyRequest: { camera: Camera; seq: number } | null;
};

export type Action =
  | { type: "setYear"; year: number }
  | { type: "select"; id: string | null }
  | { type: "focus"; id: string; camera: Camera | null; year: number | null }
  | { type: "cameraMoved"; camera: Camera }
  | { type: "togglePerson"; id: string; all: string[] }
  | { type: "onlyPerson"; id: string }
  | { type: "toggleGrade"; grade: Grade }
  | { type: "setLang"; lang: string }
  | { type: "setTheme"; theme: ThemeName }
  | { type: "startStory"; id: string }
  | { type: "gotoStep"; step: number; camera: Camera; selected: string | null; highlight: string[] }
  | { type: "exitStory" }
  | { type: "resumeStory" }
  | { type: "closeStory" }
  | { type: "toggleNotes" };

export function initialAppState(url: UrlState): AppState {
  return { ...url, mode: url.story ? "story" : "explore", showNotes: false, highlight: [], flyRequest: null };
}

const fly = (s: AppState, camera: Camera) => ({ camera, seq: (s.flyRequest?.seq ?? 0) + 1 });

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "setYear":
      return { ...s, year: a.year };
    case "select":
      return { ...s, selected: a.id, highlight: [] };
    case "focus":
      return { ...s, selected: a.id, highlight: [], year: a.year ?? s.year, flyRequest: a.camera ? fly(s, a.camera) : s.flyRequest };
    case "cameraMoved":
      return { ...s, camera: a.camera };
    case "togglePerson": {
      const current = s.filters.people ?? a.all;
      const next = current.includes(a.id) ? current.filter((p) => p !== a.id) : [...current, a.id];
      const isAll = a.all.every((p) => next.includes(p));
      return { ...s, filters: { ...s.filters, people: isAll ? null : next } };
    }
    case "onlyPerson":
      return { ...s, filters: { ...s.filters, people: [a.id] } };
    case "toggleGrade": {
      const has = s.filters.grades.includes(a.grade);
      const grades = GRADES.filter((g) => (g === a.grade ? !has : s.filters.grades.includes(g)));
      return { ...s, filters: { ...s.filters, grades } };
    }
    case "setLang":
      return { ...s, lang: a.lang };
    case "setTheme":
      return { ...s, theme: a.theme };
    case "startStory":
      return { ...s, mode: "story", story: a.id, step: 0 };
    case "gotoStep":
      return { ...s, step: a.step, selected: a.selected, highlight: a.highlight, flyRequest: fly(s, a.camera) };
    case "exitStory":
      return { ...s, mode: "explore" };
    case "resumeStory":
      return s.story ? { ...s, mode: "story" } : s;
    case "closeStory":
      return { ...s, mode: "explore", story: null, step: 0, highlight: [], showNotes: false };
    case "toggleNotes":
      return { ...s, showNotes: !s.showNotes };
  }
}
