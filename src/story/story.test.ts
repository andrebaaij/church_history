import { it, expect } from "vitest";
import { parse } from "yaml";
import { keyToStoryAction, yearAt, stepYaml } from "./story";
import { buildIndex } from "../model/index";
import { makeDataset } from "../test/fixtures";
import { Step } from "../schema/entities";

it("maps presenter keys", () => {
  expect(["ArrowRight", " ", "PageDown"].map(keyToStoryAction)).toEqual(["next", "next", "next"]);
  expect(["ArrowLeft", "PageUp"].map(keyToStoryAction)).toEqual(["prev", "prev"]);
  expect(keyToStoryAction("n")).toBe("notes");
  expect(keyToStoryAction("Escape")).toBe("exit");
  expect(keyToStoryAction("x")).toBeNull();
});

it("eases between years", () => {
  expect(yearAt(30, 50, 0)).toBe(30);
  expect(yearAt(30, 50, 0.5)).toBe(40);
  expect(yearAt(30, 50, 1)).toBe(50);
  expect(yearAt(30, 50, 7)).toBe(50);
  expect(yearAt(50, 30, 1)).toBe(30);
});

it("produces a step that parses, using episode refs when possible", () => {
  const idx = buildIndex(makeDataset());
  const cam = { center: [36.18, 36.22] as [number, number], zoom: 6, bearing: 0 };
  const ep = parse(stepYaml({ year: 44, camera: cam, selected: "paul-teaches", idx }))[0];
  expect(Step.parse(ep)).toMatchObject({ year: 44, episode: "paul-teaches", highlight: ["paul-teaches"] });
  const free = parse(stepYaml({ year: 44, camera: cam, selected: "antioch", idx }))[0];
  expect(free.text).toEqual({ en: "" });
  expect(Step.safeParse(free).success).toBe(false);
});
