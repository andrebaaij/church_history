// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { it, expect, vi, beforeAll } from "vitest";
import { initI18n } from "../i18n";
import { makeDataset } from "../test/fixtures";

vi.mock("../map/MapView", () => ({ MapView: () => <div data-testid="map" /> }));
beforeAll(() => initI18n());

it("drops unknown ids from a shared link instead of crashing", async () => {
  history.replaceState(null, "", "/?sel=deleted-id&story=nope&y=44");
  const { Loaded } = await import("./App");
  render(<Loaded ds={makeDataset()} />);
  expect(screen.getByTestId("year-display").textContent).toBe("44 AD");
  expect(screen.queryByTestId("detail-panel")).toBeNull();
});

it("opens the detail panel for a valid shared selection", async () => {
  history.replaceState(null, "", "/?sel=paul-antioch");
  const { Loaded } = await import("./App");
  render(<Loaded ds={makeDataset()} />);
  expect(screen.getByTestId("detail-panel")).toBeTruthy();
});

it("shows the welcome card on a first plain visit, not on shared links", async () => {
  localStorage.removeItem("intro-seen");
  history.replaceState(null, "", "/");
  const { Loaded } = await import("./App");
  const { unmount } = render(<Loaded ds={makeDataset()} />);
  expect(screen.getByRole("heading", { name: /Follow the apostles/ })).toBeTruthy();
  unmount();
  history.replaceState(null, "", "/?sel=paul-antioch");
  render(<Loaded ds={makeDataset()} />);
  expect(screen.queryByRole("heading", { name: /Follow the apostles/ })).toBeNull();
});
