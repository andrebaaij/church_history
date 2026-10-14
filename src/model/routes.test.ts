import { it, expect } from "vitest";
import { legProgress, splitLine, legCoords } from "./routes";
import { buildIndex } from "./index";
import { makeDataset } from "../test/fixtures";

it("computes progress inclusive of boundary years", () => {
  const w = { from: 46, to: 48 };
  expect(legProgress(w, 45)).toBe(0);
  expect(legProgress(w, 46)).toBeCloseTo(1 / 3);
  expect(legProgress(w, 48)).toBe(1);
  expect(legProgress(w, 60)).toBe(1);
  expect(legProgress({ from: 47, to: 47 }, 47)).toBe(1);
  expect(legProgress({ from: 47, to: 47 }, 46)).toBe(0);
});

it("splits a line at a fraction of its length", () => {
  expect(splitLine([[0, 0], [2, 0]], 0.5)).toEqual({ done: [[0, 0], [1, 0]], remaining: [[1, 0], [2, 0]] });
  expect(splitLine([[0, 0], [1, 0], [1, 1]], 0.75)).toEqual({ done: [[0, 0], [1, 0], [1, 0.5]], remaining: [[1, 0.5], [1, 1]] });
  expect(splitLine([[0, 0], [2, 0]], 0)).toEqual({ done: [], remaining: [[0, 0], [2, 0]] });
  expect(splitLine([[0, 0], [2, 0]], 1)).toEqual({ done: [[0, 0], [2, 0]], remaining: [] });
});

it("builds leg coordinates from places and waypoints", () => {
  const ds = makeDataset();
  const idx = buildIndex(ds);
  const leg = idx.legs.get("paul-to-seleucia")!.leg;
  expect(legCoords({ ...leg, via: [[36, 36.1]] }, idx.places)).toEqual([[36.18, 36.22], [36, 36.1], [35.93, 36.12]]);
});
