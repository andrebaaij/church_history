import { it, expect } from "vitest";
import { describeEntity } from "./detail";
import { buildIndex } from "./index";
import { makeDataset } from "../test/fixtures";

const idx = buildIndex(makeDataset());

it("describes a leg with its claim, sources and passage link", () => {
  const d = describeEntity("paul-to-seleucia", idx)!;
  expect(d.kind).toBe("leg");
  expect(d.title.en).toBe("Antiochia → Seleucia Pieria");
  expect(d.claims[0].claim.grade).toBe("A");
  expect(d.claims[0].citations[0]).toMatchObject({ locator: "13:4", href: "https://www.biblegateway.com/passage/?search=Acts+13%3A4&version=KJV" });
});

it("includes reference-work mentions and competing traditions", () => {
  expect(describeEntity("c-stay", idx)!.claims[0].mentions[0]).toMatchObject({ chapter: "1", work: { id: "vreugdenhil" } });
  expect(describeEntity("c-legend", idx)!.claims[0].alternatives.map((c) => c.id)).toEqual(["c-other"]);
});

it("describes entities regardless of year/filters (no time input at all)", () => {
  expect(describeEntity("paul-teaches", idx)!.kind).toBe("episode");
  expect(describeEntity("roman-empire", idx)!.claims.map((c) => c.claim.id)).toEqual(["c-rome"]);
  expect(describeEntity("antioch", idx)!.kind).toBe("place");
});

it("returns null for unknown ids", () => {
  expect(describeEntity("deleted-id", idx)).toBeNull();
});

it("describes a person as a chronological itinerary with grades", () => {
  const d = describeEntity("paul", idx)!;
  expect(d.kind).toBe("person");
  expect(d.title.en).toBe("Paul");
  expect(d.itinerary!.map((i) => [i.id, i.grade, i.when.from])).toEqual([
    ["paul-antioch", "A", 44],
    ["paul-to-seleucia", "A", 46],
  ]);
  expect(d.itinerary![1].title.en).toBe("Antiochia → Seleucia Pieria");
});
