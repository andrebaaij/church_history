import { it, expect } from "vitest";
import { reducer, initialAppState } from "./store";
import { defaultUrlState } from "./urlState";

const s0 = initialAppState(defaultUrlState(30));

it("toggles a person out of 'all' and back", () => {
  const s1 = reducer(s0, { type: "togglePerson", id: "paul", all: ["paul", "john"] });
  expect(s1.filters.people).toEqual(["john"]);
  const s2 = reducer(s1, { type: "togglePerson", id: "paul", all: ["paul", "john"] });
  expect(s2.filters.people).toBeNull();
});

it("toggles grades keeping A–E order", () => {
  const s1 = reducer(s0, { type: "toggleGrade", grade: "C" });
  expect(s1.filters.grades).toEqual(["A", "B", "D", "E"]);
  expect(reducer(s1, { type: "toggleGrade", grade: "C" }).filters.grades).toEqual(["A", "B", "C", "D", "E"]);
});

it("focus selects, sets year and requests a camera flight", () => {
  const cam = { center: [26.5, 37.3] as [number, number], zoom: 7, bearing: 0 };
  const s1 = reducer(s0, { type: "focus", id: "john-patmos", camera: cam, year: 95 });
  expect(s1).toMatchObject({ selected: "john-patmos", year: 95, flyRequest: { camera: cam, seq: 1 } });
  const s2 = reducer(s1, { type: "focus", id: "x", camera: null, year: null });
  expect(s2).toMatchObject({ selected: "x", year: 95, flyRequest: { seq: 1 } });
});

it("story: start, step, exit keeps position, resume", () => {
  const cam = { center: [35, 31] as [number, number], zoom: 5, bearing: 0 };
  let s = reducer(s0, { type: "startStory", id: "demo" });
  expect(s).toMatchObject({ mode: "story", story: "demo", step: 0 });
  s = reducer(s, { type: "gotoStep", step: 2, camera: cam, selected: "e1", highlight: ["jerusalem"] });
  expect(s).toMatchObject({ step: 2, selected: "e1", highlight: ["jerusalem"], flyRequest: { camera: cam } });
  s = reducer(s, { type: "exitStory" });
  expect(s).toMatchObject({ mode: "explore", story: "demo", step: 2 });
  expect(reducer(s, { type: "resumeStory" }).mode).toBe("story");
  expect(reducer(s, { type: "closeStory" })).toMatchObject({ mode: "explore", story: null, step: 0, highlight: [] });
});
