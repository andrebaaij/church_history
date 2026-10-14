import { it, expect } from "vitest";
import { tx, joinText } from "./tx";

it("falls back to English, never blank", () => {
  expect(tx({ en: "Rome", nl: "Rome (NL)" }, "nl")).toBe("Rome (NL)");
  expect(tx({ en: "Rome" }, "nl")).toBe("Rome");
  expect(tx(undefined, "en")).toBe("");
});

it("joins texts per language with fallback", () => {
  expect(joinText({ en: "A", nl: "A-nl" }, " → ", { en: "B" })).toEqual({ en: "A → B", nl: "A-nl → B" });
});
