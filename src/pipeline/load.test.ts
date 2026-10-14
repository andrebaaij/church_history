import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadDataset } from "./load";
import { formatErrors } from "./errors";

let dir: string;
const write = (rel: string, body: string) => {
  const f = join(dir, rel);
  mkdirSync(join(f, ".."), { recursive: true });
  writeFileSync(f, body);
};

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "data-"));
  write("people.yaml", "people:\n  - { id: paul, name: { en: Paul }, role: apostle, color: '#c0392b' }\n");
  write("territories.yaml", "territories: []\n");
  write("timeline.yaml", "start: { year: 30, claim: c-start }\nend: { year: 100, claim: c-end }\n");
  write("sources/common.yaml", "sources:\n  - { id: acts, author: Luke, work: Acts, written: { from: 60, to: 90 }, kind: scripture }\n");
  write("claims/common.yaml", "claims:\n  - { id: c-start, text: { en: Ascension }, grade: A, citations: [{ source: acts, locator: '1:9' }] }\n");
  write(
    "journeys/paul.yaml",
    "person: paul\nclaims:\n  - { id: c-end, text: { en: End }, grade: B, citations: [{ source: acts, locator: '28:30' }] }\nitems: []\n",
  );
});

describe("loadDataset", () => {
  it("merges files and journey claims", () => {
    const { dataset, errors } = loadDataset(dir);
    expect(errors).toEqual([]);
    expect(dataset.people.map((p) => p.id)).toEqual(["paul"]);
    expect(dataset.claims.map((c) => c.id).sort()).toEqual(["c-end", "c-start"]);
    expect(dataset.journeys).toEqual([{ person: "paul", items: [] }]);
    expect(dataset.media).toEqual([]);
  });

  it("reports schema errors with file and path", () => {
    write("claims/bad.yaml", "claims:\n  - { id: c-x, text: { en: X }, grade: A, citations: [] }\n");
    const { errors } = loadDataset(dir);
    expect(errors).toContainEqual(expect.objectContaining({ file: "claims/bad.yaml", path: "claims.0.citations" }));
  });

  it("reports YAML syntax errors with file name", () => {
    write("places/broken.yaml", "places: [unclosed\n");
    const { errors } = loadDataset(dir);
    expect(errors[0].file).toBe("places/broken.yaml");
    expect(errors[0].message).toMatch(/YAML/);
  });

  it("reports a missing required file", () => {
    const empty = mkdtempSync(join(tmpdir(), "empty-"));
    const { errors } = loadDataset(empty);
    expect(errors.map((e) => e.file)).toEqual(expect.arrayContaining(["people.yaml", "territories.yaml", "timeline.yaml"]));
  });

  it("formats errors one per line", () => {
    expect(formatErrors([{ file: "a.yaml", path: "x.0", message: "bad" }, { path: "", message: "worse" }])).toBe(
      "a.yaml › x.0: bad\n(dataset) › (root): worse",
    );
  });
});
