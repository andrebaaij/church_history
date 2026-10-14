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
