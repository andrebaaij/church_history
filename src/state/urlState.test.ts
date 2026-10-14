import { it, expect } from "vitest";
import { defaultUrlState, parseUrlState, serializeUrlState } from "./urlState";

const d = defaultUrlState(30);
const range = { min: 30, max: 100 };

it("round-trips a full state", () => {
  const s = { ...d, year: 51, camera: { center: [22.9, 37.9] as [number, number], zoom: 6.5, bearing: 0 }, selected: "paul-corinth", filters: { people: ["paul", "thomas"], grades: ["A", "B"] as ("A" | "B")[] }, theme: "projector" as const, story: "youth-1", step: 3 };
  expect(parseUrlState(serializeUrlState(s, d), d, range)).toEqual(s);
});

it("serializes defaults to an empty string", () => {
  expect(serializeUrlState(d, d)).toBe("");
});

it("ignores garbage and clamps the year", () => {
  const s = parseUrlState("?y=abc&c=999,999,99&g=xyz&lang=klingon&theme=neon&step=-4&sel=Not An Id", d, range);
  expect(s).toEqual(d);
  expect(parseUrlState("?y=2000", d, range).year).toBe(100);
  expect(parseUrlState("?y=-5", d, range).year).toBe(30);
});

it("falls back to all grades when a link names none valid", () => {
  expect(parseUrlState("?g=zzz", d, range).filters.grades).toEqual(d.filters.grades);
  expect(parseUrlState("?g=ab", d, range).filters.grades).toEqual(["A", "B"]);
});
