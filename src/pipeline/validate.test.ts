import { describe, it, expect } from "vitest";
import { validateReferences } from "./validate";
import { makeDataset } from "../test/fixtures";

const always = () => true;
const msgs = (ds = makeDataset(), exists: (p: string) => boolean = always) => validateReferences(ds, exists).map((e) => `${e.path}: ${e.message}`);

describe("validateReferences", () => {
  it("accepts the fixture", () => {
    expect(msgs()).toEqual([]);
  });

  it("flags duplicate ids across kinds", () => {
    const ds = makeDataset();
    ds.places.push({ ...ds.places[0], id: "paul" });
    expect(msgs(ds)).toContainEqual(expect.stringMatching(/duplicate id "paul"/));
  });

  it("flags citations to unknown sources", () => {
    const ds = makeDataset();
    ds.claims[0].citations[0].source = "nope";
    expect(msgs(ds)).toContainEqual('claim:c-leg.citations.0: unknown source "nope"');
  });

  it("flags unknown reference works", () => {
    const ds = makeDataset();
    ds.claims[1].referenceWorks[0].work = "nope";
    expect(msgs(ds)).toContainEqual('claim:c-stay.referenceWorks.0: unknown referenceWork "nope"');
  });

  it("requires alternativeTo to be symmetric", () => {
    const ds = makeDataset();
    ds.claims.find((c) => c.id === "c-other")!.alternativeTo = [];
    expect(msgs(ds)).toContainEqual(expect.stringMatching(/does not list "c-legend" back/));
  });

  it("flags legs pointing at unknown places", () => {
    const ds = makeDataset();
    const leg = ds.journeys[0].items[1];
    if (leg.type === "leg") leg.to = "atlantis";
    expect(msgs(ds)).toContainEqual('leg:paul-to-seleucia.to: unknown place "atlantis"');
  });

  it("requires a place to have pleiades or a claim", () => {
    const ds = makeDataset();
    delete ds.places[0].pleiades;
    expect(msgs(ds)).toContainEqual("place:antioch: a place needs a pleiades URL or a claim");
  });

  it("requires evidence media to have a claim and existing file", () => {
    const ds = makeDataset();
    ds.media.push({ id: "photo", file: "x.jpg", kind: "image", caption: { en: "x" }, role: "evidence", licence: "CC BY 4.0", creator: "me", sourceUrl: "https://example.org" });
    const out = msgs(ds, (p) => !p.startsWith("media/"));
    expect(out).toContainEqual("media:photo: evidence media needs a claim");
    expect(out).toContainEqual("media:photo.file: missing file data/media/files/x.jpg");
  });

  it("flags missing territory geometry files", () => {
    expect(msgs(makeDataset(), (p) => !p.startsWith("geo/"))).toContainEqual(
      "territory:roman-empire.versions.0.geometry: missing file data/geo/territories/roman-empire.geojson",
    );
  });

  it("flags story steps with unknown episodes and highlights", () => {
    const ds = makeDataset();
    ds.stories[0].steps[0].episode = "nope";
    ds.stories[0].steps[0].highlight = ["ghost"];
    const out = msgs(ds);
    expect(out).toContainEqual('story:demo.steps.0.episode: unknown episode "nope"');
    expect(out).toContainEqual('story:demo.steps.0.highlight: unknown id "ghost"');
  });

  it("flags timeline claims that do not exist", () => {
    const ds = makeDataset();
    ds.timeline.end.claim = "nope";
    expect(msgs(ds)).toContainEqual('timeline.end.claim: unknown claim "nope"');
  });
});
