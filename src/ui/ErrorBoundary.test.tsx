// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

function Boom(): never {
  throw new Error("boom");
}

it("shows a reload fallback instead of a blank screen when a child throws", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  render(<ErrorBoundary><Boom /></ErrorBoundary>);
  expect(screen.getByRole("button", { name: /reload/i })).toBeTruthy();
});
