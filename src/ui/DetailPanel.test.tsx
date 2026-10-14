// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { it, expect, vi, beforeAll, afterEach } from "vitest";
import { DetailPanel } from "./DetailPanel";
import { describeEntity } from "../model/detail";
import { buildIndex } from "../model/index";
import { makeDataset } from "../test/fixtures";
import { initI18n } from "../i18n";

beforeAll(() => initI18n());
afterEach(cleanup);
const idx = buildIndex(makeDataset());

it("shows grade, exact citation with link, and Vreugdenhil mention", () => {
  render(<DetailPanel detail={describeEntity("paul-antioch", idx)!} lang="en" idx={idx} onSelect={() => {}} onClose={() => {}} />);
  expect(screen.getByTestId("grade-badge").textContent).toBe("A");
  const link = screen.getByRole("link", { name: /Acts.*11:26/ });
  expect(link.getAttribute("href")).toContain("Acts+11%3A26");
  expect(screen.getByText(/Also told by J\. Vreugdenhil, ch\. 1/)).toBeTruthy();
});

it("lists competing traditions and selects them on click", () => {
  const onSelect = vi.fn();
  render(<DetailPanel detail={describeEntity("c-legend", idx)!} lang="en" idx={idx} onSelect={onSelect} onClose={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /A competing legend/ }));
  expect(onSelect).toHaveBeenCalledWith("c-other");
});

it("shows when each cited source was written, so later witnesses are not mistaken for the claim's grade", () => {
  render(<DetailPanel detail={describeEntity("c-end", idx)!} lang="en" idx={idx} onSelect={() => {}} onClose={() => {}} />);
  expect(screen.getByText("written c. 180–189")).toBeTruthy();
});
