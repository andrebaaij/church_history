// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { App } from "./App";

it("renders the app shell", () => {
  render(<App />);
  expect(screen.getByTestId("app")).toBeTruthy();
});
