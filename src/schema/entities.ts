import { z } from "zod";
import { Grade, HexColor, I18nText, Id, LonLat, When } from "./common";

export const Source = z.object({
  id: Id,
  author: z.string().min(1),
  work: z.string().min(1),
  written: When,
  kind: z.enum(["scripture", "church-writer", "historian", "apocryphon", "inscription", "tradition", "modern-scholarship", "dataset"]),
  edition: z.string().optional(),
  url: z.url().optional(),
  /** URL template for a specific passage; "{locator}" is replaced, e.g. https://www.biblegateway.com/passage/?search=Acts+{locator}&version=KJV */
  locatorUrl: z.string().includes("{locator}").optional(),
});
export type Source = z.infer<typeof Source>;

export const ReferenceWork = z.object({ id: Id, author: z.string().min(1), title: z.string().min(1), url: z.url().optional() });
export type ReferenceWork = z.infer<typeof ReferenceWork>;

export const Citation = z.object({ source: Id, locator: z.string().min(1), quote: z.string().optional() });
export type Citation = z.infer<typeof Citation>;

export const Claim = z.object({
  id: Id,
  text: I18nText,
  when: When.optional(),
  grade: Grade,
  citations: z.array(Citation).min(1, "a claim needs at least one citation"),
  referenceWorks: z.array(z.object({ work: Id, chapter: z.string().min(1), quote: z.string().optional() })).default([]),
  alternativeTo: z.array(Id).default([]),
  notes: I18nText.optional(),
});
export type Claim = z.infer<typeof Claim>;

export const Person = z.object({ id: Id, name: I18nText, role: z.enum(["apostle", "emperor", "king", "other"]), color: HexColor });
export type Person = z.infer<typeof Person>;

export const Place = z.object({
  id: Id,
  name: z.object({ ancient: I18nText, modern: I18nText.optional() }),
  coords: LonLat,
  pleiades: z.url().optional(),
  kind: z.enum(["city", "region", "island", "site"]),
  exists: When.optional(),
  claim: Id.optional(),
});
export type Place = z.infer<typeof Place>;

export const TerritoryVersion = z.object({
  when: When,
  status: z.enum(["empire", "province", "client-kingdom", "kingdom"]),
  overlord: Id.optional(),
  geometry: z.string().regex(/^[a-z0-9-]+\.geojson$/),
  geometrySource: Id,
  precision: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  claim: Id,
});
export type TerritoryVersion = z.infer<typeof TerritoryVersion>;

export const Territory = z.object({ id: Id, name: I18nText, color: HexColor, versions: z.array(TerritoryVersion).min(1) });
export type Territory = z.infer<typeof Territory>;

export const Media = z.object({
  id: Id,
  file: z.string().min(1),
  kind: z.enum(["image", "video"]),
  caption: I18nText,
  role: z.enum(["evidence", "illustration"]),
  licence: z.string().min(1),
  creator: z.string().min(1),
  sourceUrl: z.url(),
  claim: Id.optional(),
});
export type Media = z.infer<typeof Media>;

export const Episode = z.object({ id: Id, title: I18nText, text: I18nText, when: When, claim: Id, media: z.array(Id).default([]) });
export type Episode = z.infer<typeof Episode>;

export const Leg = z.object({
  type: z.literal("leg"),
  id: Id,
  from: Id,
  to: Id,
  via: z.array(LonLat).default([]),
  when: When,
  mode: z.enum(["land", "sea"]),
  claim: Id,
  episodes: z.array(Episode).default([]),
});
export type Leg = z.infer<typeof Leg>;

export const Stay = z.object({ type: z.literal("stay"), id: Id, place: Id, when: When, claim: Id, episodes: z.array(Episode).default([]) });
export type Stay = z.infer<typeof Stay>;

export const JourneyItem = z.discriminatedUnion("type", [Leg, Stay]);
export type JourneyItem = z.infer<typeof JourneyItem>;

export const Camera = z.object({ center: LonLat, zoom: z.number().min(0).max(22), bearing: z.number().default(0) });

export const Step = z
  .object({
    year: z.number().int(),
    camera: Camera,
    highlight: z.array(Id).default([]),
    episode: Id.optional(),
    text: I18nText.optional(),
    notes: I18nText.optional(),
  })
  .refine((s) => Number(!!s.episode) + Number(!!s.text) === 1, { message: "a step needs exactly one of episode or text" });
export type Step = z.infer<typeof Step>;

export const Story = z.object({ id: Id, title: I18nText, steps: z.array(Step).min(1) });
export type Story = z.infer<typeof Story>;

const TimelinePoint = z.object({ year: z.number().int(), circa: z.boolean().default(true), claim: Id });
export const Timeline = z.object({
  start: TimelinePoint,
  end: TimelinePoint,
  keyEvents: z.array(z.object({ year: z.number().int(), label: I18nText, target: Id })).default([]),
});
export type Timeline = z.infer<typeof Timeline>;

export const SourcesFile = z.object({ sources: z.array(Source).default([]), referenceWorks: z.array(ReferenceWork).default([]) });
export const PlacesFile = z.object({ places: z.array(Place) });
export const ClaimsFile = z.object({ claims: z.array(Claim) });
export const PeopleFile = z.object({ people: z.array(Person) });
export const TerritoriesFile = z.object({ territories: z.array(Territory) });
export const MediaFile = z.object({ media: z.array(Media) });
export const JourneyFile = z.object({ person: Id, claims: z.array(Claim).default([]), items: z.array(JourneyItem) });
