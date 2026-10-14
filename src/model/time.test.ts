import { it, expect } from "vitest";
import { isActive, clampYear } from "./time";

it("is active on both boundary years", () => {
  expect(isActive({ from: 46, to: 48 }, 46)).toBe(true);
  expect(isActive({ from: 46, to: 48 }, 48)).toBe(true);
  expect(isActive({ from: 46, to: 48 }, 45)).toBe(false);
  expect(isActive({ from: 47, to: 47 }, 47)).toBe(true);
});

it("clamps years", () => {
  expect(clampYear(10, 30, 100)).toBe(30);
  expect(clampYear(120, 30, 100)).toBe(100);
  expect(clampYear(51.6, 30, 100)).toBe(52);
});
