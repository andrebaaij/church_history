# Apostles Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static, offline-capable, source-backed interactive map of the apostles' travels c. AD 30–100, with a year slider, explore mode, and story mode for a youth-group evening.

**Architecture:** All content lives as YAML/GeoJSON under `data/`. A build step (`pnpm data`) loads it, validates it with Zod plus cross-reference rules (failing the build on any uncited claim or dangling id), and emits JSON into `public/`. A Vite + React + TypeScript app renders it with MapLibre GL JS; all logic that decides *what* is shown (time filtering, route splitting, filters, detail lookup, URL state) lives in pure modules with unit tests, and React/MapLibre only render the result.

**Tech Stack:** Node 24, pnpm 12, Vite 8, React 19, TypeScript 7, MapLibre GL JS 6, Zod 4, yaml 2, i18next 26 + react-i18next 17, Vitest 5 (+ jsdom, Testing Library), Playwright 1.64, tsx, @turf/turf (geo scripts only).

**Spec:** `docs/superpowers/specs/2026-10-13-ancient-world-map-design.md`

## Global Constraints

- Package manager: **pnpm**. Node **24**. `"type": "module"`. TypeScript `strict: true`.
- **Nothing on the map without a source**: every Claim has `grade` A–E and ≥1 citation; the build fails otherwise.
- Grades (clarified from spec §3.1 — confirm with maintainer, see Task 13): **A** = New Testament text, or contemporary archaeology/inscriptions; **B** = early writers within ~150 years of the event, Christian (1 Clement, Ignatius, Papias, Irenaeus) *or* non-Christian historians (Josephus, Tacitus, Suetonius, Pliny the Elder, *Periplus*); **C** = later church writers relaying older material (Eusebius, Origen via Eusebius, Jerome); **D** = apocryphal acts and legend; **E** = local tradition without an early written source.
- Reference works (Vreugdenhil, *Church History for Young and Old*) are shown but never graded.
- All UI strings through i18next (`src/i18n/locales/en.json`); all data text as `{ en: "...", nl?: "..." }`; missing translation falls back to English, never blank.
- Default/only shipped language v1: **English**. `LANGS = ["en", "nl"]`.
- **No network at runtime except same-origin**: fonts, base map, data, media are all served from `public/`. No CDN, no tile server.
- Slider range comes from `data/timeline.yaml` (start c. 30 = Ascension, end c. 100 = death of John), never hard-coded in components.
- Line style encodes grade, colour encodes person: A solid, B `[6,3]`, C `[3,3]`, D `[0.5,2.5]`, E `[0.5,6]` (MapLibre dash units).
- Ids are lowercase kebab-case and **globally unique across all entity kinds**.
- Licences: code MIT (`LICENSE`), own data CC BY-SA 4.0 (`data/LICENSE.md`), historical-basemaps-derived geometry GPL-3.0 (`data/geo/territories/LICENSE.md`).
- GitHub Pages base path: `/church_history/` (set via `BASE_PATH` env in CI; `/` locally).
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Year exactly on a boundary** (slider = `when.from` or `when.to`, single-year legs, stays) → item is visible; a single-year leg is fully "done" in its year. Tested in Task 6 (`time.test.ts`, `routes.test.ts`).
2. **Hand-edited YAML with a typo** (bad indentation, unknown id, missing citation) → `pnpm data` exits 1 with `file › path: message` lines, not a stack trace. Tested in Task 3 (`load.test.ts` "reports YAML syntax errors with file name") and Task 4.
3. **Shared link with garbage or stale params** (`?y=abc&c=999,999,99&sel=deleted-id&story=nope`) → app opens at defaults, no crash, unknown selection/story ignored. Tested in Task 7 (`urlState.test.ts` "ignores garbage") and Task 9 (`App` guard for unknown ids).
4. **Selecting something hidden by filters or outside the current year** (via search or a shared link) → detail panel still shows its claim and sources. Tested in Task 6 (`detail.test.ts` "describes entities regardless of year/filters").
5. **Venue without internet** → the built site makes zero cross-origin requests and still renders map + data. Tested in Task 12 (`e2e/offline.spec.ts`).

---

## File Structure

```
package.json, pnpm-workspace.yaml, tsconfig.json, vite.config.ts, playwright.config.ts
index.html, LICENSE, .gitignore
data/
  LICENSE.md
  timeline.yaml               # slider range + key events
  people.yaml
  territories.yaml
  sources/*.yaml              # { sources: [...], referenceWorks: [...] }   (common.yaml + one per import)
  places/*.yaml               # { places: [...] }
  claims/*.yaml               # { claims: [...] }   (claims not owned by a journey)
  journeys/<person>.yaml      # { person, claims: [...], items: [leg|stay ...] }
  stories/<story>.yaml
  media/media.yaml, media/files/*
  geo/base/land.geojson, geo/base/rivers.geojson        # Natural Earth, public domain
  geo/territories/*.geojson, geo/territories/LICENSE.md # GPL-3.0 (historical-basemaps derived)
  geo/raw/                    # downloaded source files (gitignored)
public/fonts/Noto Sans Regular/*.pbf    # committed glyphs (OFL)
public/data/, public/media/             # generated by `pnpm data` (gitignored)
scripts/
  build-data.ts               # load → validate → emit
  fetch-geo.ts                # download Natural Earth + historical-basemaps + glyphs
  extract-territory.ts        # pick a polity out of a historical-basemaps file
  geo-derive.ts               # union/difference helper for border changes
  i18n-report.ts, link-check.ts, check-pleiades.ts
src/
  schema/common.ts, schema/entities.ts       # Zod schemas + inferred types
  model/dataset.ts                           # Dataset type
  model/walk.ts                              # allEpisodes()
  model/index.ts                             # buildIndex()
  model/time.ts, model/grades.ts, model/routes.ts
  model/detail.ts, model/search.ts, model/focus.ts
  pipeline/errors.ts, pipeline/load.ts, pipeline/validate.ts, pipeline/emit.ts
  reports/translations.ts, reports/urls.ts
  i18n/index.ts, i18n/tx.ts, i18n/locales/en.json
  state/urlState.ts, state/store.ts
  map/style.ts, map/features.ts, map/hatch.ts, map/MapView.tsx
  story/story.ts, story/StoryMode.tsx
  ui/App.tsx, ui/useDataset.ts, ui/YearSlider.tsx, ui/YearDisplay.tsx, ui/Filters.tsx,
  ui/Legend.tsx, ui/DetailPanel.tsx, ui/Search.tsx, ui/Settings.tsx, ui/Attribution.tsx, ui/app.css
  main.tsx
  test/fixtures.ts
e2e/*.spec.ts
.github/workflows/ci.yml, .github/workflows/links.yml
```

Tasks 1–12 are code (sequential). Tasks 13–15 are content; 13 and 14 can start as soon as Task 5 is merged and run in parallel with Tasks 6–12 (as separate agent-deck sessions, each writing only its own files).

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `LICENSE`, `data/LICENSE.md`, `src/main.tsx`, `src/ui/App.tsx`, `src/ui/App.test.tsx`

**Interfaces:**
- Produces: scripts `pnpm data | dev | build | preview | test | test:e2e | typecheck`; Vitest picks up `src/**/*.test.ts(x)` and `scripts/**/*.test.ts`.

- [ ] **Step 1: Write config files**

`package.json`:
```json
{
  "name": "church-history-map",
  "private": true,
  "type": "module",
  "license": "MIT",
  "engines": { "node": ">=24" },
  "scripts": {
    "data": "tsx scripts/build-data.ts",
    "dev": "pnpm data && vite",
    "build": "pnpm data && tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit",
    "fetch:geo": "tsx scripts/fetch-geo.ts",
    "i18n:report": "tsx scripts/i18n-report.ts",
    "links": "tsx scripts/link-check.ts",
    "check:pleiades": "tsx scripts/check-pleiades.ts"
  }
}
```

`pnpm-workspace.yaml` (supply-chain hygiene: don't install versions younger than 1 day):
```yaml
minimumReleaseAge: 1440
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": false,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vite/client", "node"]
  },
  "include": ["src", "scripts", "e2e", "vite.config.ts", "playwright.config.ts"]
}
```

`vite.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  test: {
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    environment: "node",
  },
});
```

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apostles Map</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`.gitignore`:
```
node_modules/
dist/
public/data/
public/media/
data/geo/raw/
test-results/
playwright-report/
.DS_Store
```

`LICENSE`: the standard MIT licence text, `Copyright (c) 2026 Andre Baaij`.

`data/LICENSE.md`:
```markdown
# Data licence

Unless a file or folder states otherwise, the data in `data/` is licensed under
Creative Commons Attribution-ShareAlike 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).

Exceptions:
- `geo/territories/` — derived from historical-basemaps (A. Ourednik), GPL-3.0. See its LICENSE.md.
- `geo/base/` — Natural Earth, public domain.
- `media/files/` — each file's licence is recorded in `media/media.yaml`.
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
pnpm add react react-dom maplibre-gl zod yaml i18next react-i18next
pnpm add -D vite @vitejs/plugin-react typescript vitest jsdom @testing-library/react @testing-library/dom @playwright/test tsx @types/react @types/react-dom @types/node @types/geojson @turf/turf
```
Expected: installs without errors. If pnpm reports ignored build scripts, run `pnpm approve-builds` and approve nothing unless a package fails to work without it. If `tsc --noEmit` later fails because of a TypeScript 7 incompatibility in a dependency's types, pin `typescript@^5.9` and note it in the commit message.

- [ ] **Step 3: Write the failing smoke test**

`src/ui/App.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { App } from "./App";

it("renders the app shell", () => {
  render(<App />);
  expect(screen.getByTestId("app")).toBeTruthy();
});
```

- [ ] **Step 4: Run it to verify it fails**

Run: `pnpm test`
Expected: FAIL — `Failed to resolve import "./App"`.

- [ ] **Step 5: Minimal implementation**

`src/ui/App.tsx` (replaced in Task 9):
```tsx
export function App() {
  return <div data-testid="app">Apostles Map</div>;
}
```

`src/main.tsx`:
```tsx
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";

createRoot(document.getElementById("root")!).render(<App />);
```

- [ ] **Step 6: Run tests and typecheck**

Run: `pnpm test && pnpm typecheck`
Expected: 1 test PASS; typecheck exits 0.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Schemas, Dataset type, test fixture

**Files:**
- Create: `src/schema/common.ts`, `src/schema/entities.ts`, `src/model/dataset.ts`, `src/test/fixtures.ts`
- Test: `src/schema/entities.test.ts`

**Interfaces:**
- Produces (exact names used by every later task):
  - `common.ts`: `Id`, `LANGS`, `type Lang`, `I18nText` (+type), `Grade` (+type), `GRADES: Grade[]`, `When` (+type), `LonLat` (+type), `HexColor`
  - `entities.ts`: schemas **and** inferred types with the same names: `Source`, `ReferenceWork`, `Citation`, `Claim`, `Person`, `Place`, `TerritoryVersion`, `Territory`, `Media`, `Episode`, `Leg`, `Stay`, `JourneyItem`, `Step`, `Story`, `Timeline`; file schemas `SourcesFile`, `PlacesFile`, `ClaimsFile`, `PeopleFile`, `TerritoriesFile`, `MediaFile`, `JourneyFile`
  - `dataset.ts`: `type Journey = { person: string; items: JourneyItem[] }`, `type Dataset = { sources; referenceWorks; claims; people; places; territories; journeys; media; stories; timeline }`
  - `fixtures.ts`: `makeDataset(): Dataset` (valid, small)

- [ ] **Step 1: Write the failing tests**

`src/schema/entities.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { Claim, Place, Step, When, I18nText, Media } from "./entities";

describe("schemas", () => {
  it("rejects a claim without citations", () => {
    const r = Claim.safeParse({ id: "x", text: { en: "t" }, grade: "A", citations: [] });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown grade", () => {
    const r = Claim.safeParse({ id: "x", text: { en: "t" }, grade: "F", citations: [{ source: "acts", locator: "1:1" }] });
    expect(r.success).toBe(false);
  });

  it("applies defaults for referenceWorks and alternativeTo", () => {
    const c = Claim.parse({ id: "x", text: { en: "t" }, grade: "B", citations: [{ source: "acts", locator: "1:1" }] });
    expect(c.referenceWorks).toEqual([]);
    expect(c.alternativeTo).toEqual([]);
  });

  it("rejects when.from > when.to", () => {
    expect(When.safeParse({ from: 50, to: 40 }).success).toBe(false);
  });

  it("requires English text", () => {
    expect(I18nText.safeParse({ nl: "alleen Nederlands" }).success).toBe(false);
    expect(I18nText.parse({ en: "Rome", nl: "Rome" })).toEqual({ en: "Rome", nl: "Rome" });
  });

  it("rejects ids that are not kebab-case", () => {
    expect(Place.safeParse({ id: "Jerusalem", name: { ancient: { en: "x" } }, coords: [35, 31], kind: "city" }).success).toBe(false);
  });

  it("rejects coordinates out of range", () => {
    expect(Place.safeParse({ id: "x", name: { ancient: { en: "x" } }, coords: [200, 31], kind: "city" }).success).toBe(false);
  });

  it("requires exactly one of episode or text in a story step", () => {
    const base = { year: 40, camera: { center: [30, 30], zoom: 4 } };
    expect(Step.safeParse(base).success).toBe(false);
    expect(Step.safeParse({ ...base, episode: "a", text: { en: "b" } }).success).toBe(false);
    expect(Step.safeParse({ ...base, text: { en: "b" } }).success).toBe(true);
  });

  it("requires licence and creator on media", () => {
    const r = Media.safeParse({ id: "m", file: "a.jpg", kind: "image", caption: { en: "c" }, role: "illustration", sourceUrl: "https://example.org" });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/schema`
Expected: FAIL — cannot resolve `./entities`.

- [ ] **Step 3: Implement schemas**

`src/schema/common.ts`:
```ts
import { z } from "zod";

export const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ids must be lowercase-kebab-case");

export const LANGS = ["en", "nl"] as const;
export type Lang = (typeof LANGS)[number];

export const I18nText = z.object({ en: z.string().min(1) }).catchall(z.string().min(1));
export type I18nText = z.infer<typeof I18nText>;

export const Grade = z.enum(["A", "B", "C", "D", "E"]);
export type Grade = z.infer<typeof Grade>;
export const GRADES: Grade[] = [...Grade.options];

export const When = z
  .object({ from: z.number().int(), to: z.number().int(), circa: z.boolean().default(false) })
  .refine((w) => w.from <= w.to, { message: "when.from must be <= when.to", path: ["to"] });
export type When = z.infer<typeof When>;

export const LonLat = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);
export type LonLat = z.infer<typeof LonLat>;

export const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "colours are #rrggbb");
```

`src/schema/entities.ts`:
```ts
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
```

`src/model/dataset.ts`:
```ts
import type { Claim, JourneyItem, Media, Person, Place, ReferenceWork, Source, Story, Territory, Timeline } from "../schema/entities";

export type Journey = { person: string; items: JourneyItem[] };

export type Dataset = {
  sources: Source[];
  referenceWorks: ReferenceWork[];
  claims: Claim[];
  people: Person[];
  places: Place[];
  territories: Territory[];
  journeys: Journey[];
  media: Media[];
  stories: Story[];
  timeline: Timeline;
};
```

`src/test/fixtures.ts`:
```ts
import type { Dataset } from "../model/dataset";

/** Small, valid dataset used by unit tests. Mutate the returned copy freely. */
export function makeDataset(): Dataset {
  return {
    sources: [
      { id: "acts", author: "Luke", work: "Acts of the Apostles", written: { from: 60, to: 90, circa: true }, kind: "scripture", locatorUrl: "https://www.biblegateway.com/passage/?search=Acts+{locator}&version=KJV" },
      { id: "irenaeus-ah", author: "Irenaeus", work: "Against Heresies", written: { from: 180, to: 189, circa: true }, kind: "church-writer", url: "https://ccel.org/ccel/schaff/anf01" },
      { id: "historical-basemaps", author: "A. Ourednik", work: "historical-basemaps", written: { from: 2019, to: 2025, circa: false }, kind: "dataset", url: "https://github.com/aourednik/historical-basemaps" },
    ],
    referenceWorks: [{ id: "vreugdenhil", author: "J. Vreugdenhil", title: "Church History for Young and Old", url: "https://defenceofthetruth.com/church-history/church-history-for-young-and-old/" }],
    claims: [
      { id: "c-leg", text: { en: "Paul and Barnabas go down to Seleucia." }, grade: "A", citations: [{ source: "acts", locator: "13:4" }], referenceWorks: [], alternativeTo: [] },
      { id: "c-stay", text: { en: "Paul teaches in Antioch." }, grade: "A", citations: [{ source: "acts", locator: "11:26" }], referenceWorks: [{ work: "vreugdenhil", chapter: "1", quote: "Antioch" }], alternativeTo: [] },
      { id: "c-legend", text: { en: "A later legend." }, grade: "D", citations: [{ source: "irenaeus-ah", locator: "1.1.1" }], referenceWorks: [], alternativeTo: ["c-other"] },
      { id: "c-other", text: { en: "A competing legend." }, grade: "E", citations: [{ source: "irenaeus-ah", locator: "1.1.2" }], referenceWorks: [], alternativeTo: ["c-legend"] },
      { id: "c-rome", text: { en: "Extent of Roman rule." }, grade: "B", citations: [{ source: "irenaeus-ah", locator: "1.1.3" }], referenceWorks: [], alternativeTo: [] },
      { id: "c-start", text: { en: "The Ascension." }, grade: "A", citations: [{ source: "acts", locator: "1:9" }], referenceWorks: [], alternativeTo: [] },
      { id: "c-end", text: { en: "John lives until Trajan." }, grade: "B", citations: [{ source: "irenaeus-ah", locator: "3.3.4" }], referenceWorks: [], alternativeTo: [] },
    ],
    people: [{ id: "paul", name: { en: "Paul" }, role: "apostle", color: "#c0392b" }],
    places: [
      { id: "antioch", name: { ancient: { en: "Antiochia" }, modern: { en: "Antakya" } }, coords: [36.18, 36.22], pleiades: "https://pleiades.stoa.org/places/658381", kind: "city" },
      { id: "seleucia", name: { ancient: { en: "Seleucia Pieria" } }, coords: [35.93, 36.12], pleiades: "https://pleiades.stoa.org/places/658483", kind: "city" },
    ],
    territories: [
      { id: "roman-empire", name: { en: "Roman Empire" }, color: "#b03a2e", versions: [{ when: { from: 30, to: 100, circa: false }, status: "empire", geometry: "roman-empire.geojson", geometrySource: "historical-basemaps", precision: 1, claim: "c-rome" }] },
    ],
    journeys: [
      {
        person: "paul",
        items: [
          { type: "stay", id: "paul-antioch", place: "antioch", when: { from: 44, to: 46, circa: true }, claim: "c-stay", episodes: [{ id: "paul-teaches", title: { en: "Teaching in Antioch" }, text: { en: "A whole year." }, when: { from: 44, to: 45, circa: true }, claim: "c-stay", media: [] }] },
          { type: "leg", id: "paul-to-seleucia", from: "antioch", to: "seleucia", via: [], when: { from: 46, to: 48, circa: true }, mode: "land", claim: "c-leg", episodes: [] },
        ],
      },
    ],
    media: [],
    stories: [{ id: "demo", title: { en: "Demo" }, steps: [{ year: 44, camera: { center: [36.18, 36.22], zoom: 6, bearing: 0 }, highlight: ["antioch"], episode: "paul-teaches" }] }],
    timeline: { start: { year: 30, circa: true, claim: "c-start" }, end: { year: 100, circa: true, claim: "c-end" }, keyEvents: [] },
  };
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/schema && pnpm typecheck`
Expected: all schema tests PASS; typecheck 0 errors (the fixture type-checks against `Dataset`).

- [ ] **Step 5: Commit**

```bash
git add src/schema src/model/dataset.ts src/test/fixtures.ts
git commit -m "feat: add Zod schemas and Dataset type

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Loader (YAML → Dataset, with file-located errors)

**Files:**
- Create: `src/pipeline/errors.ts`, `src/pipeline/load.ts`
- Test: `src/pipeline/load.test.ts`

**Interfaces:**
- Consumes: file schemas from Task 2.
- Produces:
  - `type ValidationError = { file?: string; path: string; message: string }`
  - `formatErrors(errors: ValidationError[]): string` — one line per error: `` `${file ?? "(dataset)"} › ${path || "(root)"}: ${message}` ``
  - `loadDataset(dataDir: string): { dataset: Dataset; errors: ValidationError[] }` — reads `sources/*.yaml`, `places/*.yaml`, `claims/*.yaml`, `journeys/*.yaml`, `stories/*.yaml`, `people.yaml`, `territories.yaml`, `timeline.yaml`, optional `media/media.yaml`. Journey-file claims are appended to `dataset.claims`.

- [ ] **Step 1: Write failing tests**

`src/pipeline/load.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/pipeline/load`
Expected: FAIL — cannot resolve `./load`.

- [ ] **Step 3: Implement**

`src/pipeline/errors.ts`:
```ts
export type ValidationError = { file?: string; path: string; message: string };

export function formatErrors(errors: ValidationError[]): string {
  return errors.map((e) => `${e.file ?? "(dataset)"} › ${e.path || "(root)"}: ${e.message}`).join("\n");
}
```

`src/pipeline/load.ts`:
```ts
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "yaml";
import type { z } from "zod";
import {
  ClaimsFile, JourneyFile, MediaFile, PeopleFile, PlacesFile, SourcesFile, Story, TerritoriesFile, Timeline,
} from "../schema/entities";
import type { Dataset } from "../model/dataset";
import type { ValidationError } from "./errors";

const EMPTY_TIMELINE = { start: { year: 0, circa: true, claim: "missing-timeline" }, end: { year: 0, circa: true, claim: "missing-timeline" }, keyEvents: [] };

export function loadDataset(dataDir: string): { dataset: Dataset; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  const parseFile = <T>(file: string, schema: z.ZodType<T>): T | undefined => {
    const rel = relative(dataDir, file);
    let raw: unknown;
    try {
      raw = parse(readFileSync(file, "utf8"));
    } catch (e) {
      errors.push({ file: rel, path: "", message: `YAML parse error: ${(e as Error).message}` });
      return undefined;
    }
    const r = schema.safeParse(raw);
    if (!r.success) {
      for (const issue of r.error.issues) errors.push({ file: rel, path: issue.path.join("."), message: issue.message });
      return undefined;
    }
    return r.data;
  };

  const many = <T>(sub: string, schema: z.ZodType<T>): T[] => {
    const dir = join(dataDir, sub);
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith(".yaml"))
      .sort()
      .map((f) => parseFile(join(dir, f), schema))
      .filter((x): x is T => x !== undefined);
  };

  const one = <T>(rel: string, schema: z.ZodType<T>, optional = false): T | undefined => {
    const file = join(dataDir, rel);
    if (!existsSync(file)) {
      if (!optional) errors.push({ file: rel, path: "", message: "missing file" });
      return undefined;
    }
    return parseFile(file, schema);
  };

  const sourceFiles = many("sources", SourcesFile);
  const journeyFiles = many("journeys", JourneyFile);

  const dataset: Dataset = {
    sources: sourceFiles.flatMap((f) => f.sources),
    referenceWorks: sourceFiles.flatMap((f) => f.referenceWorks),
    claims: [...many("claims", ClaimsFile).flatMap((f) => f.claims), ...journeyFiles.flatMap((f) => f.claims)],
    people: one("people.yaml", PeopleFile)?.people ?? [],
    places: many("places", PlacesFile).flatMap((f) => f.places),
    territories: one("territories.yaml", TerritoriesFile)?.territories ?? [],
    journeys: journeyFiles.map((f) => ({ person: f.person, items: f.items })),
    media: one("media/media.yaml", MediaFile, true)?.media ?? [],
    stories: many("stories", Story),
    timeline: one("timeline.yaml", Timeline) ?? EMPTY_TIMELINE,
  };
  return { dataset, errors };
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/pipeline/load`
Expected: 5 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pipeline
git commit -m "feat: load YAML data with file-located errors

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Cross-reference validation

**Files:**
- Create: `src/model/walk.ts`, `src/pipeline/validate.ts`
- Test: `src/pipeline/validate.test.ts`

**Interfaces:**
- Consumes: `Dataset`, `makeDataset()`, `ValidationError`.
- Produces:
  - `walk.ts`: `type EpisodeRef = { episode: Episode; parent: JourneyItem; person: string }`, `allEpisodes(ds: Pick<Dataset, "journeys">): EpisodeRef[]`
  - `validate.ts`: `type FileExists = (relPathInsideData: string) => boolean`, `validateReferences(ds: Dataset, fileExists: FileExists): ValidationError[]`

- [ ] **Step 1: Write failing tests**

`src/pipeline/validate.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { validateReferences } from "./validate";
import { makeDataset } from "../test/fixtures";

const always = () => true;
const msgs = (ds = makeDataset(), exists = always) => validateReferences(ds, exists).map((e) => `${e.path}: ${e.message}`);

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
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/pipeline/validate`
Expected: FAIL — cannot resolve `./validate`.

- [ ] **Step 3: Implement**

`src/model/walk.ts`:
```ts
import type { Episode, JourneyItem } from "../schema/entities";
import type { Dataset } from "./dataset";

export type EpisodeRef = { episode: Episode; parent: JourneyItem; person: string };

export function allEpisodes(ds: Pick<Dataset, "journeys">): EpisodeRef[] {
  return ds.journeys.flatMap((j) => j.items.flatMap((item) => item.episodes.map((episode) => ({ episode, parent: item, person: j.person }))));
}
```

`src/pipeline/validate.ts`:
```ts
import type { Dataset } from "../model/dataset";
import { allEpisodes } from "../model/walk";
import type { ValidationError } from "./errors";

export type FileExists = (relPathInsideData: string) => boolean;

export function validateReferences(ds: Dataset, fileExists: FileExists): ValidationError[] {
  const errors: ValidationError[] = [];
  const err = (path: string, message: string) => errors.push({ path, message });

  const kindOf = new Map<string, string>();
  const register = (kind: string, id: string) => {
    const prev = kindOf.get(id);
    if (prev) err(`${kind}:${id}`, `duplicate id "${id}" (already used by a ${prev})`);
    else kindOf.set(id, kind);
  };
  ds.sources.forEach((s) => register("source", s.id));
  ds.referenceWorks.forEach((r) => register("referenceWork", r.id));
  ds.claims.forEach((c) => register("claim", c.id));
  ds.people.forEach((p) => register("person", p.id));
  ds.places.forEach((p) => register("place", p.id));
  ds.territories.forEach((t) => register("territory", t.id));
  ds.media.forEach((m) => register("media", m.id));
  ds.stories.forEach((s) => register("story", s.id));
  ds.journeys.forEach((j) => j.items.forEach((item) => register(item.type, item.id)));
  const episodes = allEpisodes(ds);
  episodes.forEach(({ episode }) => register("episode", episode.id));

  const need = (kind: string, id: string, at: string) => {
    if (kindOf.get(id) !== kind) err(at, `unknown ${kind} "${id}"`);
  };

  const claimsById = new Map(ds.claims.map((c) => [c.id, c]));
  for (const c of ds.claims) {
    c.citations.forEach((ct, i) => need("source", ct.source, `claim:${c.id}.citations.${i}`));
    c.referenceWorks.forEach((r, i) => need("referenceWork", r.work, `claim:${c.id}.referenceWorks.${i}`));
    for (const alt of c.alternativeTo) {
      const other = claimsById.get(alt);
      if (!other) err(`claim:${c.id}.alternativeTo`, `unknown claim "${alt}"`);
      else if (!other.alternativeTo.includes(c.id)) err(`claim:${c.id}.alternativeTo`, `"${alt}" does not list "${c.id}" back (alternativeTo must be symmetric)`);
    }
  }

  for (const p of ds.places) {
    if (!p.pleiades && !p.claim) err(`place:${p.id}`, "a place needs a pleiades URL or a claim");
    if (p.claim) need("claim", p.claim, `place:${p.id}.claim`);
  }

  for (const t of ds.territories) {
    t.versions.forEach((v, i) => {
      const at = `territory:${t.id}.versions.${i}`;
      need("claim", v.claim, `${at}.claim`);
      need("source", v.geometrySource, `${at}.geometrySource`);
      if (v.overlord) need("territory", v.overlord, `${at}.overlord`);
      if (!fileExists(`geo/territories/${v.geometry}`)) err(`${at}.geometry`, `missing file data/geo/territories/${v.geometry}`);
    });
  }

  for (const m of ds.media) {
    if (!fileExists(`media/files/${m.file}`)) err(`media:${m.id}.file`, `missing file data/media/files/${m.file}`);
    if (m.role === "evidence" && !m.claim) err(`media:${m.id}`, "evidence media needs a claim");
    if (m.claim) need("claim", m.claim, `media:${m.id}.claim`);
  }

  for (const j of ds.journeys) {
    need("person", j.person, `journey:${j.person}.person`);
    for (const item of j.items) {
      const at = `${item.type}:${item.id}`;
      need("claim", item.claim, `${at}.claim`);
      if (item.type === "leg") {
        need("place", item.from, `${at}.from`);
        need("place", item.to, `${at}.to`);
      } else {
        need("place", item.place, `${at}.place`);
      }
    }
  }

  for (const { episode } of episodes) {
    need("claim", episode.claim, `episode:${episode.id}.claim`);
    episode.media.forEach((m) => need("media", m, `episode:${episode.id}.media`));
  }

  for (const s of ds.stories) {
    s.steps.forEach((st, i) => {
      const at = `story:${s.id}.steps.${i}`;
      if (st.episode) need("episode", st.episode, `${at}.episode`);
      st.highlight.forEach((h) => {
        if (!kindOf.has(h)) err(`${at}.highlight`, `unknown id "${h}"`);
      });
    });
  }

  need("claim", ds.timeline.start.claim, "timeline.start.claim");
  need("claim", ds.timeline.end.claim, "timeline.end.claim");
  ds.timeline.keyEvents.forEach((k, i) => {
    if (!kindOf.has(k.target)) err(`timeline.keyEvents.${i}.target`, `unknown id "${k.target}"`);
  });

  return errors;
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/pipeline`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/model/walk.ts src/pipeline/validate.ts src/pipeline/validate.test.ts
git commit -m "feat: validate cross-references, sources and media

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Data build CLI, geo fetch, seed data

**Files:**
- Create: `src/pipeline/emit.ts`, `scripts/build-data.ts`, `scripts/fetch-geo.ts`, `scripts/extract-territory.ts`
- Create (data): `data/timeline.yaml`, `data/people.yaml`, `data/territories.yaml`, `data/sources/common.yaml`, `data/places/common.yaml`, `data/claims/common.yaml`, `data/journeys/paul.yaml`, `data/journeys/john.yaml`, `data/stories/demo.yaml`, `data/geo/territories/LICENSE.md`
- Generated + committed: `data/geo/base/land.geojson`, `data/geo/base/rivers.geojson`, `data/geo/territories/roman-empire-100.geojson`, `public/fonts/Noto Sans Regular/*.pbf`
- Test: `src/pipeline/emit.test.ts`

**Interfaces:**
- Consumes: `loadDataset`, `validateReferences`, `formatErrors`.
- Produces:
  - `compileTerritories(ds: Dataset, readGeo: (relPathInsideData: string) => FeatureCollection | Feature): FeatureCollection` — one feature per geometry with properties `{ id, version, from, to, status, precision, color, fillColor, "name:en", "name:nl"? }` (`name:<lang>` for every `LANGS` entry present; `fillColor` = overlord colour for client kingdoms).
  - Output files: `public/data/dataset.json` (the `Dataset`), `public/data/territories.geojson`, `public/data/land.geojson`, `public/data/rivers.geojson`, `public/media/*`.
  - Seed ids that later tasks and e2e tests rely on: places `jerusalem`, `antioch`, `seleucia`, `salamis`, `paphos`, `patmos`, `ephesus`; people `paul`, `john`; legs `paul-antioch-seleucia` (47), `paul-seleucia-salamis` (47), `paul-salamis-paphos` (47); stay `john-patmos`; episode `john-receives-revelation` (claim cites Revelation 1:9); story `demo` with ≥2 steps.

- [ ] **Step 1: Write failing test for compileTerritories**

`src/pipeline/emit.test.ts`:
```ts
import { it, expect } from "vitest";
import type { Feature } from "geojson";
import { compileTerritories } from "./emit";
import { makeDataset } from "../test/fixtures";

const square: Feature = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] } };

it("emits one feature per geometry with time and style properties", () => {
  const ds = makeDataset();
  ds.territories.push({
    id: "judea", name: { en: "Judea", nl: "Judea" }, color: "#2e86c1",
    versions: [{ when: { from: 30, to: 40, circa: false }, status: "client-kingdom", overlord: "roman-empire", geometry: "judea.geojson", geometrySource: "historical-basemaps", precision: 2, claim: "c-rome" }],
  });
  const fc = compileTerritories(ds, () => ({ type: "FeatureCollection", features: [square, square] }));
  expect(fc.features).toHaveLength(4);
  const judea = fc.features.find((f) => f.properties?.id === "judea")!;
  expect(judea.properties).toMatchObject({ from: 30, to: 40, status: "client-kingdom", precision: 2, color: "#2e86c1", fillColor: "#b03a2e", "name:en": "Judea", "name:nl": "Judea" });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/pipeline/emit`
Expected: FAIL — cannot resolve `./emit`.

- [ ] **Step 3: Implement emit + CLI**

`src/pipeline/emit.ts`:
```ts
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Dataset } from "../model/dataset";
import { LANGS } from "../schema/common";

export function compileTerritories(ds: Dataset, readGeo: (relPathInsideData: string) => FeatureCollection | Feature): FeatureCollection {
  const byId = new Map(ds.territories.map((t) => [t.id, t]));
  const features: Feature[] = [];
  for (const t of ds.territories) {
    t.versions.forEach((v, version) => {
      const geo = readGeo(`geo/territories/${v.geometry}`);
      const geometries: Geometry[] = geo.type === "FeatureCollection" ? geo.features.map((f) => f.geometry) : [geo.geometry];
      const overlord = v.overlord ? byId.get(v.overlord) : undefined;
      const names = Object.fromEntries(LANGS.filter((l) => t.name[l]).map((l) => [`name:${l}`, t.name[l]]));
      for (const geometry of geometries) {
        features.push({
          type: "Feature",
          geometry,
          properties: {
            id: t.id, version, from: v.when.from, to: v.when.to, status: v.status, precision: v.precision,
            color: t.color, fillColor: v.status === "client-kingdom" && overlord ? overlord.color : t.color, ...names,
          },
        });
      }
    });
  }
  return { type: "FeatureCollection", features };
}
```

`scripts/build-data.ts`:
```ts
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";
import { validateReferences } from "../src/pipeline/validate";
import { compileTerritories } from "../src/pipeline/emit";
import { formatErrors } from "../src/pipeline/errors";

const ROOT = join(import.meta.dirname, "..");
const DATA = join(ROOT, "data");
const OUT = join(ROOT, "public");

const { dataset, errors } = loadDataset(DATA);
if (errors.length === 0) errors.push(...validateReferences(dataset, (rel) => existsSync(join(DATA, rel))));
if (errors.length > 0) {
  console.error(`✗ data invalid (${errors.length} problem${errors.length === 1 ? "" : "s"}):\n${formatErrors(errors)}`);
  process.exit(1);
}

rmSync(join(OUT, "data"), { recursive: true, force: true });
rmSync(join(OUT, "media"), { recursive: true, force: true });
mkdirSync(join(OUT, "data"), { recursive: true });
writeFileSync(join(OUT, "data/dataset.json"), JSON.stringify(dataset));
const territories = compileTerritories(dataset, (rel) => JSON.parse(readFileSync(join(DATA, rel), "utf8")));
writeFileSync(join(OUT, "data/territories.geojson"), JSON.stringify(territories));
for (const f of ["land.geojson", "rivers.geojson"]) cpSync(join(DATA, "geo/base", f), join(OUT, "data", f));
if (existsSync(join(DATA, "media/files"))) cpSync(join(DATA, "media/files"), join(OUT, "media"), { recursive: true });

console.log(
  `✓ data ok: ${dataset.claims.length} claims, ${dataset.sources.length} sources, ${dataset.places.length} places, ` +
    `${dataset.journeys.length} journeys, ${territories.features.length} territory shapes`,
);
```

`scripts/fetch-geo.ts` (one-off downloads; outputs are committed except `data/geo/raw/`):
```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";
const HB = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const FONT = "https://protomaps.github.io/basemaps-assets/fonts/Noto%20Sans%20Regular";
const RANGES = ["0-255", "256-511", "512-767", "768-1023", "7680-7935", "8192-8447", "8448-8703"];

async function get(url: string): Promise<Buffer> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

async function save(url: string, file: string) {
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, await get(url));
  console.log(`saved ${file}`);
}

await save(`${NE}/ne_50m_land.geojson`, join(ROOT, "data/geo/base/land.geojson"));
await save(`${NE}/ne_50m_rivers_lake_centerlines.geojson`, join(ROOT, "data/geo/base/rivers.geojson"));
await save(`${HB}/world_bc1.geojson`, join(ROOT, "data/geo/raw/world_bc1.geojson"));
await save(`${HB}/world_100.geojson`, join(ROOT, "data/geo/raw/world_100.geojson"));
for (const r of RANGES) await save(`${FONT}/${r}.pbf`, join(ROOT, "public/fonts/Noto Sans Regular", `${r}.pbf`));
```

`scripts/extract-territory.ts`:
```ts
// Usage: tsx scripts/extract-territory.ts <raw-file> "<NAME in historical-basemaps>" <out-file-name>
// Example: tsx scripts/extract-territory.ts world_100 "Roman Empire" roman-empire-100.geojson
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { FeatureCollection } from "geojson";

const [raw, name, out] = process.argv.slice(2);
if (!raw || !name || !out) throw new Error("usage: extract-territory <raw> <NAME> <out.geojson>");
const ROOT = join(import.meta.dirname, "..");
const fc = JSON.parse(readFileSync(join(ROOT, "data/geo/raw", `${raw}.geojson`), "utf8")) as FeatureCollection;
const features = fc.features
  .filter((f) => f.properties?.NAME === name)
  .map((f) => ({ ...f, properties: { hbName: name, hbBorderPrecision: f.properties?.BORDERPRECISION ?? null } }));
if (features.length === 0) throw new Error(`no feature named "${name}" in ${raw}`);
writeFileSync(join(ROOT, "data/geo/territories", out), JSON.stringify({ type: "FeatureCollection", features }));
console.log(`wrote ${features.length} feature(s) to data/geo/territories/${out}`);
```

- [ ] **Step 4: Fetch geo + extract the Roman Empire**

Run:
```bash
pnpm fetch:geo
pnpm tsx scripts/extract-territory.ts world_100 "Roman Empire" roman-empire-100.geojson
ls -la data/geo/base data/geo/territories "public/fonts/Noto Sans Regular"
```
Expected: `land.geojson` ≈ 1.6 MB, `rivers.geojson`, 7 `.pbf` files, `roman-empire-100.geojson` with ≥1 feature. (Uses the system trust store; Node trusts the BrowsePure CA via `NODE_EXTRA_CA_CERTS` — if a fetch fails with a certificate error, check that variable.)

`data/geo/territories/LICENSE.md`:
```markdown
Geometry in this folder is derived from historical-basemaps by A. Ourednik
(https://github.com/aourednik/historical-basemaps), licensed GPL-3.0
(https://www.gnu.org/licenses/gpl-3.0.html). Modifications © the church_history
contributors, same licence.
```

- [ ] **Step 5: Write seed data**

`data/sources/common.yaml`:
```yaml
sources:
  - id: luke
    author: Luke
    work: Gospel of Luke
    written: { from: 60, to: 90, circa: true }
    kind: scripture
    locatorUrl: "https://www.biblegateway.com/passage/?search=Luke+{locator}&version=KJV"
  - id: acts
    author: Luke
    work: Acts of the Apostles
    written: { from: 60, to: 90, circa: true }
    kind: scripture
    locatorUrl: "https://www.biblegateway.com/passage/?search=Acts+{locator}&version=KJV"
  - id: revelation
    author: John
    work: Revelation
    written: { from: 90, to: 96, circa: true }
    kind: scripture
    locatorUrl: "https://www.biblegateway.com/passage/?search=Revelation+{locator}&version=KJV"
  - id: irenaeus-ah
    author: Irenaeus of Lyon
    work: Against Heresies
    written: { from: 180, to: 189, circa: true }
    kind: church-writer
    edition: "ANF vol. 1, tr. Roberts & Rambaut"
    url: "https://ccel.org/ccel/schaff/anf01"
  - id: eusebius-he
    author: Eusebius of Caesarea
    work: Church History (Historia Ecclesiastica)
    written: { from: 313, to: 325, circa: true }
    kind: church-writer
    edition: "NPNF2 vol. 1, tr. McGiffert"
    url: "https://www.newadvent.org/fathers/2501.htm"
  - id: tacitus-annals
    author: Tacitus
    work: Annals
    written: { from: 115, to: 120, circa: true }
    kind: historian
  - id: historical-basemaps
    author: A. Ourednik
    work: historical-basemaps (world_bc1, world_100)
    written: { from: 2019, to: 2025, circa: false }
    kind: dataset
    url: "https://github.com/aourednik/historical-basemaps"
referenceWorks:
  - id: vreugdenhil
    author: J. Vreugdenhil
    title: Church History for Young and Old (Kerkgeschiedenis voor jong en oud)
    url: "https://defenceofthetruth.com/church-history/church-history-for-young-and-old/"
```

`data/claims/common.yaml`:
```yaml
claims:
  - id: ascension
    text: { en: "Jesus is taken up into heaven forty days after the resurrection (AD 30 or 33, depending on the crucifixion date)." }
    when: { from: 30, to: 33, circa: true }
    grade: A
    citations:
      - { source: acts, locator: "1:3" }
      - { source: acts, locator: "1:9" }
      - { source: luke, locator: "3:1", quote: "in the fifteenth year of the reign of Tiberius Caesar" }
    notes: { en: "The year comes from modern chronology built on Luke 3:1 and the Passover calendar; Acts gives no year." }
  - id: john-lives-to-trajan
    text: { en: "John remains at Ephesus until the time of Trajan (from AD 98)." }
    when: { from: 98, to: 100, circa: true }
    grade: B
    citations:
      - { source: irenaeus-ah, locator: "3.3.4" }
      - { source: eusebius-he, locator: "3.23.3-4" }
  - id: roman-rule-extent
    text: { en: "Approximate extent of Roman rule. Geometry is a low-precision outline for c. AD 100." }
    grade: B
    citations:
      - { source: tacitus-annals, locator: "1.11" }
  - id: patmos-island
    text: { en: "Patmos, a small island in the Aegean Sea." }
    grade: A
    citations:
      - { source: revelation, locator: "1:9" }
```

`data/places/common.yaml` (coordinates are the Pleiades representative points):
```yaml
places:
  - { id: jerusalem, name: { ancient: { en: Hierosolyma }, modern: { en: Jerusalem } }, coords: [35.235, 31.777], pleiades: "https://pleiades.stoa.org/places/687928", kind: city }
  - { id: antioch, name: { ancient: { en: Antiochia }, modern: { en: Antakya } }, coords: [36.183, 36.223], pleiades: "https://pleiades.stoa.org/places/658381", kind: city }
  - { id: seleucia, name: { ancient: { en: Seleucia Pieria }, modern: { en: "near Samandağ" } }, coords: [35.929, 36.121], pleiades: "https://pleiades.stoa.org/places/658483", kind: city }
  - { id: salamis, name: { ancient: { en: Salamis }, modern: { en: "near Famagusta" } }, coords: [33.903, 35.180], pleiades: "https://pleiades.stoa.org/places/707617", kind: city }
  - { id: paphos, name: { ancient: { en: Paphos }, modern: { en: Paphos } }, coords: [32.407, 34.757], pleiades: "https://pleiades.stoa.org/places/707586", kind: city }
  - { id: ephesus, name: { ancient: { en: Ephesus }, modern: { en: "near Selçuk" } }, coords: [27.342, 37.940], pleiades: "https://pleiades.stoa.org/places/599612", kind: city }
  - { id: patmos, name: { ancient: { en: Patmos }, modern: { en: Patmos } }, coords: [26.559, 37.328], pleiades: "https://pleiades.stoa.org/places/599872", kind: island }
```

`data/people.yaml`:
```yaml
people:
  - { id: paul, name: { en: Paul }, role: apostle, color: "#c0392b" }
  - { id: john, name: { en: John }, role: apostle, color: "#1f618d" }
```

`data/journeys/paul.yaml`:
```yaml
person: paul
claims:
  - id: paul-sent-from-antioch
    text: { en: "Sent out by the Holy Spirit, Barnabas and Saul go down to Seleucia and sail to Cyprus." }
    when: { from: 46, to: 48, circa: true }
    grade: A
    citations:
      - { source: acts, locator: "13:2-4" }
  - id: paul-salamis-to-paphos
    text: { en: "They preach in the synagogues at Salamis and cross the whole island to Paphos." }
    when: { from: 46, to: 48, circa: true }
    grade: A
    citations:
      - { source: acts, locator: "13:5-6" }
items:
  - { type: leg, id: paul-antioch-seleucia, from: antioch, to: seleucia, when: { from: 47, to: 47, circa: true }, mode: land, claim: paul-sent-from-antioch }
  - { type: leg, id: paul-seleucia-salamis, from: seleucia, to: salamis, when: { from: 47, to: 47, circa: true }, mode: sea, claim: paul-sent-from-antioch }
  - { type: leg, id: paul-salamis-paphos, from: salamis, to: paphos, when: { from: 47, to: 47, circa: true }, mode: land, claim: paul-salamis-to-paphos }
```

`data/journeys/john.yaml`:
```yaml
person: john
claims:
  - id: john-on-patmos
    text: { en: "John is on the island of Patmos \"for the word of God and for the testimony of Jesus\"." }
    grade: A
    citations:
      - { source: revelation, locator: "1:9" }
  - id: john-patmos-under-domitian
    text: { en: "The Revelation was seen near the end of Domitian's reign (Domitian ruled AD 81–96)." }
    when: { from: 95, to: 96, circa: true }
    grade: B
    citations:
      - { source: irenaeus-ah, locator: "5.30.3" }
      - { source: eusebius-he, locator: "3.18.1-3" }
items:
  - type: stay
    id: john-patmos
    place: patmos
    when: { from: 95, to: 96, circa: true }
    claim: john-on-patmos
    episodes:
      - id: john-receives-revelation
        title: { en: "The Revelation on Patmos" }
        text: { en: "On the Lord's day John sees the risen Christ and is told to write what he sees to seven churches in Asia." }
        when: { from: 95, to: 96, circa: true }
        claim: john-on-patmos
      - id: john-banished-under-domitian
        title: { en: "Banished under Domitian" }
        text: { en: "Irenaeus, writing around 180, dates the vision to the end of Domitian's reign." }
        when: { from: 95, to: 96, circa: true }
        claim: john-patmos-under-domitian
```

`data/territories.yaml`:
```yaml
territories:
  - id: roman-empire
    name: { en: Roman Empire }
    color: "#b03a2e"
    versions:
      - { when: { from: 30, to: 100 }, status: empire, geometry: roman-empire-100.geojson, geometrySource: historical-basemaps, precision: 1, claim: roman-rule-extent }
```

`data/timeline.yaml`:
```yaml
start: { year: 30, circa: true, claim: ascension }
end: { year: 100, circa: true, claim: john-lives-to-trajan }
keyEvents:
  - { year: 47, label: { en: "Paul's first journey" }, target: paul-antioch-seleucia }
  - { year: 95, label: { en: "John on Patmos" }, target: john-patmos }
```

`data/stories/demo.yaml`:
```yaml
id: demo
title: { en: "Demo story" }
steps:
  - year: 30
    camera: { center: [35.2, 31.8], zoom: 5 }
    highlight: [jerusalem]
    text: { en: "Jerusalem, around AD 30: the apostles wait for the Spirit." }
    notes: { en: "Ask: where would you go first?" }
  - year: 47
    camera: { center: [34.5, 35.5], zoom: 6 }
    highlight: [paul-seleucia-salamis]
    text: { en: "AD 47: Barnabas and Saul sail to Cyprus." }
  - year: 95
    camera: { center: [26.56, 37.33], zoom: 8 }
    episode: john-receives-revelation
```

- [ ] **Step 6: Run the pipeline**

Run: `pnpm data && pnpm test`
Expected: `✓ data ok: …` and `public/data/dataset.json` exists; all tests pass. Then break it on purpose to confirm the gate: change `revelation` to `revelatoin` in `data/journeys/john.yaml`, run `pnpm data`, expect exit 1 with `claim:john-on-patmos.citations.0: unknown source "revelatoin"`; revert.

- [ ] **Step 7: Commit**

```bash
git add src/pipeline/emit.ts src/pipeline/emit.test.ts scripts data public/fonts
git commit -m "feat: data build pipeline, base geography and seed data

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Pure model — time, grades, routes, index, detail, search, focus

**Files:**
- Create: `src/model/time.ts`, `src/model/grades.ts`, `src/model/routes.ts`, `src/model/index.ts`, `src/model/detail.ts`, `src/model/search.ts`, `src/model/focus.ts`, `src/i18n/tx.ts`
- Test: `src/model/time.test.ts`, `src/model/routes.test.ts`, `src/model/detail.test.ts`, `src/model/search.test.ts`, `src/i18n/tx.test.ts`

**Interfaces:**
- Consumes: `Dataset`, schema types, `allEpisodes`, `makeDataset`.
- Produces:
  - `time.ts`: `isActive(when: { from: number; to: number }, year: number): boolean`; `clampYear(year: number, min: number, max: number): number`
  - `grades.ts`: `GRADE_DASH: Record<Grade, number[] | null>` (A → `null` = solid)
  - `routes.ts`: `type Coord = [number, number]`; `legProgress(when, year): number` (0..1); `legCoords(leg: Leg, places: Map<string, Place>): Coord[]`; `splitLine(coords: Coord[], fraction: number): { done: Coord[]; remaining: Coord[] }`
  - `index.ts`: `type Index = { claims; sources; referenceWorks; people; places; territories; media: Map<string, X>; legs: Map<string, { leg: Leg; person: string }>; stays: Map<string, { stay: Stay; person: string }>; episodes: Map<string, EpisodeRef>; stories: Map<string, Story>; placeRank: Map<string, number> }`; `buildIndex(ds: Dataset): Index`
  - `tx.ts`: `tx(text: I18nText | undefined, lang: string): string` (fallback to `en`, then `""`); `joinText(a: I18nText, sep: string, b: I18nText): I18nText`
  - `detail.ts`: `type ClaimView = { claim: Claim; citations: { source: Source; locator: string; quote?: string; href?: string }[]; mentions: { work: ReferenceWork; chapter: string; quote?: string }[]; alternatives: Claim[] }`; `type EntityKind = "leg" | "stay" | "episode" | "place" | "territory" | "claim"`; `type EntityDetail = { id: string; kind: EntityKind; title: I18nText; when?: When; person?: string; claims: ClaimView[]; episodes: Episode[]; media: Media[] }`; `claimView(id: string, idx: Index): ClaimView | null`; `describeEntity(id: string, idx: Index): EntityDetail | null`
  - `search.ts`: `type SearchResult = { id: string; kind: "person" | "place" | "episode"; label: string }`; `searchEntities(query: string, ds: Dataset, idx: Index, lang: string, limit?: number): SearchResult[]`
  - `focus.ts`: `type Camera = { center: [number, number]; zoom: number; bearing: number }`; `DEFAULT_CAMERA: Camera`; `focusFor(id: string, idx: Index): Camera | null`; `startYearFor(id: string, idx: Index): number | null`

- [ ] **Step 1: Write failing tests**

`src/model/time.test.ts`:
```ts
import { it, expect } from "vitest";
import { isActive, clampYear } from "./time";

it("is active on both boundary years", () => {
  expect(isActive({ from: 46, to: 48 }, 46)).toBe(true);
  expect(isActive({ from: 46, to: 48 }, 48)).toBe(true);
  expect(isActive({ from: 46, to: 48 }, 45)).toBe(false);
  expect(isActive({ from: 47, to: 47 }, 47)).toBe(true);
});

it("clamps years", () => {
  expect(clampYear(10, 30, 100)).toBe(30);
  expect(clampYear(120, 30, 100)).toBe(100);
  expect(clampYear(51.6, 30, 100)).toBe(52);
});
```

`src/model/routes.test.ts`:
```ts
import { it, expect } from "vitest";
import { legProgress, splitLine, legCoords } from "./routes";
import { buildIndex } from "./index";
import { makeDataset } from "../test/fixtures";

it("computes progress inclusive of boundary years", () => {
  const w = { from: 46, to: 48 };
  expect(legProgress(w, 45)).toBe(0);
  expect(legProgress(w, 46)).toBeCloseTo(1 / 3);
  expect(legProgress(w, 48)).toBe(1);
  expect(legProgress(w, 60)).toBe(1);
  expect(legProgress({ from: 47, to: 47 }, 47)).toBe(1);
  expect(legProgress({ from: 47, to: 47 }, 46)).toBe(0);
});

it("splits a line at a fraction of its length", () => {
  expect(splitLine([[0, 0], [2, 0]], 0.5)).toEqual({ done: [[0, 0], [1, 0]], remaining: [[1, 0], [2, 0]] });
  expect(splitLine([[0, 0], [1, 0], [1, 1]], 0.75)).toEqual({ done: [[0, 0], [1, 0], [1, 0.5]], remaining: [[1, 0.5], [1, 1]] });
  expect(splitLine([[0, 0], [2, 0]], 0)).toEqual({ done: [], remaining: [[0, 0], [2, 0]] });
  expect(splitLine([[0, 0], [2, 0]], 1)).toEqual({ done: [[0, 0], [2, 0]], remaining: [] });
});

it("builds leg coordinates from places and waypoints", () => {
  const ds = makeDataset();
  const idx = buildIndex(ds);
  const leg = idx.legs.get("paul-to-seleucia")!.leg;
  expect(legCoords({ ...leg, via: [[36, 36.1]] }, idx.places)).toEqual([[36.18, 36.22], [36, 36.1], [35.93, 36.12]]);
});
```

`src/i18n/tx.test.ts`:
```ts
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
```

`src/model/detail.test.ts`:
```ts
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
```

`src/model/search.test.ts`:
```ts
import { it, expect } from "vitest";
import { searchEntities } from "./search";
import { buildIndex } from "./index";
import { focusFor, startYearFor } from "./focus";
import { makeDataset } from "../test/fixtures";

const ds = makeDataset();
const idx = buildIndex(ds);

it("finds places by ancient or modern name, ignoring case and accents", () => {
  expect(searchEntities("antakya", ds, idx, "en").map((r) => r.id)).toEqual(["antioch"]);
  expect(searchEntities("SÉLEU", ds, idx, "en").map((r) => r.id)).toEqual(["seleucia"]);
});

it("finds people and episodes, ignores 1-letter queries", () => {
  expect(searchEntities("paul", ds, idx, "en")[0]).toEqual({ id: "paul", kind: "person", label: "Paul" });
  expect(searchEntities("teaching", ds, idx, "en").map((r) => r.id)).toEqual(["paul-teaches"]);
  expect(searchEntities("a", ds, idx, "en")).toEqual([]);
});

it("focuses on places, stays, episodes and leg midpoints", () => {
  expect(focusFor("antioch", idx)).toEqual({ center: [36.18, 36.22], zoom: 7, bearing: 0 });
  expect(focusFor("paul-teaches", idx)).toEqual({ center: [36.18, 36.22], zoom: 7, bearing: 0 });
  expect(focusFor("paul-to-seleucia", idx)!.zoom).toBe(5);
  expect(focusFor("roman-empire", idx)).toBeNull();
  expect(startYearFor("paul-to-seleucia", idx)).toBe(46);
  expect(startYearFor("antioch", idx)).toBeNull();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/model src/i18n`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/model/time.ts`:
```ts
export function isActive(when: { from: number; to: number }, year: number): boolean {
  return when.from <= year && year <= when.to;
}

export function clampYear(year: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(year)));
}
```

`src/model/grades.ts`:
```ts
import type { Grade } from "../schema/common";

/** MapLibre line-dasharray per grade; null = solid. Colour never carries reliability. */
export const GRADE_DASH: Record<Grade, number[] | null> = {
  A: null,
  B: [6, 3],
  C: [3, 3],
  D: [0.5, 2.5],
  E: [0.5, 6],
};
```

`src/model/routes.ts`:
```ts
import type { Leg, Place } from "../schema/entities";

export type Coord = [number, number];

export function legProgress(when: { from: number; to: number }, year: number): number {
  if (year < when.from) return 0;
  if (year >= when.to) return 1;
  return (year - when.from + 1) / (when.to - when.from + 1);
}

export function legCoords(leg: Leg, places: Map<string, Place>): Coord[] {
  const from = places.get(leg.from);
  const to = places.get(leg.to);
  if (!from || !to) throw new Error(`leg ${leg.id}: unknown place`);
  return [from.coords, ...leg.via, to.coords];
}

export function splitLine(coords: Coord[], fraction: number): { done: Coord[]; remaining: Coord[] } {
  if (fraction <= 0) return { done: [], remaining: coords };
  if (fraction >= 1) return { done: coords, remaining: [] };
  const seg = coords.slice(1).map((c, i) => Math.hypot(c[0] - coords[i][0], c[1] - coords[i][1]));
  let target = seg.reduce((a, b) => a + b, 0) * fraction;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const t = seg[i] === 0 ? 0 : target / seg[i];
      const a = coords[i];
      const b = coords[i + 1];
      const p: Coord = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      return { done: [...coords.slice(0, i + 1), p], remaining: [p, ...coords.slice(i + 1)] };
    }
    target -= seg[i];
  }
  return { done: coords, remaining: [] };
}
```

`src/model/index.ts`:
```ts
import type { Claim, Leg, Media, Person, Place, ReferenceWork, Source, Stay, Story, Territory } from "../schema/entities";
import type { Dataset } from "./dataset";
import { allEpisodes, type EpisodeRef } from "./walk";

export type Index = {
  claims: Map<string, Claim>;
  sources: Map<string, Source>;
  referenceWorks: Map<string, ReferenceWork>;
  people: Map<string, Person>;
  places: Map<string, Place>;
  territories: Map<string, Territory>;
  media: Map<string, Media>;
  legs: Map<string, { leg: Leg; person: string }>;
  stays: Map<string, { stay: Stay; person: string }>;
  episodes: Map<string, EpisodeRef>;
  stories: Map<string, Story>;
  /** How many legs/stays touch a place — used to prioritise labels. */
  placeRank: Map<string, number>;
};

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));

export function buildIndex(ds: Dataset): Index {
  const legs = new Map<string, { leg: Leg; person: string }>();
  const stays = new Map<string, { stay: Stay; person: string }>();
  const placeRank = new Map<string, number>();
  const bump = (id: string) => placeRank.set(id, (placeRank.get(id) ?? 0) + 1);
  for (const j of ds.journeys) {
    for (const item of j.items) {
      if (item.type === "leg") {
        legs.set(item.id, { leg: item, person: j.person });
        bump(item.from);
        bump(item.to);
      } else {
        stays.set(item.id, { stay: item, person: j.person });
        bump(item.place);
      }
    }
  }
  return {
    claims: byId(ds.claims),
    sources: byId(ds.sources),
    referenceWorks: byId(ds.referenceWorks),
    people: byId(ds.people),
    places: byId(ds.places),
    territories: byId(ds.territories),
    media: byId(ds.media),
    legs,
    stays,
    episodes: new Map(allEpisodes(ds).map((e) => [e.episode.id, e])),
    stories: byId(ds.stories),
    placeRank,
  };
}
```

`src/i18n/tx.ts`:
```ts
import type { I18nText } from "../schema/common";

export function tx(text: I18nText | undefined, lang: string): string {
  if (!text) return "";
  return text[lang] ?? text.en ?? "";
}

export function joinText(a: I18nText, sep: string, b: I18nText): I18nText {
  const langs = new Set([...Object.keys(a), ...Object.keys(b)]);
  return Object.fromEntries([...langs].map((l) => [l, `${tx(a, l)}${sep}${tx(b, l)}`])) as I18nText;
}
```

`src/model/detail.ts`:
```ts
import type { I18nText, When } from "../schema/common";
import type { Claim, Episode, Media, ReferenceWork, Source } from "../schema/entities";
import { joinText } from "../i18n/tx";
import type { Index } from "./index";

export type ClaimView = {
  claim: Claim;
  citations: { source: Source; locator: string; quote?: string; href?: string }[];
  mentions: { work: ReferenceWork; chapter: string; quote?: string }[];
  alternatives: Claim[];
};
export type EntityKind = "leg" | "stay" | "episode" | "place" | "territory" | "claim";
export type EntityDetail = {
  id: string; kind: EntityKind; title: I18nText; when?: When; person?: string;
  claims: ClaimView[]; episodes: Episode[]; media: Media[];
};

export function claimView(id: string, idx: Index): ClaimView | null {
  const claim = idx.claims.get(id);
  if (!claim) return null;
  return {
    claim,
    citations: claim.citations.map((c) => {
      const source = idx.sources.get(c.source)!;
      const href = source.locatorUrl ? source.locatorUrl.replace("{locator}", encodeURIComponent(c.locator)) : source.url;
      return { source, locator: c.locator, quote: c.quote, href };
    }),
    mentions: claim.referenceWorks.map((r) => ({ work: idx.referenceWorks.get(r.work)!, chapter: r.chapter, quote: r.quote })),
    alternatives: claim.alternativeTo.map((a) => idx.claims.get(a)).filter((c): c is Claim => !!c),
  };
}

const views = (ids: (string | undefined)[], idx: Index) =>
  ids.map((id) => (id ? claimView(id, idx) : null)).filter((v): v is ClaimView => !!v);

export function describeEntity(id: string, idx: Index): EntityDetail | null {
  const leg = idx.legs.get(id);
  if (leg) {
    const from = idx.places.get(leg.leg.from)!;
    const to = idx.places.get(leg.leg.to)!;
    return { id, kind: "leg", title: joinText(from.name.ancient, " → ", to.name.ancient), when: leg.leg.when, person: leg.person, claims: views([leg.leg.claim], idx), episodes: leg.leg.episodes, media: [] };
  }
  const stay = idx.stays.get(id);
  if (stay) {
    const place = idx.places.get(stay.stay.place)!;
    return { id, kind: "stay", title: place.name.ancient, when: stay.stay.when, person: stay.person, claims: views([stay.stay.claim], idx), episodes: stay.stay.episodes, media: [] };
  }
  const ep = idx.episodes.get(id);
  if (ep) {
    const media = ep.episode.media.map((m) => idx.media.get(m)).filter((m): m is Media => !!m);
    return { id, kind: "episode", title: ep.episode.title, when: ep.episode.when, person: ep.person, claims: views([ep.episode.claim], idx), episodes: [], media };
  }
  const place = idx.places.get(id);
  if (place) return { id, kind: "place", title: place.name.ancient, claims: views([place.claim], idx), episodes: [], media: [] };
  const territory = idx.territories.get(id);
  if (territory) {
    const claimIds = [...new Set(territory.versions.map((v) => v.claim))];
    return { id, kind: "territory", title: territory.name, claims: views(claimIds, idx), episodes: [], media: [] };
  }
  const claim = idx.claims.get(id);
  if (claim) return { id, kind: "claim", title: claim.text, when: claim.when, claims: views([id], idx), episodes: [], media: [] };
  return null;
}
```

`src/model/search.ts`:
```ts
import { tx } from "../i18n/tx";
import type { Dataset } from "./dataset";
import type { Index } from "./index";

export type SearchResult = { id: string; kind: "person" | "place" | "episode"; label: string };

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function searchEntities(query: string, ds: Dataset, idx: Index, lang: string, limit = 8): SearchResult[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  const all: SearchResult[] = [
    ...ds.people.map((p) => ({ id: p.id, kind: "person" as const, label: tx(p.name, lang) })),
    ...ds.places.map((p) => ({ id: p.id, kind: "place" as const, label: p.name.modern ? `${tx(p.name.ancient, lang)} / ${tx(p.name.modern, lang)}` : tx(p.name.ancient, lang) })),
    ...[...idx.episodes.values()].map((e) => ({ id: e.episode.id, kind: "episode" as const, label: tx(e.episode.title, lang) })),
  ];
  return all
    .filter((r) => norm(r.label).includes(q))
    .sort((a, b) => Number(!norm(a.label).startsWith(q)) - Number(!norm(b.label).startsWith(q)) || a.label.localeCompare(b.label))
    .slice(0, limit);
}
```

`src/model/focus.ts`:
```ts
import type { Index } from "./index";

export type Camera = { center: [number, number]; zoom: number; bearing: number };

/** Frames Rome, Ethiopia/Meroë and South India at once. */
export const DEFAULT_CAMERA: Camera = { center: [48, 22], zoom: 2.4, bearing: 0 };

const at = (center: [number, number], zoom: number): Camera => ({ center, zoom, bearing: 0 });

export function focusFor(id: string, idx: Index): Camera | null {
  const place = (pid: string) => idx.places.get(pid)?.coords ?? null;
  const legMid = (from: string, to: string): Camera | null => {
    const a = place(from);
    const b = place(to);
    return a && b ? at([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], 5) : null;
  };
  const p = place(id);
  if (p) return at(p, 7);
  const stay = idx.stays.get(id);
  if (stay) return at(place(stay.stay.place)!, 7);
  const leg = idx.legs.get(id);
  if (leg) return legMid(leg.leg.from, leg.leg.to);
  const ep = idx.episodes.get(id);
  if (ep) return ep.parent.type === "stay" ? at(place(ep.parent.place)!, 7) : legMid(ep.parent.from, ep.parent.to);
  return null;
}

export function startYearFor(id: string, idx: Index): number | null {
  return idx.legs.get(id)?.leg.when.from ?? idx.stays.get(id)?.stay.when.from ?? idx.episodes.get(id)?.episode.when.from ?? idx.claims.get(id)?.when?.from ?? null;
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/model src/i18n && pnpm typecheck`
Expected: all PASS, typecheck clean.

- [ ] **Step 5: Commit**

```bash
git add src/model src/i18n/tx.ts src/i18n/tx.test.ts
git commit -m "feat: pure model for time, routes, detail lookup and search

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: i18n setup, URL state, app reducer

**Files:**
- Create: `src/i18n/index.ts`, `src/i18n/locales/en.json`, `src/state/urlState.ts`, `src/state/store.ts`
- Test: `src/state/urlState.test.ts`, `src/state/store.test.ts`

**Interfaces:**
- Consumes: `GRADES`, `LANGS`, `Grade`, `Camera`, `clampYear`.
- Produces:
  - `initI18n(): void`; i18next keys listed in `en.json` below (components use exactly these).
  - `urlState.ts`: `type ThemeName = "default" | "projector"`; `type Filters = { people: string[] | null; grades: Grade[] }` (`null` = all people); `type UrlState = { year: number; camera: Camera | null; selected: string | null; filters: Filters; lang: string; theme: ThemeName; story: string | null; step: number }`; `defaultUrlState(startYear: number): UrlState`; `parseUrlState(search: string, d: UrlState, range: { min: number; max: number }): UrlState`; `serializeUrlState(s: UrlState, d: UrlState): string` (`""` or `"?…"`)
  - `store.ts`: `type AppState = UrlState & { mode: "explore" | "story"; showNotes: boolean; highlight: string[]; flyRequest: { camera: Camera; seq: number } | null }`; `type Action` (union below); `reducer(state: AppState, action: Action): AppState`; `initialAppState(url: UrlState): AppState`

- [ ] **Step 1: Write failing tests**

`src/state/urlState.test.ts`:
```ts
import { it, expect } from "vitest";
import { defaultUrlState, parseUrlState, serializeUrlState } from "./urlState";

const d = defaultUrlState(30);
const range = { min: 30, max: 100 };

it("round-trips a full state", () => {
  const s = { ...d, year: 51, camera: { center: [22.9, 37.9] as [number, number], zoom: 6.5, bearing: 0 }, selected: "paul-corinth", filters: { people: ["paul", "thomas"], grades: ["A", "B"] as ("A" | "B")[] }, theme: "projector" as const, story: "youth-1", step: 3 };
  expect(parseUrlState(serializeUrlState(s, d), d, range)).toEqual(s);
});

it("serializes defaults to an empty string", () => {
  expect(serializeUrlState(d, d)).toBe("");
});

it("ignores garbage and clamps the year", () => {
  const s = parseUrlState("?y=abc&c=999,999,99&g=xyz&lang=klingon&theme=neon&step=-4&sel=Not An Id", d, range);
  expect(s).toEqual({ ...d, filters: { people: null, grades: [] } });
  expect(parseUrlState("?y=2000", d, range).year).toBe(100);
  expect(parseUrlState("?y=-5", d, range).year).toBe(30);
});
```

`src/state/store.test.ts`:
```ts
import { it, expect } from "vitest";
import { reducer, initialAppState } from "./store";
import { defaultUrlState } from "./urlState";

const s0 = initialAppState(defaultUrlState(30));

it("toggles a person out of 'all' and back", () => {
  const s1 = reducer(s0, { type: "togglePerson", id: "paul", all: ["paul", "john"] });
  expect(s1.filters.people).toEqual(["john"]);
  const s2 = reducer(s1, { type: "togglePerson", id: "paul", all: ["paul", "john"] });
  expect(s2.filters.people).toBeNull();
});

it("toggles grades keeping A–E order", () => {
  const s1 = reducer(s0, { type: "toggleGrade", grade: "C" });
  expect(s1.filters.grades).toEqual(["A", "B", "D", "E"]);
  expect(reducer(s1, { type: "toggleGrade", grade: "C" }).filters.grades).toEqual(["A", "B", "C", "D", "E"]);
});

it("focus selects, sets year and requests a camera flight", () => {
  const cam = { center: [26.5, 37.3] as [number, number], zoom: 7, bearing: 0 };
  const s1 = reducer(s0, { type: "focus", id: "john-patmos", camera: cam, year: 95 });
  expect(s1).toMatchObject({ selected: "john-patmos", year: 95, flyRequest: { camera: cam, seq: 1 } });
  const s2 = reducer(s1, { type: "focus", id: "x", camera: null, year: null });
  expect(s2).toMatchObject({ selected: "x", year: 95, flyRequest: { seq: 1 } });
});

it("story: start, step, exit keeps position, resume", () => {
  const cam = { center: [35, 31] as [number, number], zoom: 5, bearing: 0 };
  let s = reducer(s0, { type: "startStory", id: "demo" });
  expect(s).toMatchObject({ mode: "story", story: "demo", step: 0 });
  s = reducer(s, { type: "gotoStep", step: 2, camera: cam, selected: "e1", highlight: ["jerusalem"] });
  expect(s).toMatchObject({ step: 2, selected: "e1", highlight: ["jerusalem"], flyRequest: { camera: cam } });
  s = reducer(s, { type: "exitStory" });
  expect(s).toMatchObject({ mode: "explore", story: "demo", step: 2 });
  expect(reducer(s, { type: "resumeStory" }).mode).toBe("story");
  expect(reducer(s, { type: "closeStory" })).toMatchObject({ mode: "explore", story: null, step: 0, highlight: [] });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/state`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/i18n/locales/en.json`:
```json
{
  "app": { "title": "Apostles Map", "loading": "Loading map…", "loadError": "Could not load the map data." },
  "year": { "exact": "{{year}} AD", "circa": "c. {{year}} AD" },
  "slider": { "label": "Year", "play": "Play", "pause": "Pause" },
  "filters": { "title": "Filters", "people": "People", "grades": "Reliability" },
  "grade": {
    "A": "A — New Testament or archaeology",
    "B": "B — Early writers (within ~150 years)",
    "C": "C — Later church writers",
    "D": "D — Apocryphal acts and legend",
    "E": "E — Local tradition"
  },
  "legend": { "title": "Reliability" },
  "detail": {
    "close": "Close",
    "sources": "Sources",
    "alsoToldBy": "Also told by {{author}}, ch. {{chapter}}",
    "alternatives": "Competing traditions",
    "episodes": "What happened here",
    "notes": "Note"
  },
  "media": { "illustration": "Illustration — not evidence", "evidence": "Evidence", "credit": "{{creator}}, {{licence}}" },
  "search": { "placeholder": "Search a place, person or story…", "noResults": "No results" },
  "story": { "start": "Stories", "exit": "Explore", "back": "Back to story", "close": "End story", "step": "{{n}} / {{total}}", "next": "Next", "prev": "Previous" },
  "settings": { "language": "Language", "theme": "Display", "themeDefault": "Screen", "themeProjector": "Projector", "copyStep": "Copy as story step", "copied": "Copied" },
  "attribution": { "open": "Sources & attribution", "title": "Sources & attribution", "close": "Close" }
}
```

`src/i18n/index.ts`:
```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

export function initI18n(): void {
  if (i18n.isInitialized) return;
  void i18n.use(initReactI18next).init({
    resources: { en: { translation: en } },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}
```

`src/state/urlState.ts`:
```ts
import { GRADES, LANGS, type Grade } from "../schema/common";
import type { Camera } from "../model/focus";
import { clampYear } from "../model/time";

export type ThemeName = "default" | "projector";
export type Filters = { people: string[] | null; grades: Grade[] };
export type UrlState = {
  year: number; camera: Camera | null; selected: string | null; filters: Filters;
  lang: string; theme: ThemeName; story: string | null; step: number;
};

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const id = (v: string | null) => (v !== null && ID.test(v) ? v : null);
const num = (v: string | null) => {
  if (v === null || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function defaultUrlState(startYear: number): UrlState {
  return { year: startYear, camera: null, selected: null, filters: { people: null, grades: [...GRADES] }, lang: "en", theme: "default", story: null, step: 0 };
}

export function parseUrlState(search: string, d: UrlState, range: { min: number; max: number }): UrlState {
  const q = new URLSearchParams(search);
  const year = num(q.get("y"));
  const c = q.get("c")?.split(",").map(Number);
  const cameraOk = !!c && c.length >= 3 && c.every(Number.isFinite) && Math.abs(c[0]) <= 180 && Math.abs(c[1]) <= 90 && c[2] >= 0 && c[2] <= 22;
  const g = q.get("g");
  const p = q.get("p");
  const lang = q.get("lang");
  const theme = q.get("theme");
  const step = num(q.get("step"));
  return {
    year: year === null ? d.year : clampYear(year, range.min, range.max),
    camera: cameraOk ? { center: [c![0], c![1]], zoom: c![2], bearing: c![3] ?? 0 } : d.camera,
    selected: id(q.get("sel")) ?? d.selected,
    filters: {
      people: p === null ? d.filters.people : p.split(",").filter((x) => ID.test(x)),
      grades: g === null ? d.filters.grades : GRADES.filter((gr) => g.toUpperCase().includes(gr)),
    },
    lang: lang && (LANGS as readonly string[]).includes(lang) ? lang : d.lang,
    theme: theme === "projector" || theme === "default" ? theme : d.theme,
    story: id(q.get("story")) ?? d.story,
    step: step === null || step < 0 ? d.step : Math.floor(step),
  };
}

export function serializeUrlState(s: UrlState, d: UrlState): string {
  const q = new URLSearchParams();
  if (s.year !== d.year) q.set("y", String(s.year));
  if (s.camera) q.set("c", [s.camera.center[0], s.camera.center[1], s.camera.zoom, s.camera.bearing].map((n) => +n.toFixed(3)).join(","));
  if (s.selected) q.set("sel", s.selected);
  if (s.filters.people !== null) q.set("p", s.filters.people.join(","));
  if (s.filters.grades.join("") !== d.filters.grades.join("")) q.set("g", s.filters.grades.join(""));
  if (s.lang !== d.lang) q.set("lang", s.lang);
  if (s.theme !== d.theme) q.set("theme", s.theme);
  if (s.story) {
    q.set("story", s.story);
    q.set("step", String(s.step));
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}
```

Note on the round-trip test: `s.camera.bearing` 0 serializes as `0` and parses back as `0`; `step` is only serialized when a story is set, which the round-trip state has.

`src/state/store.ts`:
```ts
import { GRADES, type Grade } from "../schema/common";
import type { Camera } from "../model/focus";
import type { ThemeName, UrlState } from "./urlState";

export type AppState = UrlState & {
  mode: "explore" | "story";
  showNotes: boolean;
  highlight: string[];
  flyRequest: { camera: Camera; seq: number } | null;
};

export type Action =
  | { type: "setYear"; year: number }
  | { type: "select"; id: string | null }
  | { type: "focus"; id: string; camera: Camera | null; year: number | null }
  | { type: "cameraMoved"; camera: Camera }
  | { type: "togglePerson"; id: string; all: string[] }
  | { type: "onlyPerson"; id: string }
  | { type: "toggleGrade"; grade: Grade }
  | { type: "setLang"; lang: string }
  | { type: "setTheme"; theme: ThemeName }
  | { type: "startStory"; id: string }
  | { type: "gotoStep"; step: number; camera: Camera; selected: string | null; highlight: string[] }
  | { type: "exitStory" }
  | { type: "resumeStory" }
  | { type: "closeStory" }
  | { type: "toggleNotes" };

export function initialAppState(url: UrlState): AppState {
  return { ...url, mode: url.story ? "story" : "explore", showNotes: false, highlight: [], flyRequest: null };
}

const fly = (s: AppState, camera: Camera) => ({ camera, seq: (s.flyRequest?.seq ?? 0) + 1 });

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "setYear":
      return { ...s, year: a.year };
    case "select":
      return { ...s, selected: a.id, highlight: [] };
    case "focus":
      return { ...s, selected: a.id, highlight: [], year: a.year ?? s.year, flyRequest: a.camera ? fly(s, a.camera) : s.flyRequest };
    case "cameraMoved":
      return { ...s, camera: a.camera };
    case "togglePerson": {
      const current = s.filters.people ?? a.all;
      const next = current.includes(a.id) ? current.filter((p) => p !== a.id) : [...current, a.id];
      const isAll = a.all.every((p) => next.includes(p));
      return { ...s, filters: { ...s.filters, people: isAll ? null : next } };
    }
    case "onlyPerson":
      return { ...s, filters: { ...s.filters, people: [a.id] } };
    case "toggleGrade": {
      const has = s.filters.grades.includes(a.grade);
      const grades = GRADES.filter((g) => (g === a.grade ? !has : s.filters.grades.includes(g)));
      return { ...s, filters: { ...s.filters, grades } };
    }
    case "setLang":
      return { ...s, lang: a.lang };
    case "setTheme":
      return { ...s, theme: a.theme };
    case "startStory":
      return { ...s, mode: "story", story: a.id, step: 0 };
    case "gotoStep":
      return { ...s, step: a.step, selected: a.selected, highlight: a.highlight, flyRequest: fly(s, a.camera) };
    case "exitStory":
      return { ...s, mode: "explore" };
    case "resumeStory":
      return s.story ? { ...s, mode: "story" } : s;
    case "closeStory":
      return { ...s, mode: "explore", story: null, step: 0, highlight: [], showNotes: false };
    case "toggleNotes":
      return { ...s, showNotes: !s.showNotes };
  }
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/state && pnpm typecheck`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n src/state
git commit -m "feat: i18n setup, shareable URL state and app reducer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Map style, feature builders, MapView

**Files:**
- Create: `src/map/style.ts`, `src/map/features.ts`, `src/map/hatch.ts`, `src/map/MapView.tsx`
- Test: `src/map/style.test.ts`, `src/map/features.test.ts`

**Interfaces:**
- Consumes: `Dataset`, `Index`, `Filters`, `ThemeName`, `Camera`, `GRADE_DASH`, `GRADES`, `legProgress`, `legCoords`, `splitLine`, `isActive`, `tx`.
- Produces:
  - `features.ts`: `buildRouteFeatures(ds, idx, year, filters): FeatureCollection<LineString>` (props `id, person, color, grade, part: "done" | "remaining"`); `buildStayFeatures(ds, idx, year, filters): FeatureCollection<Point>` (active stays only; props `id, person, color, grade`); `buildPlaceFeatures(ds, idx, year, lang): FeatureCollection<Point>` (props `id, ancient, modern, rank`)
  - `style.ts`: `THEMES: Record<ThemeName, Theme>`; `territoryFilter(year: number): FilterSpecification`; `TERRITORY_LAYERS: { id: string; extra?: FilterSpecification }[]`; `INTERACTIVE_LAYERS: string[]`; `buildStyle(theme: ThemeName, origin: string, base: string, lang: string): StyleSpecification`
  - `MapView` props: `{ ds: Dataset; idx: Index; year: number; filters: Filters; lang: string; theme: ThemeName; selected: string | null; highlight: string[]; flyRequest: AppState["flyRequest"]; initialCamera: Camera; onSelect(id: string | null): void; onCameraChange(c: Camera): void }`. The container has `data-testid="map"`, `data-done-legs` (count of `part: "done"` route features) and `data-ready="true"` once the style loaded.

- [ ] **Step 1: Write failing tests**

`src/map/features.test.ts`:
```ts
import { it, expect } from "vitest";
import { buildRouteFeatures, buildStayFeatures, buildPlaceFeatures } from "./features";
import { buildIndex } from "../model/index";
import { makeDataset } from "../test/fixtures";
import { GRADES } from "../schema/common";

const ds = makeDataset();
const idx = buildIndex(ds);
const all = { people: null, grades: [...GRADES] };

it("splits legs into done/remaining by year", () => {
  const parts = (y: number) => buildRouteFeatures(ds, idx, y, all).features.map((f) => f.properties!.part);
  expect(parts(40)).toEqual(["remaining"]);
  expect(parts(47)).toEqual(["done", "remaining"]);
  expect(parts(48)).toEqual(["done"]);
});

it("filters by person and grade", () => {
  expect(buildRouteFeatures(ds, idx, 48, { people: ["john"], grades: [...GRADES] }).features).toEqual([]);
  expect(buildRouteFeatures(ds, idx, 48, { people: null, grades: ["B"] }).features).toEqual([]);
  expect(buildRouteFeatures(ds, idx, 48, all).features[0].properties).toMatchObject({ id: "paul-to-seleucia", person: "paul", color: "#c0392b", grade: "A" });
});

it("only shows active stays", () => {
  expect(buildStayFeatures(ds, idx, 44, all).features.map((f) => f.properties!.id)).toEqual(["paul-antioch"]);
  expect(buildStayFeatures(ds, idx, 50, all).features).toEqual([]);
});

it("labels places with ancient and modern names and rank", () => {
  const f = buildPlaceFeatures(ds, idx, 40, "en").features.find((x) => x.properties!.id === "antioch")!;
  expect(f.properties).toEqual({ id: "antioch", ancient: "Antiochia", modern: "Antakya", rank: 2 });
});
```

`src/map/style.test.ts`:
```ts
import { it, expect } from "vitest";
import { buildStyle, territoryFilter } from "./style";

it("keeps the glyph URL template intact and same-origin", () => {
  const s = buildStyle("default", "http://localhost:4173", "/church_history/", "en");
  expect(s.glyphs).toBe("http://localhost:4173/church_history/fonts/{fontstack}/{range}.pbf");
  for (const src of Object.values(s.sources)) {
    if ("data" in src && typeof src.data === "string") expect(src.data.startsWith("http://localhost:4173/church_history/")).toBe(true);
  }
});

it("has one done and one remaining route layer per grade", () => {
  const ids = buildStyle("default", "http://x", "/", "en").layers.map((l) => l.id);
  for (const g of ["A", "B", "C", "D", "E"]) {
    expect(ids).toContain(`routes-done-${g}`);
    expect(ids).toContain(`routes-remaining-${g}`);
  }
});

it("projector theme draws thicker routes", () => {
  const w = (t: "default" | "projector") => (buildStyle(t, "http://x", "/", "en").layers.find((l) => l.id === "routes-done-A") as { paint: Record<string, unknown> }).paint["line-width"];
  expect(w("projector")).toBeGreaterThan(w("default") as number);
});

it("filters territories by year inclusively", () => {
  expect(territoryFilter(44)).toEqual(["all", ["<=", ["get", "from"], 44], [">=", ["get", "to"], 44]]);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/map`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement features**

`src/map/features.ts`:
```ts
import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import type { Dataset } from "../model/dataset";
import type { Index } from "../model/index";
import type { Filters } from "../state/urlState";
import { legCoords, legProgress, splitLine, type Coord } from "../model/routes";
import { isActive } from "../model/time";
import { tx } from "../i18n/tx";

const line = (coordinates: Coord[], properties: Record<string, unknown>): Feature<LineString> => ({ type: "Feature", geometry: { type: "LineString", coordinates }, properties });
const point = (coordinates: Coord, properties: Record<string, unknown>): Feature<Point> => ({ type: "Feature", geometry: { type: "Point", coordinates }, properties });
const shown = (filters: Filters, person: string) => filters.people === null || filters.people.includes(person);

export function buildRouteFeatures(ds: Dataset, idx: Index, year: number, filters: Filters): FeatureCollection<LineString> {
  const features: Feature<LineString>[] = [];
  for (const j of ds.journeys) {
    if (!shown(filters, j.person)) continue;
    const color = idx.people.get(j.person)!.color;
    for (const item of j.items) {
      if (item.type !== "leg") continue;
      const grade = idx.claims.get(item.claim)!.grade;
      if (!filters.grades.includes(grade)) continue;
      const { done, remaining } = splitLine(legCoords(item, idx.places), legProgress(item.when, year));
      const props = { id: item.id, person: j.person, color, grade };
      if (done.length > 1) features.push(line(done, { ...props, part: "done" }));
      if (remaining.length > 1) features.push(line(remaining, { ...props, part: "remaining" }));
    }
  }
  return { type: "FeatureCollection", features };
}

export function buildStayFeatures(ds: Dataset, idx: Index, year: number, filters: Filters): FeatureCollection<Point> {
  const features: Feature<Point>[] = [];
  for (const j of ds.journeys) {
    if (!shown(filters, j.person)) continue;
    for (const item of j.items) {
      if (item.type !== "stay" || !isActive(item.when, year)) continue;
      const grade = idx.claims.get(item.claim)!.grade;
      if (!filters.grades.includes(grade)) continue;
      features.push(point(idx.places.get(item.place)!.coords, { id: item.id, person: j.person, color: idx.people.get(j.person)!.color, grade }));
    }
  }
  return { type: "FeatureCollection", features };
}

export function buildPlaceFeatures(ds: Dataset, idx: Index, year: number, lang: string): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: ds.places
      .filter((p) => !p.exists || isActive(p.exists, year))
      .map((p) => point(p.coords, { id: p.id, ancient: tx(p.name.ancient, lang), modern: tx(p.name.modern, lang), rank: idx.placeRank.get(p.id) ?? 0 })),
  };
}
```

- [ ] **Step 4: Implement style and hatch**

`src/map/hatch.ts`:
```ts
/** 8×8 diagonal hatch used for client kingdoms. */
export function hatchImage(): { width: number; height: number; data: Uint8Array } {
  const size = 8;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((x + y) % size === 0 || (x + y) % size === 1) {
        const i = (y * size + x) * 4;
        data.set([40, 30, 20, 140], i);
      }
    }
  }
  return { width: size, height: size, data };
}
```

`src/map/style.ts`:
```ts
import type { FilterSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";
import { GRADES } from "../schema/common";
import { GRADE_DASH } from "../model/grades";
import type { ThemeName } from "../state/urlState";

export type Theme = { sea: string; land: string; river: string; territoryOpacity: number; label: string; halo: string; lineWidth: number; textSize: number; fadedOpacity: number };

export const THEMES: Record<ThemeName, Theme> = {
  default: { sea: "#c9d6dc", land: "#efe6d2", river: "#9fb7c2", territoryOpacity: 0.28, label: "#3b2f22", halo: "#f7f1e3", lineWidth: 3, textSize: 13, fadedOpacity: 0.3 },
  projector: { sea: "#a9c1cc", land: "#f4ead2", river: "#6f97a8", territoryOpacity: 0.4, label: "#1b140c", halo: "#ffffff", lineWidth: 5, textSize: 18, fadedOpacity: 0.4 },
};

export function territoryFilter(year: number): FilterSpecification {
  return ["all", ["<=", ["get", "from"], year], [">=", ["get", "to"], year]];
}

/** Layers whose filter depends on the year; `extra` is AND-ed with territoryFilter. */
export const TERRITORY_LAYERS: { id: string; extra?: FilterSpecification }[] = [
  { id: "territory-fill" },
  { id: "territory-hatch", extra: ["==", ["get", "status"], "client-kingdom"] },
  { id: "territory-edge" },
  { id: "territory-label" },
];

export const INTERACTIVE_LAYERS = [
  ...GRADES.flatMap((g) => [`routes-done-${g}`, `routes-remaining-${g}`]),
  "stays",
  "places-dot",
  "territory-fill",
];

const FONT = ["Noto Sans Regular"];

export function buildStyle(themeName: ThemeName, origin: string, base: string, lang: string): StyleSpecification {
  const t = THEMES[themeName];
  const url = (p: string) => `${origin}${base}${p}`;
  const empty = { type: "geojson" as const, data: { type: "FeatureCollection" as const, features: [] } };

  const routeLayers: LayerSpecification[] = (["remaining", "done"] as const).flatMap((part) =>
    GRADES.map((g): LayerSpecification => ({
      id: `routes-${part}-${g}`,
      type: "line",
      source: "routes",
      filter: ["all", ["==", ["get", "part"], part], ["==", ["get", "grade"], g]],
      layout: { "line-cap": GRADE_DASH[g] && GRADE_DASH[g]![0] < 1 ? "round" : "butt", "line-join": "round" },
      paint: {
        "line-color": ["get", "color"],
        "line-width": t.lineWidth,
        "line-opacity": part === "done" ? 1 : t.fadedOpacity,
        ...(GRADE_DASH[g] ? { "line-dasharray": GRADE_DASH[g]! } : {}),
      },
    })),
  );

  return {
    version: 8,
    glyphs: url("fonts/{fontstack}/{range}.pbf"),
    sources: {
      land: { type: "geojson", data: url("data/land.geojson") },
      rivers: { type: "geojson", data: url("data/rivers.geojson") },
      territories: { type: "geojson", data: url("data/territories.geojson") },
      routes: empty,
      stays: empty,
      places: empty,
    },
    layers: [
      { id: "sea", type: "background", paint: { "background-color": t.sea } },
      { id: "land", type: "fill", source: "land", paint: { "fill-color": t.land } },
      { id: "rivers", type: "line", source: "rivers", paint: { "line-color": t.river, "line-width": 1 } },
      { id: "territory-fill", type: "fill", source: "territories", filter: territoryFilter(0), paint: { "fill-color": ["get", "fillColor"], "fill-opacity": t.territoryOpacity } },
      { id: "territory-hatch", type: "fill", source: "territories", filter: ["all", territoryFilter(0), ["==", ["get", "status"], "client-kingdom"]], paint: { "fill-pattern": "hatch" } },
      { id: "territory-edge", type: "line", source: "territories", filter: territoryFilter(0), paint: { "line-color": ["get", "color"], "line-width": 1.5, "line-blur": ["match", ["get", "precision"], 1, 6, 2, 3, 0.5] } },
      { id: "territory-label", type: "symbol", source: "territories", filter: territoryFilter(0), layout: { "text-field": ["coalesce", ["get", `name:${lang}`], ["get", "name:en"]], "text-font": FONT, "text-size": t.textSize + 2, "text-transform": "uppercase", "text-letter-spacing": 0.15 }, paint: { "text-color": t.label, "text-opacity": 0.55, "text-halo-color": t.halo, "text-halo-width": 1 } },
      ...routeLayers,
      { id: "route-highlight", type: "line", source: "routes", filter: ["in", ["get", "id"], ["literal", []]], paint: { "line-color": "#f1c40f", "line-width": t.lineWidth * 3, "line-opacity": 0.5, "line-blur": 2 } },
      { id: "stays-halo", type: "circle", source: "stays", paint: { "circle-color": ["get", "color"], "circle-opacity": 0.25, "circle-radius": 14 } },
      { id: "stays", type: "circle", source: "stays", paint: { "circle-color": ["get", "color"], "circle-radius": 7, "circle-stroke-color": "#fff", "circle-stroke-width": 2 } },
      { id: "places-dot", type: "circle", source: "places", paint: { "circle-color": t.label, "circle-radius": ["interpolate", ["linear"], ["get", "rank"], 0, 3, 5, 5] } },
      {
        id: "places-label",
        type: "symbol",
        source: "places",
        layout: {
          "text-field": ["format", ["get", "ancient"], {}, "\n", {}, ["get", "modern"], { "font-scale": 0.75 }],
          "text-font": FONT,
          "text-size": t.textSize,
          "text-offset": [0, 0.9],
          "text-anchor": "top",
          "symbol-sort-key": ["-", 0, ["get", "rank"]],
        },
        paint: { "text-color": t.label, "text-halo-color": t.halo, "text-halo-width": 1.5 },
      },
    ],
  };
}
```

- [ ] **Step 5: Run unit tests**

Run: `pnpm test src/map`
Expected: all PASS.

- [ ] **Step 6: Implement MapView**

`src/map/MapView.tsx`:
```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type FilterSpecification, type GeoJSONSource } from "maplibre-gl";
import type { Dataset } from "../model/dataset";
import type { Index } from "../model/index";
import type { Camera } from "../model/focus";
import type { Filters, ThemeName } from "../state/urlState";
import type { AppState } from "../state/store";
import { buildStyle, INTERACTIVE_LAYERS, TERRITORY_LAYERS, territoryFilter } from "./style";
import { buildPlaceFeatures, buildRouteFeatures, buildStayFeatures } from "./features";
import { hatchImage } from "./hatch";

export type MapViewProps = {
  ds: Dataset; idx: Index; year: number; filters: Filters; lang: string; theme: ThemeName;
  selected: string | null; highlight: string[]; flyRequest: AppState["flyRequest"]; initialCamera: Camera;
  onSelect(id: string | null): void; onCameraChange(c: Camera): void;
};

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function MapView(props: MapViewProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { theme, lang, initialCamera } = latest.current;
    const map = new maplibregl.Map({
      container: container.current!,
      style: buildStyle(theme, location.origin, import.meta.env.BASE_URL, lang),
      center: initialCamera.center,
      zoom: initialCamera.zoom,
      bearing: initialCamera.bearing,
      attributionControl: false,
    });
    map.on("load", () => {
      map.addImage("hatch", hatchImage());
      setReady(true);
    });
    map.on("moveend", () => {
      const c = map.getCenter();
      latest.current.onCameraChange({ center: [r3(c.lng), r3(c.lat)], zoom: r3(map.getZoom()), bearing: r3(map.getBearing()) });
    });
    map.on("click", (e) => {
      const f = map.queryRenderedFeatures(e.point, { layers: INTERACTIVE_LAYERS })[0];
      latest.current.onSelect((f?.properties?.id as string | undefined) ?? null);
    });
    for (const layer of INTERACTIVE_LAYERS) {
      map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
    }
    let frame = 0;
    const pulse = (t: number) => {
      if (map.getLayer("stays-halo")) map.setPaintProperty("stays-halo", "circle-radius", 12 + 4 * Math.sin(t / 400));
      frame = requestAnimationFrame(pulse);
    };
    frame = requestAnimationFrame(pulse);
    mapRef.current = map;
    return () => {
      cancelAnimationFrame(frame);
      map.remove();
    };
  }, []);

  const routes = useMemo(() => buildRouteFeatures(props.ds, props.idx, props.year, props.filters), [props.ds, props.idx, props.year, props.filters]);
  const stays = useMemo(() => buildStayFeatures(props.ds, props.idx, props.year, props.filters), [props.ds, props.idx, props.year, props.filters]);
  const places = useMemo(() => buildPlaceFeatures(props.ds, props.idx, props.year, props.lang), [props.ds, props.idx, props.year, props.lang]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource("routes") as GeoJSONSource).setData(routes);
    (map.getSource("stays") as GeoJSONSource).setData(stays);
    (map.getSource("places") as GeoJSONSource).setData(places);
    for (const { id, extra } of TERRITORY_LAYERS) {
      const f = territoryFilter(props.year);
      map.setFilter(id, extra ? (["all", f, extra] as FilterSpecification) : f);
    }
  }, [ready, routes, stays, places, props.year]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const ids = [props.selected, ...props.highlight].filter(Boolean);
    map.setFilter("route-highlight", ["in", ["get", "id"], ["literal", ids]]);
  }, [ready, props.selected, props.highlight]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !props.flyRequest) return;
    const { center, zoom, bearing } = props.flyRequest.camera;
    map.flyTo({ center, zoom, bearing, duration: 2000, essential: true });
  }, [ready, props.flyRequest?.seq]);

  const doneLegs = routes.features.filter((f) => f.properties?.part === "done").length;
  return <div ref={container} className="map" data-testid="map" data-ready={ready} data-done-legs={doneLegs} />;
}
```

Theme or language changes remount the map (App passes `key={theme + lang}`), so `buildStyle` only runs at mount.

- [ ] **Step 7: Typecheck and commit**

Run: `pnpm typecheck && pnpm test`
Expected: clean, all PASS.

```bash
git add src/map
git commit -m "feat: MapLibre style, year-aware features and MapView

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Explore-mode UI

**Files:**
- Create: `src/ui/useDataset.ts`, `src/ui/YearDisplay.tsx`, `src/ui/YearSlider.tsx`, `src/ui/Filters.tsx`, `src/ui/Legend.tsx`, `src/ui/DetailPanel.tsx`, `src/ui/Search.tsx`, `src/ui/Settings.tsx`, `src/ui/Attribution.tsx`, `src/ui/app.css`
- Modify: `src/ui/App.tsx` (replace), `src/ui/App.test.tsx` (replace), `src/main.tsx`
- Test: `src/ui/DetailPanel.test.tsx`, `src/ui/App.test.tsx`

**Interfaces:**
- Consumes: everything from Tasks 6–8; i18n keys from `en.json`.
- Produces:
  - `useDataset(): { status: "loading" } | { status: "error"; message: string } | { status: "ready"; dataset: Dataset }` — fetches `${BASE_URL}data/dataset.json`.
  - `<App />`, `<Loaded ds={Dataset} />` (exported for tests).
  - `<DetailPanel detail={EntityDetail} lang={string} idx={Index} onSelect(id) onClose() />`
  - Test ids: `app`, `year-display`, `year-slider`, `detail-panel`, `search-input`, `search-result`, `grade-badge`, `story-open`.
  - Story start control in `Settings`: buttons per story calling `dispatch({ type: "startStory", id })` (wired to StoryMode in Task 10).

- [ ] **Step 1: Write failing tests**

`src/ui/DetailPanel.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi, beforeAll } from "vitest";
import { DetailPanel } from "./DetailPanel";
import { describeEntity } from "../model/detail";
import { buildIndex } from "../model/index";
import { makeDataset } from "../test/fixtures";
import { initI18n } from "../i18n";

beforeAll(() => initI18n());
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
```

`src/ui/App.test.tsx` (replace):
```tsx
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
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/ui`
Expected: FAIL — `DetailPanel` / `Loaded` not found.

- [ ] **Step 3: Implement components**

`src/ui/useDataset.ts`:
```ts
import { useEffect, useState } from "react";
import type { Dataset } from "../model/dataset";

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; dataset: Dataset };

export function useDataset(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/dataset.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((dataset: Dataset) => setState({ status: "ready", dataset }))
      .catch((e: Error) => setState({ status: "error", message: e.message }));
  }, []);
  return state;
}
```

`src/ui/YearDisplay.tsx`:
```tsx
import { useTranslation } from "react-i18next";

export function YearDisplay({ year, circa }: { year: number; circa: boolean }) {
  const { t } = useTranslation();
  return <div className="year-display" data-testid="year-display">{t(circa ? "year.circa" : "year.exact", { year })}</div>;
}
```

`src/ui/YearSlider.tsx`:
```tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Timeline } from "../schema/entities";
import { tx } from "../i18n/tx";

type Props = { timeline: Timeline; year: number; lang: string; onYear(y: number): void; onSelect(id: string): void };

export function YearSlider({ timeline, year, lang, onYear, onSelect }: Props) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const min = timeline.start.year;
  const max = timeline.end.year;
  useEffect(() => {
    if (!playing) return;
    const h = setInterval(() => onYear(year >= max ? min : year + 1), 400);
    return () => clearInterval(h);
  }, [playing, year, min, max, onYear]);
  const pct = (y: number) => `${((y - min) / (max - min)) * 100}%`;
  return (
    <div className="slider">
      <button onClick={() => setPlaying((p) => !p)} aria-label={t(playing ? "slider.pause" : "slider.play")}>{playing ? "❚❚" : "▶"}</button>
      <button className="endpoint" onClick={() => onSelect(timeline.start.claim)}>{timeline.start.circa ? `c. ${min}` : min}</button>
      <div className="track">
        <input data-testid="year-slider" type="range" min={min} max={max} value={year} aria-label={t("slider.label")} onChange={(e) => onYear(Number(e.target.value))} />
        {timeline.keyEvents.map((k) => (
          <button key={k.target} className="key-event" style={{ left: pct(k.year) }} title={tx(k.label, lang)} onClick={() => { onYear(k.year); onSelect(k.target); }}>▴</button>
        ))}
      </div>
      <button className="endpoint" onClick={() => onSelect(timeline.end.claim)}>{timeline.end.circa ? `c. ${max}` : max}</button>
    </div>
  );
}
```

`src/ui/Legend.tsx`:
```tsx
import { useTranslation } from "react-i18next";
import { GRADES } from "../schema/common";
import { GRADE_DASH } from "../model/grades";

export function Legend({ compact }: { compact: boolean }) {
  const { t } = useTranslation();
  return (
    <div className={`legend ${compact ? "compact" : ""}`}>
      <strong>{t("legend.title")}</strong>
      {GRADES.map((g) => (
        <div key={g} className="legend-row">
          <svg width="40" height="8" aria-hidden>
            <line x1="0" y1="4" x2="40" y2="4" stroke="currentColor" strokeWidth="3" strokeLinecap={GRADE_DASH[g] && GRADE_DASH[g]![0] < 1 ? "round" : "butt"} strokeDasharray={GRADE_DASH[g]?.map((n) => n * 3).join(" ")} />
          </svg>
          <span>{compact ? g : t(`grade.${g}`)}</span>
        </div>
      ))}
    </div>
  );
}
```

`src/ui/Filters.tsx`:
```tsx
import { useTranslation } from "react-i18next";
import { GRADES, type Grade } from "../schema/common";
import type { Person } from "../schema/entities";
import type { Filters as F } from "../state/urlState";
import { tx } from "../i18n/tx";

type Props = { people: Person[]; filters: F; lang: string; onTogglePerson(id: string): void; onToggleGrade(g: Grade): void };

export function Filters({ people, filters, lang, onTogglePerson, onToggleGrade }: Props) {
  const { t } = useTranslation();
  return (
    <aside className="filters">
      <h2>{t("filters.people")}</h2>
      {people.map((p) => (
        <label key={p.id}>
          <input type="checkbox" checked={filters.people === null || filters.people.includes(p.id)} onChange={() => onTogglePerson(p.id)} />
          <span className="swatch" style={{ background: p.color }} /> {tx(p.name, lang)}
        </label>
      ))}
      <h2>{t("filters.grades")}</h2>
      {GRADES.map((g) => (
        <label key={g}>
          <input type="checkbox" checked={filters.grades.includes(g)} onChange={() => onToggleGrade(g)} /> {t(`grade.${g}`)}
        </label>
      ))}
    </aside>
  );
}
```

`src/ui/DetailPanel.tsx`:
```tsx
import { useTranslation } from "react-i18next";
import type { EntityDetail, ClaimView } from "../model/detail";
import type { Index } from "../model/index";
import { tx } from "../i18n/tx";

type Props = { detail: EntityDetail; lang: string; idx: Index; onSelect(id: string): void; onClose(): void };

function ClaimBlock({ view, lang, onSelect }: { view: ClaimView; lang: string; onSelect(id: string): void }) {
  const { t } = useTranslation();
  const { claim } = view;
  return (
    <section className="claim">
      <p>
        <span className={`grade grade-${claim.grade}`} data-testid="grade-badge" title={t(`grade.${claim.grade}`)}>{claim.grade}</span>{" "}
        {tx(claim.text, lang)}
      </p>
      {claim.notes && <p className="note"><em>{t("detail.notes")}:</em> {tx(claim.notes, lang)}</p>}
      <h4>{t("detail.sources")}</h4>
      <ul>
        {view.citations.map((c, i) => (
          <li key={i}>
            {c.href ? <a href={c.href} target="_blank" rel="noreferrer">{c.source.author}, <cite>{c.source.work}</cite> {c.locator}</a> : <span>{c.source.author}, <cite>{c.source.work}</cite> {c.locator}</span>}
            {c.quote && <blockquote>“{c.quote}”</blockquote>}
          </li>
        ))}
      </ul>
      {view.mentions.map((m, i) => (
        <p key={i} className="mention">
          {t("detail.alsoToldBy", { author: m.work.author, chapter: m.chapter })}
          {m.quote && <>: “{m.quote}”</>}
        </p>
      ))}
      {view.alternatives.length > 0 && (
        <>
          <h4>{t("detail.alternatives")}</h4>
          <ul>
            {view.alternatives.map((a) => (
              <li key={a.id}><button className="link" onClick={() => onSelect(a.id)}><span className={`grade grade-${a.grade}`}>{a.grade}</span> {tx(a.text, lang)}</button></li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function DetailPanel({ detail, lang, idx, onSelect, onClose }: Props) {
  const { t } = useTranslation();
  const person = detail.person ? idx.people.get(detail.person) : undefined;
  return (
    <aside className="detail" data-testid="detail-panel">
      <button className="close" onClick={onClose} aria-label={t("detail.close")}>×</button>
      <h2>{tx(detail.title, lang)}</h2>
      {(person || detail.when) && (
        <p className="meta">
          {person && <span className="swatch" style={{ background: person.color }} />} {person && tx(person.name, lang)}
          {detail.when && ` · ${t(detail.when.circa ? "year.circa" : "year.exact", { year: detail.when.from === detail.when.to ? detail.when.from : `${detail.when.from}–${detail.when.to}` })}`}
        </p>
      )}
      {detail.claims.map((v) => <ClaimBlock key={v.claim.id} view={v} lang={lang} onSelect={onSelect} />)}
      {detail.media.map((m) => (
        <figure key={m.id}>
          <img src={`${import.meta.env.BASE_URL}media/${m.file}`} alt={tx(m.caption, lang)} />
          <figcaption>
            {tx(m.caption, lang)} <span className={`media-role ${m.role}`}>{t(m.role === "evidence" ? "media.evidence" : "media.illustration")}</span>
            <br /><a href={m.sourceUrl} target="_blank" rel="noreferrer">{t("media.credit", { creator: m.creator, licence: m.licence })}</a>
          </figcaption>
        </figure>
      ))}
      {detail.episodes.length > 0 && (
        <>
          <h3>{t("detail.episodes")}</h3>
          <ol className="episodes">
            {[...detail.episodes].sort((a, b) => a.when.from - b.when.from).map((e) => (
              <li key={e.id}><button className="link" onClick={() => onSelect(e.id)}>{tx(e.title, lang)}</button></li>
            ))}
          </ol>
        </>
      )}
    </aside>
  );
}
```

`src/ui/Search.tsx`:
```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Dataset } from "../model/dataset";
import type { Index } from "../model/index";
import { searchEntities, type SearchResult } from "../model/search";

export function Search({ ds, idx, lang, onPick }: { ds: Dataset; idx: Index; lang: string; onPick(r: SearchResult): void }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const results = searchEntities(q, ds, idx, lang);
  return (
    <div className="search">
      <input data-testid="search-input" value={q} placeholder={t("search.placeholder")} onChange={(e) => setQ(e.target.value)} />
      {q.trim().length >= 2 && (
        <ul role="listbox">
          {results.length === 0 && <li>{t("search.noResults")}</li>}
          {results.map((r) => (
            <li key={r.id} role="option" aria-selected={false}>
              <button data-testid="search-result" onClick={() => { onPick(r); setQ(""); }}>{r.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

`src/ui/Attribution.tsx`:
```tsx
import { useTranslation } from "react-i18next";
import type { Dataset } from "../model/dataset";

export function Attribution({ ds, onClose }: { ds: Dataset; onClose(): void }) {
  const { t } = useTranslation();
  const datasets = ds.sources.filter((s) => s.kind === "dataset");
  return (
    <div className="modal" role="dialog" aria-label={t("attribution.title")}>
      <h2>{t("attribution.title")}</h2>
      <ul>
        {datasets.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.work}</a> — {s.author}</li>)}
        <li><a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a> — public domain</li>
        <li><a href="https://pleiades.stoa.org/" target="_blank" rel="noreferrer">Pleiades</a> — CC BY</li>
        <li><a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noreferrer">historical-basemaps</a> — GPL-3.0 (territory geometry)</li>
        <li>Noto Sans — SIL Open Font License</li>
        {ds.referenceWorks.map((r) => <li key={r.id}>{r.author}, <cite>{r.title}</cite></li>)}
      </ul>
      <button onClick={onClose}>{t("attribution.close")}</button>
    </div>
  );
}
```

`src/ui/Settings.tsx`:
```tsx
import { useTranslation } from "react-i18next";
import { LANGS } from "../schema/common";
import type { Story } from "../schema/entities";
import type { ThemeName } from "../state/urlState";
import { tx } from "../i18n/tx";

type Props = {
  lang: string; theme: ThemeName; stories: Story[]; onLang(l: string): void; onTheme(t: ThemeName): void;
  onStory(id: string): void; onAttribution(): void; copyStep?: () => void;
};

export function Settings({ lang, theme, stories, onLang, onTheme, onStory, onAttribution, copyStep }: Props) {
  const { t } = useTranslation();
  return (
    <div className="settings">
      {stories.map((s) => <button key={s.id} data-testid="story-open" onClick={() => onStory(s.id)}>▶ {tx(s.title, lang)}</button>)}
      <label>{t("settings.language")} <select value={lang} onChange={(e) => onLang(e.target.value)}>{LANGS.map((l) => <option key={l}>{l}</option>)}</select></label>
      <label>{t("settings.theme")} <select value={theme} onChange={(e) => onTheme(e.target.value as ThemeName)}>
        <option value="default">{t("settings.themeDefault")}</option>
        <option value="projector">{t("settings.themeProjector")}</option>
      </select></label>
      <button className="link" onClick={onAttribution}>{t("attribution.open")}</button>
      {copyStep && <button onClick={copyStep}>{t("settings.copyStep")}</button>}
    </div>
  );
}
```

`src/ui/App.tsx` (replace):
```tsx
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import type { Dataset } from "../model/dataset";
import { buildIndex } from "../model/index";
import { describeEntity } from "../model/detail";
import { DEFAULT_CAMERA, focusFor, startYearFor } from "../model/focus";
import { clampYear } from "../model/time";
import { defaultUrlState, parseUrlState, serializeUrlState } from "../state/urlState";
import { initialAppState, reducer } from "../state/store";
import { MapView } from "../map/MapView";
import { useDataset } from "./useDataset";
import { YearDisplay } from "./YearDisplay";
import { YearSlider } from "./YearSlider";
import { Filters } from "./Filters";
import { Legend } from "./Legend";
import { DetailPanel } from "./DetailPanel";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { Attribution } from "./Attribution";
import { StoryMode } from "../story/StoryMode";
import { stepYaml } from "../story/story";
import "./app.css";

export function App() {
  const { t } = useTranslation();
  const data = useDataset();
  if (data.status === "loading") return <div data-testid="app" className="loading">{t("app.loading")}</div>;
  if (data.status === "error") return <div data-testid="app" role="alert">{t("app.loadError")} ({data.message})</div>;
  return <Loaded ds={data.dataset} />;
}

export function Loaded({ ds }: { ds: Dataset }) {
  const idx = useMemo(() => buildIndex(ds), [ds]);
  const range = { min: ds.timeline.start.year, max: ds.timeline.end.year };
  const defaults = useMemo(() => defaultUrlState(range.min), [range.min]);
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const url = parseUrlState(location.search, defaults, range);
    return initialAppState({
      ...url,
      selected: url.selected && describeEntity(url.selected, idx) ? url.selected : null,
      story: url.story && idx.stories.has(url.story) ? url.story : null,
    });
  });
  const [showAttribution, setShowAttribution] = useState(false);

  useEffect(() => {
    history.replaceState(null, "", location.pathname + serializeUrlState(state, defaults));
  }, [state, defaults]);
  useEffect(() => {
    void i18n.changeLanguage(state.lang);
  }, [state.lang]);

  const select = useCallback((id: string | null) => dispatch({ type: "select", id }), []);
  const focus = useCallback(
    (id: string) => {
      const y = startYearFor(id, idx);
      dispatch({ type: "focus", id, camera: focusFor(id, idx), year: y === null ? null : clampYear(y, range.min, range.max) });
    },
    [idx, range.min, range.max],
  );
  const setYear = useCallback((year: number) => dispatch({ type: "setYear", year }), []);

  const detail = state.selected ? describeEntity(state.selected, idx) : null;
  const story = state.story ? idx.stories.get(state.story) ?? null : null;
  const copyStep = import.meta.env.DEV
    ? () => void navigator.clipboard.writeText(stepYaml({ year: state.year, camera: state.camera ?? DEFAULT_CAMERA, selected: state.selected, idx }))
    : undefined;

  return (
    <div data-testid="app" className={`app theme-${state.theme} mode-${state.mode}`}>
      <MapView
        key={state.theme + state.lang}
        ds={ds} idx={idx} year={state.year} filters={state.filters} lang={state.lang} theme={state.theme}
        selected={state.selected} highlight={state.highlight} flyRequest={state.flyRequest}
        initialCamera={state.camera ?? DEFAULT_CAMERA}
        onSelect={select}
        onCameraChange={(camera) => dispatch({ type: "cameraMoved", camera })}
      />
      <YearDisplay year={state.year} circa={state.mode === "story" && !!(state.selected && idx.episodes.get(state.selected)?.episode.when.circa)} />
      {state.mode === "story" && story ? (
        <StoryMode story={story} state={state} dispatch={dispatch} idx={idx} lang={state.lang} />
      ) : (
        <>
          <header className="topbar">
            <Search ds={ds} idx={idx} lang={state.lang} onPick={(r) => (r.kind === "person" ? dispatch({ type: "onlyPerson", id: r.id }) : focus(r.id))} />
            {story && <button onClick={() => dispatch({ type: "resumeStory" })}>{i18n.t("story.back")}</button>}
            <Settings
              lang={state.lang} theme={state.theme} stories={ds.stories}
              onLang={(lang) => dispatch({ type: "setLang", lang })}
              onTheme={(theme) => dispatch({ type: "setTheme", theme })}
              onStory={(id) => dispatch({ type: "startStory", id })}
              onAttribution={() => setShowAttribution(true)}
              copyStep={copyStep}
            />
          </header>
          <Filters
            people={ds.people} filters={state.filters} lang={state.lang}
            onTogglePerson={(id) => dispatch({ type: "togglePerson", id, all: ds.people.map((p) => p.id) })}
            onToggleGrade={(grade) => dispatch({ type: "toggleGrade", grade })}
          />
          {detail && <DetailPanel detail={detail} lang={state.lang} idx={idx} onSelect={focus} onClose={() => select(null)} />}
          <Legend compact />
          <YearSlider timeline={ds.timeline} year={state.year} lang={state.lang} onYear={setYear} onSelect={select} />
        </>
      )}
      {showAttribution && <Attribution ds={ds} onClose={() => setShowAttribution(false)} />}
    </div>
  );
}
```

Until Task 10 exists, create a stub so this compiles — `src/story/story.ts`: `export function stepYaml(_: unknown): string { return ""; }` and `src/story/StoryMode.tsx`: `export function StoryMode(_: unknown) { return null; }`. Task 10 replaces both.

`src/main.tsx` (replace):
```tsx
import { createRoot } from "react-dom/client";
import "maplibre-gl/dist/maplibre-gl.css";
import { initI18n } from "./i18n";
import { App } from "./ui/App";

initI18n();
createRoot(document.getElementById("root")!).render(<App />);
```

`src/ui/app.css`:
```css
:root {
  --bg: #f7f1e3; --fg: #2b2118; --muted: #7a6a58; --panel: rgba(255, 250, 240, 0.95); --accent: #8e3b2f; --border: #d9cbb2;
  --grade-A: #1e8449; --grade-B: #2874a6; --grade-C: #b9770e; --grade-D: #7d3c98; --grade-E: #7f8c8d;
  font-family: system-ui, sans-serif; color: var(--fg);
}
html, body, #root { margin: 0; height: 100%; background: var(--bg); }
.app { position: relative; height: 100%; overflow: hidden; }
.map { position: absolute; inset: 0; }
.topbar { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap; }
.search { position: relative; flex: 1 1 260px; max-width: 420px; }
.search input { width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--panel); }
.search ul { position: absolute; top: 100%; left: 0; right: 0; margin: 4px 0 0; padding: 4px; list-style: none; background: var(--panel); border: 1px solid var(--border); border-radius: 6px; z-index: 5; }
.search button { width: 100%; text-align: left; background: none; border: 0; padding: 6px; cursor: pointer; }
.settings { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; background: var(--panel); padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border); }
.year-display { position: absolute; top: 60px; left: 50%; transform: translateX(-50%); font-size: 40px; font-weight: 700; text-shadow: 0 0 6px var(--bg); pointer-events: none; }
.filters { position: absolute; top: 120px; left: 12px; width: 220px; max-height: calc(100% - 220px); overflow: auto; background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; }
.filters h2 { font-size: 13px; text-transform: uppercase; color: var(--muted); margin: 8px 0 4px; }
.filters label { display: block; font-size: 14px; margin: 2px 0; }
.swatch { display: inline-block; width: 10px; height: 10px; border-radius: 50%; vertical-align: middle; }
.detail { position: absolute; top: 120px; right: 12px; width: 360px; max-height: calc(100% - 220px); overflow: auto; background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 12px 16px; }
.detail .close { position: absolute; top: 6px; right: 8px; border: 0; background: none; font-size: 22px; cursor: pointer; }
.detail img { max-width: 100%; }
.grade { display: inline-block; min-width: 1.4em; text-align: center; color: #fff; border-radius: 4px; font-weight: 700; padding: 0 4px; }
.grade-A { background: var(--grade-A); } .grade-B { background: var(--grade-B); } .grade-C { background: var(--grade-C); } .grade-D { background: var(--grade-D); } .grade-E { background: var(--grade-E); }
.mention { color: var(--muted); font-style: italic; }
.media-role.illustration { color: var(--muted); font-size: 12px; }
.link { background: none; border: 0; padding: 0; color: var(--accent); cursor: pointer; text-align: left; }
.legend { position: absolute; bottom: 90px; left: 12px; background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; font-size: 12px; }
.legend-row { display: flex; gap: 6px; align-items: center; }
.slider { position: absolute; left: 12px; right: 12px; bottom: 12px; display: flex; gap: 8px; align-items: center; background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; }
.slider .track { position: relative; flex: 1; }
.slider input { width: 100%; }
.slider .key-event { position: absolute; top: 18px; transform: translateX(-50%); border: 0; background: none; color: var(--accent); cursor: pointer; }
.slider .endpoint { border: 0; background: none; color: var(--muted); cursor: pointer; }
.modal { position: absolute; inset: 10% 20%; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 16px 24px; overflow: auto; z-index: 10; }
.theme-projector { font-size: 120%; }
.theme-projector .year-display { font-size: 56px; }
.loading { display: grid; place-items: center; height: 100%; }
@media (max-width: 700px) {
  .filters { display: none; }
  .detail { left: 0; right: 0; top: auto; bottom: 70px; width: auto; max-height: 50%; border-radius: 12px 12px 0 0; }
  .year-display { font-size: 28px; top: 70px; }
  .legend { display: none; }
}
```

- [ ] **Step 4: Run tests and typecheck**

Run: `pnpm test && pnpm typecheck`
Expected: all PASS.

- [ ] **Step 5: Manual check**

Run: `pnpm dev`, open the printed URL. Expected: map with land/sea, Roman Empire tinted, place labels with ancient/modern names, slider at "30 AD". Drag to 47: Paul's Cyprus legs turn solid. Search "patmos" → pick → map flies to Patmos, slider jumps to 95, panel shows grade A and "John, Revelation 1:9" linking to Bible Gateway. Toggle grade A off: the legs disappear.

- [ ] **Step 6: Commit**

```bash
git add src/ui src/main.tsx src/story
git commit -m "feat: explore mode — slider, filters, legend, search, detail panel

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Story mode and "Copy as step"

**Files:**
- Create: `src/story/story.ts` (replace stub), `src/story/StoryMode.tsx` (replace stub)
- Test: `src/story/story.test.ts`

**Interfaces:**
- Consumes: `AppState`, `Action`, `Index`, `Story`, `Step`, `Camera`, `describeEntity`, `tx`, `yaml.stringify`.
- Produces:
  - `type StoryKeyAction = "next" | "prev" | "notes" | "exit"`; `keyToStoryAction(key: string): StoryKeyAction | null`
  - `yearAt(from: number, to: number, t: number): number` (ease-in-out, rounded, clamped `t`)
  - `stepYaml(args: { year: number; camera: Camera; selected: string | null; idx: Index }): string` — a one-step YAML list; uses `episode:` when the selection is an episode, otherwise `text: { en: "" }` (empty on purpose: the build rejects it until the author writes the text).
  - `<StoryMode story state dispatch idx lang />` with test ids `story-card`, `story-step` (text "n / total"), `story-notes`.

- [ ] **Step 1: Write failing tests**

`src/story/story.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/story`
Expected: FAIL — exports missing from the stub.

- [ ] **Step 3: Implement**

`src/story/story.ts`:
```ts
import { stringify } from "yaml";
import type { Camera } from "../model/focus";
import type { Index } from "../model/index";

export type StoryKeyAction = "next" | "prev" | "notes" | "exit";

export function keyToStoryAction(key: string): StoryKeyAction | null {
  switch (key) {
    case "ArrowRight": case " ": case "PageDown": return "next";
    case "ArrowLeft": case "PageUp": return "prev";
    case "n": case "N": return "notes";
    case "Escape": return "exit";
    default: return null;
  }
}

export function yearAt(from: number, to: number, t: number): number {
  const c = Math.min(1, Math.max(0, t));
  const e = c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
  return Math.round(from + (to - from) * e);
}

export function stepYaml({ year, camera, selected, idx }: { year: number; camera: Camera; selected: string | null; idx: Index }): string {
  const step: Record<string, unknown> = { year, camera: { center: camera.center, zoom: camera.zoom, bearing: camera.bearing }, highlight: selected ? [selected] : [] };
  if (selected && idx.episodes.has(selected)) step.episode = selected;
  else step.text = { en: "" };
  return stringify([step]);
}
```

`src/story/StoryMode.tsx`:
```tsx
import { useEffect, useRef, type Dispatch } from "react";
import { useTranslation } from "react-i18next";
import type { Story } from "../schema/entities";
import type { Index } from "../model/index";
import type { Action, AppState } from "../state/store";
import { describeEntity } from "../model/detail";
import { tx } from "../i18n/tx";
import { keyToStoryAction, yearAt } from "./story";

type Props = { story: Story; state: AppState; dispatch: Dispatch<Action>; idx: Index; lang: string };

export function StoryMode({ story, state, dispatch, idx, lang }: Props) {
  const { t } = useTranslation();
  const stepIndex = Math.min(state.step, story.steps.length - 1);
  const step = story.steps[stepIndex];
  const yearRef = useRef(state.year);
  yearRef.current = state.year;

  const go = (i: number) => {
    const target = story.steps[Math.max(0, Math.min(story.steps.length - 1, i))];
    const n = story.steps.indexOf(target);
    dispatch({ type: "gotoStep", step: n, camera: target.camera, selected: target.episode ?? target.highlight[0] ?? null, highlight: target.highlight });
  };

  // Enter the current step (camera + selection) on mount and whenever the index changes.
  useEffect(() => {
    go(stepIndex);
  }, [stepIndex, story.id]);

  // Animate the slider year to the step's year.
  useEffect(() => {
    const from = yearRef.current;
    const to = step.year;
    if (from === to) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = (now - start) / 1500;
      dispatch({ type: "setYear", year: yearAt(from, to, p) });
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [step.year, stepIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = keyToStoryAction(e.key);
      if (!a) return;
      e.preventDefault();
      if (a === "next") go(stepIndex + 1);
      if (a === "prev") go(stepIndex - 1);
      if (a === "notes") dispatch({ type: "toggleNotes" });
      if (a === "exit") dispatch({ type: "exitStory" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepIndex]);

  const episode = step.episode ? describeEntity(step.episode, idx) : null;
  const media = episode?.media[0];
  return (
    <>
      <div className="story-card" data-testid="story-card">
        {episode ? (
          <>
            <h2>{tx(episode.title, lang)}</h2>
            <p>{tx(idx.episodes.get(step.episode!)!.episode.text, lang)}</p>
            {episode.claims[0] && <p className="story-source"><span className={`grade grade-${episode.claims[0].claim.grade}`}>{episode.claims[0].claim.grade}</span> {episode.claims[0].citations.map((c) => `${c.source.work} ${c.locator}`).join("; ")}</p>}
            {media && <img src={`${import.meta.env.BASE_URL}media/${media.file}`} alt={tx(media.caption, lang)} />}
          </>
        ) : (
          <p className="story-text">{tx(step.text, lang)}</p>
        )}
        <div className="story-nav">
          <button onClick={() => go(stepIndex - 1)} disabled={stepIndex === 0}>{t("story.prev")}</button>
          <span data-testid="story-step">{t("story.step", { n: stepIndex + 1, total: story.steps.length })}</span>
          <button onClick={() => go(stepIndex + 1)} disabled={stepIndex === story.steps.length - 1}>{t("story.next")}</button>
          <button onClick={() => dispatch({ type: "exitStory" })}>{t("story.exit")}</button>
          <button onClick={() => dispatch({ type: "closeStory" })}>{t("story.close")}</button>
        </div>
      </div>
      {state.showNotes && step.notes && <div className="story-notes" data-testid="story-notes">{tx(step.notes, lang)}</div>}
    </>
  );
}
```

Append to `src/ui/app.css`:
```css
.story-card { position: absolute; left: 24px; bottom: 24px; width: min(520px, calc(100% - 48px)); background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px 20px; font-size: 18px; }
.story-card img { max-width: 100%; max-height: 240px; }
.story-nav { display: flex; gap: 8px; align-items: center; margin-top: 12px; }
.story-source { font-size: 14px; color: var(--muted); }
.story-notes { position: absolute; top: 12px; right: 12px; width: 320px; background: #222; color: #eee; padding: 12px; border-radius: 8px; }
.theme-projector .story-card { font-size: 24px; }
```

- [ ] **Step 4: Run tests and manual check**

Run: `pnpm test && pnpm typecheck`
Expected: all PASS.

Run `pnpm dev`, click "▶ Demo story". Expected: step 1/3 card over Jerusalem; → flies to Cyprus while the year counts up to 47; → step 3 shows the Revelation episode with the grade A badge and "Revelation 1:9"; `N` shows the notes on step 1; `Esc` returns to explore with a "Back to story" button that resumes at the same step. In dev, "Copy as story step" puts YAML on the clipboard.

- [ ] **Step 5: Commit**

```bash
git add src/story src/ui/app.css
git commit -m "feat: story mode with presenter keys, notes and copy-as-step

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Reports — translations, link check, Pleiades check

**Files:**
- Create: `src/reports/translations.ts`, `src/reports/urls.ts`, `scripts/i18n-report.ts`, `scripts/link-check.ts`, `scripts/check-pleiades.ts`
- Test: `src/reports/reports.test.ts`

**Interfaces:**
- Consumes: `Dataset`, `loadDataset`, `LANGS`.
- Produces:
  - `missingTranslations(value: unknown, lang: string, path?: string): string[]` — paths of `I18nText` objects (objects with a string `en` and only string values) lacking `lang`.
  - `collectUrls(ds: Dataset): { url: string; where: string }[]` (deduped by url; from sources `url`, reference works `url`, places `pleiades`, media `sourceUrl`).
  - `pnpm i18n:report`, `pnpm links`, `pnpm check:pleiades` — all report-only (exit 0), writing Markdown to stdout and to `$GITHUB_STEP_SUMMARY` when set.

- [ ] **Step 1: Write failing tests**

`src/reports/reports.test.ts`:
```ts
import { it, expect } from "vitest";
import { missingTranslations } from "./translations";
import { collectUrls } from "./urls";
import { makeDataset } from "../test/fixtures";

it("lists i18n fields missing a language", () => {
  const value = { a: { en: "x", nl: "y" }, b: [{ title: { en: "only en" } }], c: { en: 3 } };
  expect(missingTranslations(value, "nl")).toEqual(["b.0.title"]);
});

it("collects and dedupes URLs", () => {
  const ds = makeDataset();
  ds.places[1].pleiades = ds.places[0].pleiades;
  const urls = collectUrls(ds).map((u) => u.url);
  expect(urls).toContain("https://ccel.org/ccel/schaff/anf01");
  expect(urls.filter((u) => u.includes("658381"))).toHaveLength(1);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test src/reports`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/reports/translations.ts`:
```ts
const isI18n = (v: unknown): v is Record<string, string> =>
  !!v && typeof v === "object" && !Array.isArray(v) && typeof (v as Record<string, unknown>).en === "string" && Object.values(v).every((x) => typeof x === "string");

export function missingTranslations(value: unknown, lang: string, path = ""): string[] {
  if (isI18n(value)) return value[lang] ? [] : [path];
  if (Array.isArray(value)) return value.flatMap((v, i) => missingTranslations(v, lang, path ? `${path}.${i}` : String(i)));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => missingTranslations(v, lang, path ? `${path}.${k}` : k));
  return [];
}
```

`src/reports/urls.ts`:
```ts
import type { Dataset } from "../model/dataset";

export function collectUrls(ds: Dataset): { url: string; where: string }[] {
  const all = [
    ...ds.sources.filter((s) => s.url).map((s) => ({ url: s.url!, where: `source:${s.id}` })),
    ...ds.referenceWorks.filter((r) => r.url).map((r) => ({ url: r.url!, where: `referenceWork:${r.id}` })),
    ...ds.places.filter((p) => p.pleiades).map((p) => ({ url: p.pleiades!, where: `place:${p.id}` })),
    ...ds.media.map((m) => ({ url: m.sourceUrl, where: `media:${m.id}` })),
  ];
  const seen = new Set<string>();
  return all.filter((u) => (seen.has(u.url) ? false : (seen.add(u.url), true)));
}
```

`scripts/i18n-report.ts`:
```ts
import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";
import { missingTranslations } from "../src/reports/translations";
import { LANGS } from "../src/schema/common";

const { dataset } = loadDataset(join(import.meta.dirname, "..", "data"));
const lines = ["## Missing translations", ""];
for (const lang of LANGS.filter((l) => l !== "en")) {
  const missing = missingTranslations(dataset, lang);
  lines.push(`- **${lang}**: ${missing.length} field(s) missing`);
}
const out = lines.join("\n");
console.log(out);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${out}\n`);
```

`scripts/link-check.ts`:
```ts
import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";
import { collectUrls } from "../src/reports/urls";

const { dataset } = loadDataset(join(import.meta.dirname, "..", "data"));
const urls = collectUrls(dataset);

async function check(url: string): Promise<number | string> {
  const opts = { redirect: "follow" as const, signal: AbortSignal.timeout(15000), headers: { "user-agent": "church-history-map link check" } };
  try {
    let r = await fetch(url, { ...opts, method: "HEAD" });
    if (r.status === 405 || r.status === 403) r = await fetch(url, { ...opts, method: "GET" });
    return r.status;
  } catch (e) {
    return (e as Error).name;
  }
}

const failures: string[] = [];
for (let i = 0; i < urls.length; i += 6) {
  const batch = urls.slice(i, i + 6);
  const results = await Promise.all(batch.map((u) => check(u.url)));
  batch.forEach((u, j) => {
    const s = results[j];
    if (typeof s !== "number" || s >= 400) failures.push(`| ${u.where} | ${u.url} | ${s} |`);
  });
}
const out = [`## Link check: ${urls.length} URLs, ${failures.length} failing`, "", ...(failures.length ? ["| where | url | status |", "|---|---|---|", ...failures] : [])].join("\n");
console.log(out);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${out}\n`);
```

`scripts/check-pleiades.ts` (catches wrong ids such as Perga ↔ Pergamum):
```ts
import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";

const { dataset } = loadDataset(join(import.meta.dirname, "..", "data"));
const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const tokens = (s: string) => new Set(norm(s).split(/[^a-z]+/).filter((t) => t.length > 3));

console.log("| place | our name | Pleiades title | match |\n|---|---|---|---|");
for (const p of dataset.places.filter((x) => x.pleiades)) {
  const r = await fetch(`${p.pleiades}/json`, { signal: AbortSignal.timeout(15000) });
  const title = r.ok ? ((await r.json()) as { title: string }).title : `HTTP ${r.status}`;
  const ours = [p.name.ancient.en, p.name.modern?.en ?? ""].join(" ");
  const theirs = tokens(title);
  const ok = [...tokens(ours)].some((t) => [...theirs].some((u) => u.startsWith(t.slice(0, 5)) || t.startsWith(u.slice(0, 5))));
  console.log(`| ${p.id} | ${ours} | ${title} | ${ok ? "ok" : "**CHECK**"} |`);
}
```

- [ ] **Step 4: Run tests and the reports**

Run: `pnpm test src/reports && pnpm i18n:report && pnpm links && pnpm check:pleiades`
Expected: tests PASS; i18n report shows `nl: N field(s) missing`; link check lists any failing URL (report only); Pleiades table shows `ok` for all seed places.

- [ ] **Step 5: Commit**

```bash
git add src/reports scripts/i18n-report.ts scripts/link-check.ts scripts/check-pleiades.ts
git commit -m "feat: translation, link and Pleiades reports

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: End-to-end tests, CI, GitHub Pages

**Files:**
- Create: `playwright.config.ts`, `e2e/explore.spec.ts`, `e2e/story.spec.ts`, `e2e/offline.spec.ts`, `.github/workflows/ci.yml`, `.github/workflows/links.yml`, `README.md`

**Interfaces:**
- Consumes: test ids from Tasks 8–10; seed ids from Task 5.
- Produces: CI that validates, unit-tests, builds, e2e-tests, and deploys `main` to `https://andrebaaij.github.io/church_history/`.

- [ ] **Step 1: Write Playwright config and specs**

`playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

const base = process.env.BASE_PATH ?? "/";
const url = `http://localhost:4173${base}`;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  use: { baseURL: url, launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } },
  webServer: { command: "pnpm preview --port 4173 --strictPort", url, reuseExistingServer: !process.env.CI },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

`e2e/explore.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("slider moves routes from remaining to done", async ({ page }) => {
  await page.goto("./");
  const map = page.getByTestId("map");
  await expect(map).toHaveAttribute("data-ready", "true");
  await expect(page.getByTestId("year-display")).toHaveText("30 AD");
  const before = Number(await map.getAttribute("data-done-legs"));
  await page.getByTestId("year-slider").fill("48");
  await expect(page.getByTestId("year-display")).toHaveText("48 AD");
  await expect.poll(async () => Number(await map.getAttribute("data-done-legs"))).toBeGreaterThan(before);
});

test("search opens sources for John on Patmos", async ({ page }) => {
  await page.goto("./");
  await page.getByTestId("search-input").fill("Revelation on")
  await page.getByTestId("search-result").first().click();
  const panel = page.getByTestId("detail-panel");
  await expect(panel).toContainText("Revelation 1:9");
  await expect(panel.getByTestId("grade-badge").first()).toHaveText("A");
  await expect(page).toHaveURL(/sel=john-receives-revelation/);
});

test("a shared link restores year and selection", async ({ page }) => {
  await page.goto("./?y=95&sel=john-patmos");
  await expect(page.getByTestId("year-display")).toHaveText("95 AD");
  await expect(page.getByTestId("detail-panel")).toContainText("Patmos");
});
```

`e2e/story.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("story mode: keys, notes, exit and resume", async ({ page }) => {
  await page.goto("./");
  await page.getByTestId("story-open").first().click();
  await expect(page.getByTestId("story-step")).toHaveText(/^1 \/ \d+$/);
  await page.keyboard.press("n");
  await expect(page.getByTestId("story-notes")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("story-step")).toHaveText(/^2 \/ \d+$/);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("search-input")).toBeVisible();
  await page.getByRole("button", { name: "Back to story" }).click();
  await expect(page.getByTestId("story-step")).toHaveText(/^2 \/ \d+$/);
});
```

`e2e/offline.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("works without internet: no cross-origin requests", async ({ page }) => {
  const external: string[] = [];
  await page.route("**/*", (route) => {
    const u = new URL(route.request().url());
    if (u.hostname !== "localhost") {
      external.push(u.href);
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("./");
  await expect(page.getByTestId("map")).toHaveAttribute("data-ready", "true");
  await page.getByTestId("year-slider").fill("95");
  await page.waitForLoadState("networkidle");
  expect(external).toEqual([]);
});
```

- [ ] **Step 2: Run e2e locally**

Run:
```bash
pnpm exec playwright install chromium
pnpm build && pnpm test:e2e
```
Expected: 5 tests PASS. If `data-ready` never becomes true, the cause is WebGL in headless Chromium; confirm the swiftshader args are applied before changing anything else.

- [ ] **Step 3: CI workflows**

`.github/workflows/ci.yml`:
```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: false }
jobs:
  build:
    runs-on: ubuntu-latest
    env: { BASE_PATH: /church_history/ }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
      - run: pnpm i18n:report
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
      - uses: actions/upload-pages-artifact@v3
        if: github.ref == 'refs/heads/main'
        with: { path: dist }
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Add `"packageManager": "pnpm@12.9.1"` to `package.json` so `pnpm/action-setup` picks the same version.

`.github/workflows/links.yml`:
```yaml
name: link-check
on:
  schedule: [{ cron: "0 6 * * 1" }]
  workflow_dispatch:
permissions: { contents: read }
jobs:
  links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm links
      - run: pnpm check:pleiades >> "$GITHUB_STEP_SUMMARY"
```

`README.md`:
```markdown
# Apostles Map (c. AD 30–100)

An interactive, source-backed map of the travels of the apostles, from the Ascension to
the death of John. Every route, stay and border is a *claim* with a reliability grade
(A–E) and exact citations. Live: https://andrebaaij.github.io/church_history/

## Develop
pnpm install
pnpm dev            # validates data, then starts Vite
pnpm test           # unit tests
pnpm build && pnpm test:e2e

## Editing data
All content is YAML in `data/` — see `docs/superpowers/specs/2026-10-13-ancient-world-map-design.md`.
`pnpm data` fails with `file › path: message` when a claim has no source or an id is unknown.

## Present offline
pnpm build && pnpm preview   # then disconnect; everything is served locally

Licences: code MIT · data CC BY-SA 4.0 · territory geometry GPL-3.0 (see data/).
```

- [ ] **Step 4: Enable Pages, push, verify**

Run:
```bash
gh api -X POST repos/andrebaaij/church_history/pages -f build_type=workflow
git add -A && git commit -m "ci: e2e tests, CI and GitHub Pages deploy

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
gh run watch --exit-status
curl -sI https://andrebaaij.github.io/church_history/ | head -1
```
Expected: run green; `HTTP/2 200`.

---

### Task 13: Content — grade clarification, research review, import

Content work. Runs as agent-deck child sessions (one per research file group, same five as the research phase) after Task 5 is on `main`. Each session writes **only** `data/journeys/<person>.yaml`, `data/sources/<person>.yaml`, `data/places/<person>.yaml`, and `research/import-issues/<person>.md`.

**Files:**
- Modify: `research/README.md` (grade B/A wording), `docs/superpowers/specs/2026-10-13-ancient-world-map-design.md` §3.1 (same wording)
- Create: per person `data/journeys/<person>.yaml`, `data/sources/<person>.yaml`, `data/places/<person>.yaml`, `research/import-issues/<person>.md`; `data/people.yaml` (all apostles — written by the coordinator only)

**Interfaces:**
- Consumes: schemas (Task 2), `pnpm data`, `pnpm check:pleiades`, research files, seed ids in `data/*/common.yaml`.
- Produces: journeys for every apostle in `research/apostles/`, passing `pnpm data`.

- [ ] **Step 1: Confirm the grade clarification with the maintainer**

Ask: "Josephus, Tacitus, Suetonius, Pliny and the *Periplus* are contemporary but not Christian. The plan grades them **B** (with Clement, Ignatius, Irenaeus), and grades contemporary inscriptions such as the Takht-i-Bahi stone **A**. OK?" Apply the confirmed wording to `research/README.md` and spec §3.1, then commit.

- [ ] **Step 2: Coordinator adds people and shared entries**

Write `data/people.yaml` with all persons from the research (`paul, peter, andrew, john, james-zebedee, james-brother-of-jesus, thomas, bartholomew, matthew, philip, james-alphaeus, thaddaeus-jude, simon-zealot, matthias`), each with a distinct, colour-blind-safe colour (use a qualitative palette such as Okabe-Ito extended; no two adjacent hues for apostles who share regions). Move sources cited by ≥2 research files (NT books, Eusebius HE, Irenaeus AH, Origen via Eusebius, Jerome *De viris illustribus*, Acts of Thomas, Josephus *Antiquities*) into `data/sources/common.yaml` and shared places (Rome, Alexandria, Edessa, Caesarea, Damascus, Hierapolis…) into `data/places/common.yaml`. Run `pnpm data` → green. Commit.

- [ ] **Step 3: Launch the five import sessions**

Write one brief per session to `$SCRATCH/import-<t>.md` (the text below, with `<files>` and `<person>` filled in per session: paul → `paul.md`; peter-andrew → `peter.md, andrew.md`; john-james → `john.md, james-zebedee.md, james-brother-of-jesus.md`; far-east-south → `thomas.md, bartholomew.md, matthew.md`; other-apostles → `philip.md, james-alphaeus.md, thaddaeus-jude.md, simon-zealot.md, matthias.md`). Then, from the parent session:
```bash
for t in paul peter-andrew john-james far-east-south other-apostles; do
  agent-deck launch --title "import-$t" --group church_history -c claude --message-file "$SCRATCH/import-$t.md" /Users/andrebaaij/church_history
done
```
Brief:
```
Import research/apostles/<files> into data/ per docs/superpowers/plans/2026-10-13-apostles-map.md Task 13.
Rules:
- Read research/README.md, the spec §3, src/schema/entities.ts, and data/*/common.yaml first. Reuse common ids; never redefine them.
- Write ONLY data/journeys/<person>.yaml, data/sources/<person>.yaml, data/places/<person>.yaml, research/import-issues/<person>.md.
- Each timeline row → a leg (movement A→B) or stay (time at a place) with its own claim; story details → episodes.
- Competing traditions → separate legs/stays whose claims list each other in alternativeTo.
- Rows or references marked UNVERIFIED are NOT imported; list them in research/import-issues/<person>.md.
- Vreugdenhil mentions → claim.referenceWorks [{ work: vreugdenhil, chapter, quote }].
- Sea legs: add `via` waypoints so lines stay at sea (check visually in `pnpm dev`).
- Loop until `pnpm data` passes. Then run `pnpm check:pleiades` and fix every **CHECK** row.
- No git commits.
End with ===AGENTDECK_DONE=== status=ok summary=<legs/stays/episodes counts, issues file path>
```

- [ ] **Step 4: Independent verification**

When all five report done, launch one **peer** verifier session (`-no-parent`) per import session, prompted to: pick 10 random citations from that person's YAML, open the cited passage online, and report for each whether the passage supports the claim text and whether the grade follows the Global Constraints. Fix every failure reported. Known issue to verify: the research files used `places/550812` for Perga, but that is **Pergamum**.

- [ ] **Step 5: Commit**

Run: `pnpm data && pnpm test && pnpm check:pleiades`
Expected: data ok, tests pass, no **CHECK** rows.
```bash
git add data research
git commit -m "content: import apostle journeys from research

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Content — territories and their changes AD 30–100

**Files:**
- Create: `scripts/geo-derive.ts`, `data/geo/changes/*.geojson`, `data/geo/territories/*.geojson`, `data/claims/territories.yaml`, `data/sources/territories.yaml`
- Modify: `data/territories.yaml`

**Interfaces:**
- Consumes: `extract-territory.ts`, schemas, `pnpm data`.
- Produces: `geo-derive.ts` CLI: `tsx scripts/geo-derive.ts <out.geojson> <base.geojson> [--minus <f.geojson>]... [--plus <f.geojson>]...` (paths relative to `data/geo/`).

- [ ] **Step 1: Implement the derive helper**

`scripts/geo-derive.ts`:
```ts
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { difference, featureCollection, union } from "@turf/turf";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

type Poly = Feature<Polygon | MultiPolygon>;
const ROOT = join(import.meta.dirname, "..", "data/geo");
const read = (p: string): Poly[] => {
  const g = JSON.parse(readFileSync(join(ROOT, p), "utf8")) as FeatureCollection | Feature;
  return (g.type === "FeatureCollection" ? g.features : [g]) as Poly[];
};
const merge = (fs: Poly[]): Poly => (fs.length === 1 ? fs[0] : (union(featureCollection(fs)) as Poly));

const [out, base, ...rest] = process.argv.slice(2);
if (!out || !base) throw new Error("usage: geo-derive <out> <base> [--minus f]... [--plus f]...");
let shape = merge(read(base));
for (let i = 0; i < rest.length; i += 2) {
  const other = merge(read(rest[i + 1]));
  const next = rest[i] === "--minus" ? difference(featureCollection([shape, other])) : union(featureCollection([shape, other]));
  if (!next) throw new Error(`${rest[i]} ${rest[i + 1]} produced an empty shape`);
  shape = next as Poly;
}
writeFileSync(join(ROOT, "territories", out), JSON.stringify(featureCollection([shape])));
console.log(`wrote territories/${out}`);
```

- [ ] **Step 2: Extract base polities**

For each name present in `world_bc1` / `world_100` within the map region — `Roman Empire`, `Parthian Empire`, `Kushan Empire`, `Axum`, `Meroe`, `Nabatean Kingdom`, `Armenia`, `Himyarite Kingdom`, `Satavahanihara`, `Hindu kingdoms`, `Saka Kingdom`, `Bosporian Kingdom` — run `pnpm tsx scripts/extract-territory.ts world_100 "<NAME>" <kebab-name>-100.geojson` (and `world_bc1` → `-1.geojson` where the shape differs). Expected: one file per polity.

- [ ] **Step 3: Draw change polygons and derive versions**

Draw rough change polygons in https://geojson.io and save them in `data/geo/changes/` (precision 1 = rough). Derive versions for these changes; **every change needs a claim with citations verified online before it is added**:

| Change | Years | Lead sources to verify |
|---|---|---|
| Judea a Roman province; Galilee/Perea under Herod Antipas | 30–39 | Josephus *Ant.* 17.13.5, 18.1.1; *Ant.* 18.7.2 (Antipas deposed 39); Luke 3:1 |
| Agrippa I king over Judea, Galilee, Perea (client kingdom) | 41–44 | Josephus *Ant.* 19.5.1, 19.8.2; Acts 12:1–23 |
| Judea a province again | 44–100 (revolt 66–70) | Josephus *Ant.* 19.9.2; *War* 2.14–20, 6–7 |
| Britain conquered, Roman Britain grows | from 43 | Suetonius *Claudius* 17; Cassius Dio 60.19–23; Tacitus *Agricola* 13–17 |
| Mauretania becomes provinces | 40–44 | Cassius Dio 59.25, 60.8–9 |
| Thrace becomes a province | 46 | Tacitus *Ann.* 2.67, 4.46–51 (context); provincial date from modern scholarship (cite it) |
| Commagene annexed | 72 | Josephus *War* 7.7.1–3 |
| Armenia: Parthian Arsacid king under Roman recognition | 63 onward | Tacitus *Ann.* 15.28–31 |
| Indo-Parthian kingdom (Gondophares) then Kushan expansion into NW India | c. 19–46; c. 50–100 | Takht-i-Bahi inscription; Rabatak inscription; modern chronology (cite it) |
| South Indian kingdoms (Chera, Pandya, Chola) | whole period | Pliny *NH* 6.26 (6.104–105); *Periplus* 54–58 |
| Meroë (Kingdom of Kush, ruled by the Kandake) | whole period | Acts 8:27; Strabo 17.1.54; Pliny *NH* 6.35 |
| Aksum | whole period | *Periplus* 4–5 |

Example derivation (Roman Empire before Britain):
```bash
pnpm tsx scripts/geo-derive.ts roman-empire-30.geojson territories/roman-empire-100.geojson --minus changes/britain-roman-100.geojson --minus changes/judea-region.geojson
```
Record each version in `data/territories.yaml` with `when`, `status`, `overlord` (client kingdoms), `precision`, `geometrySource: historical-basemaps` (or the change file's own source) and `claim`.

- [ ] **Step 4: Ancient coastlines (spec §4.1)**

Where the story needs it (Ephesus and Miletus harbours, which silted up after antiquity), draw "ancient sea" polygons in geojson.io and save them as `data/geo/base/ancient-sea.geojson`. Use only CC BY or public-domain references for the shapes, and add each reference as a `kind: dataset` or `modern-scholarship` source in `data/sources/territories.yaml` so it appears on the attribution page. Never use AWMC's CC BY-NC data.

In `scripts/build-data.ts`, after copying land/rivers, add:
```ts
const sea = join(DATA, "geo/base/ancient-sea.geojson");
writeFileSync(join(OUT, "data/ancient-sea.geojson"), existsSync(sea) ? readFileSync(sea) : JSON.stringify({ type: "FeatureCollection", features: [] }));
```
In `src/map/style.ts`, add the source `"ancient-sea": { type: "geojson", data: url("data/ancient-sea.geojson") }` and, directly after the `land` layer, `{ id: "ancient-sea", type: "fill", source: "ancient-sea", paint: { "fill-color": t.sea } }`. Add to `style.test.ts`: `expect(ids.indexOf("ancient-sea")).toBe(ids.indexOf("land") + 1)`. Run `pnpm test src/map` → PASS.

- [ ] **Step 5: Verify and commit**

Run: `pnpm data && pnpm dev`, then drag the slider through 39, 41, 43, 44, 46, 72. Expected: Judea switches client/province at the right years, Britain appears at 43, Commagene changes at 72, no gaps or overlaps that look wrong at zoom 4.
```bash
git add data scripts/geo-derive.ts scripts/build-data.ts src/map/style.ts src/map/style.test.ts
git commit -m "content: territories and sourced border changes AD 30–100

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Content — youth-evening story and visual check

**Files:**
- Create: `data/stories/youth-evening-1.yaml`, `data/media/media.yaml`, `data/media/files/*`, `docs/screenshots/*.png`

- [ ] **Step 1: Agree the outline with the maintainer**

Propose 12–18 steps from the imported data, for example: Jerusalem/Pentecost → Paul's first journey (Cyprus) → Council of Jerusalem → Paul in Corinth (Gallio) → Thomas: Parthia vs India (show the A–E difference) → the Red Sea route to Muziris → Ethiopia: Meroë and the Kandake (Acts 8) → Peter and Paul in Rome under Nero → Jerusalem destroyed (70) → John on Patmos → John's death (c. 100). Include at least two question steps for the group. Get the maintainer's yes on the outline and the evening date before writing.

- [ ] **Step 2: Write the story**

Build each step in `pnpm dev` with "Copy as story step"; paste into `data/stories/youth-evening-1.yaml`; write text and speaker notes. Add illustrations only with a recorded licence (public-domain art from Wikimedia Commons is fine), each as `role: illustration` in `data/media/media.yaml`. Run `pnpm data` until green.

- [ ] **Step 3: Visual check (both themes)**

Run `pnpm build && pnpm preview`. Take screenshots of 4 representative steps in the default and projector themes (`docs/screenshots/`). Check on a real projector or a dimmed screen at 3 m: labels readable, grade line styles distinguishable, story card legible. Fix contrast or sizes in `THEMES` if not.

- [ ] **Step 4: Dry run offline**

Turn off Wi-Fi, run `pnpm preview`, click through the whole story with the clicker/arrow keys, including `Esc` → explore → "Back to story". Expected: no broken images, no blank labels.

- [ ] **Step 5: Commit and push**

```bash
git add data docs/screenshots
git commit -m "content: youth evening story

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```
