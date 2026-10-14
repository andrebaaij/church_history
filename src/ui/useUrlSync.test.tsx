// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { useUrlSync } from "./useUrlSync";

it("writes the URL once per distinct value, debounced, and survives a throwing replaceState", () => {
  vi.useFakeTimers();
  const spy = vi.spyOn(history, "replaceState");
  const { rerender } = renderHook(({ qs }) => useUrlSync(qs), { initialProps: { qs: "?y=30" } });
  for (let y = 31; y < 120; y++) rerender({ qs: `?y=${y}` });
  rerender({ qs: "?y=119" });
  vi.advanceTimersByTime(400);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(null, "", `${location.pathname}?y=119`);
  spy.mockImplementation(() => { throw new Error("SecurityError"); });
  rerender({ qs: "?y=50" });
  expect(() => vi.advanceTimersByTime(400)).not.toThrow();
  vi.useRealTimers();
});
