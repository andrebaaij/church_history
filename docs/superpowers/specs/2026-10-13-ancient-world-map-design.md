# Apostles Map (c. AD 30–100) — Design Spec

Date: 2026-10-13 · Status: draft for review · Repo: `andrebaaij/church_history`

## 1. Purpose and audience

An interactive, source-backed map of the world c. AD 30–100 that follows the
travels of the apostles — from the Ascension to the death of John — including the
farthest traditions (Thomas to India, apostles to "Ethiopia").

Audiences, in order:

1. **Youth group evening** (first use, in ~1 month): presented on a projector as a
   guided story.
2. **Teachers and others**: explore freely at home or in class, check every claim
   against its sources.
3. **Research**: every element on the map is traceable to a cited source with a
   reliability grade.

Core principle: **"Claude says so" doesn't count.** Nothing appears on the map
without a citable source. This is enforced by the build, not by discipline.

Interface language: English, with i18n from day one (Dutch is the expected second
language).

## 2. Decisions taken

| Topic | Decision |
|---|---|
| Uncertainty | Show all competing traditions, each with sources and grade |
| Reliability | Grade **A–E per claim** (not per source) — see §3.1 |
| Modern retellings | "Reference works" (e.g. Vreugdenhil), shown but never graded |
| Time | Year slider, Ascension (c. 30/33) to death of John (c. 100) |
| Data editing | Only the maintainer, as files in git (no CMS, no backend) |
| Modes | Story mode (presentation) + Explore mode (free use) |
| Rendering | Own vector map with MapLibre GL JS |
| Hosting | Static site on GitHub Pages; runs offline from a laptop |
| Visibility | Public, open source |

## 3. Data model

Everything shown on the map is a **claim** (or hangs off one), and every claim
carries its sources.

### 3.1 Reliability grades

| Grade | Meaning | Examples |
|---|---|---|
| A | New Testament text, or archaeology corroborating it | Acts 13–28; Gallio inscription (Delphi) |
| B | Early church writers within ~150 years | 1 Clement (c. 96), Ignatius, Papias, Irenaeus (c. 180) |
| C | Later church writers relaying older material | Eusebius (c. 300), Origen via Eusebius, Jerome |
| D | Apocryphal acts and legend | Acts of Thomas (3rd c.), Acts of Andrew, Acts of John by Prochorus |
| E | Local tradition without an early written source | Thomas in Kerala/Mylapore; Cave of the Apocalypse on Patmos |

A claim's grade is set by its **earliest traceable source** for that specific
statement; the same author can yield different grades (Eusebius quoting a
2nd-century document vs. Eusebius reporting "it is said").

**Reference works** (no grade): modern retellings recognised by the audience. The
first is J. Vreugdenhil, *Church History for Young and Old* (Dutch: *Kerkgeschiedenis
voor jong en oud*), English chapters at
https://defenceofthetruth.com/church-history/church-history-for-young-and-old/.
A claim shows "also told by Vreugdenhil, ch. N" next to the graded ancient source
it rests on.

### 3.2 Entities

| Entity | Fields | References |
|---|---|---|
| **Source** | id, author, work, written (year range), kind (scripture / church-writer / apocryphon / inscription / tradition / modern-scholarship), edition/translation, url | — |
| **ReferenceWork** | id, author, title, chapter, url | — |
| **Claim** | id, text (i18n), when, grade, citations[] {source, locator, quote?}, referenceWorks[] {work, chapter, quote?}, alternativeTo[] , notes (i18n) | Source, ReferenceWork, Claim |
| **Person** | id, name (i18n), role (apostle / emperor / king / other), colour | — |
| **Place** | id, name {ancient, modern} (i18n), coords, pleiades?, kind (city / region / island), exists (when), locationClaim | Claim |
| **Territory** | id, name (i18n), versions[] {when, status (empire / province / client-kingdom / kingdom), overlord?, geometry ref, precision 1–3, claim} | Claim, Territory, GeoJSON |
| **Journey** | id, person, items[]: Leg or Stay | Person |
| **Leg** | id, from, to, via[] (waypoints), when, mode (land / sea), claim, episodes[] | Place, Claim, Episode |
| **Stay** | id, place, when, claim, episodes[] | Place, Claim, Episode |
| **Episode** | id, title (i18n), text (i18n), when, claim, media[] | Claim, Media |
| **Media** | id, file, kind (image / video), caption (i18n), role (evidence / illustration), licence, creator, sourceUrl, claim (required when role = evidence) | Claim |
| **Story** | id, title (i18n), steps[] | Step |
| **Step** | year, camera {center, zoom, bearing?}, highlight[] (entity ids), content: episode ref **or** free text (i18n), notes (speaker notes, i18n) | Episode, any entity |

**Time** — every time-bound item has `when: { from, to, circa }` with integer years
(AD positive). An item is visible at slider year *y* when `from ≤ y ≤ to`.
Uncertain items render their whole range.

**Competing traditions** — separate claims linked through `alternativeTo`
(must be symmetric). The map draws all of them; the panel shows them side by side.

**Media role** — `evidence` (e.g. photo of an inscription; must itself cite a
source) vs. `illustration` (later art, modern landscape photo), which is labelled
"illustration — not evidence".

### 3.3 Storage layout

```
data/
  sources.yaml            # all Sources and ReferenceWorks
  people.yaml
  places.yaml
  territories.yaml        # metadata + versions; geometry in geo/
  geo/territories/*.geojson
  journeys/<person>.yaml  # Legs, Stays, Episodes, their Claims
  media/<files> + media.yaml
  stories/<story>.yaml
research/                 # raw research notes (Markdown), input to data/
```

Text fields that are translatable are written inline as `{ en: "...", nl: "..." }`.

Example (illustrative — exact references come from research):

```yaml
# data/journeys/john.yaml
- stay:
    id: john-patmos
    place: patmos
    when: { from: 95, to: 96, circa: true }
    claim: john-on-patmos
    episodes:
      - id: john-receives-revelation
        title: { en: "The Revelation on Patmos" }
        text: { en: "John writes that he was on the island called Patmos..." }
        when: { from: 95, to: 96, circa: true }
        claim: john-revelation-patmos      # grade A, Rev 1:9
        media: [patmos-landscape]          # role: illustration
```

### 3.4 Research → data

The research notes in `research/apostles/*.md` (written to a shared brief, see
`research/README.md`) are converted to `data/` YAML in one pass. References that
don't map cleanly (missing locator, `UNVERIFIED` marks) are listed for manual
resolution — they are not imported as graded claims until resolved.

## 4. Map display

Layers, bottom to top:

1. **Physical base** — land, sea, relief, rivers from Natural Earth (public domain);
   no modern borders, roads or cities. Ancient coastlines corrected where the story
   needs it (e.g. Ephesus, Miletus) using CC BY sources only (not AWMC's CC BY-NC
   data).
2. **Territories** — fill colour per power (Rome, Parthia, Kushan, Aksum, Meroë,
   Nabataea, Armenia, Indian kingdoms). Client kingdoms: hatching in the overlord's
   colour. Border precision rendered as edge softness (less precise → wider blur).
   Versions switch with the slider (e.g. Judea becomes a province in AD 6).
   Starting geometry: historical-basemaps `world_bc1` / `world_100` (GPL-3.0),
   refined with DARE (Roman provinces) and own sourced work (South India, Judea).
3. **Places** — only story-relevant places plus major cities; label = ancient name,
   modern name smaller; zoom-dependent label density. Places from Pleiades where
   possible.
4. **Routes and stays** — **colour = person, line style = grade** (A solid,
   B long dash, C short dash, D dotted, E sparse dots); reliability never depends
   on colour alone. Sea legs follow waypoints along plausible sailing routes.
   Travelled part of a route solid, remainder faded, relative to slider year.
   Active stays: marker with subtle pulse.

Always visible: the current year in large type with uncertainty ("c. 95 AD"), and
the A–E legend (compact in explore mode; can be hidden in story mode).

Clicking any element opens the detail panel: claim, grade, sources with exact
locators and links, reference-work mentions, episodes, media.

Themes: **default** (calm atlas palette) and **projector** (higher contrast, larger
labels, thicker lines).

## 5. Interface

### 5.1 Explore mode

```
┌──────────────────────────────────────────────────────────────┐
│ [Search place/person]          c. 51 AD        [EN ▾] [⚙]    │
├────────────┬───────────────────────────────┬─────────────────┤
│ Filters    │                               │ Detail panel    │
│ people     │            MAP                │ claim, grade,   │
│ grades A–E │                               │ sources, media  │
├────────────┴───────────────────────────────┴─────────────────┤
│ ▶  30 ──●─────────────────────────────────────── 100         │
│     ▴key events (clickable)                                   │
└──────────────────────────────────────────────────────────────┘
```

- Year slider with play (animate the century) and clickable key-event markers.
- Filters by person and by grade (e.g. "only A", "A–C", "all").
- Full state in the URL (year, camera, selection, filters) → shareable links.
- Mobile: panels become bottom sheets, map stays full screen.

### 5.2 Story mode

- Full-screen map + year + one text card per step (with media when the step
  references an episode).
- Navigation: arrow keys, space, presenter clicker (PageUp/PageDown).
- Each step flies the camera and animates the slider to the step's year.
- `N` toggles speaker notes; `Esc` drops into explore mode at the same state;
  "Back to story" resumes.

### 5.3 Story authoring

Stories are YAML files in `data/stories/`. In development builds, explore mode has
a **"Copy as step"** button that puts the current year, camera, and selection on
the clipboard as a YAML step.

## 6. Build, hosting, testing

**Stack**: Vite, React, TypeScript, MapLibre GL JS, Zod, i18next, Vitest,
Playwright.

**Data pipeline** (build step): read `data/**` YAML + GeoJSON → validate with Zod →
emit compact JSON per layer. The app only loads validated output.

**Hosting**: GitHub Actions on push to `main`: validate → test → build → publish to
GitHub Pages. The same static build is used offline at the evening
(`npm run preview` or opening the built folder).

**Testing**

| Layer | Checks | Blocking |
|---|---|---|
| Data validation | every claim has a grade and ≥1 citation; all ids resolve; media has licence + creator; `when` ranges valid; `alternativeTo` symmetric; `evidence` media cites a source | yes |
| Translation report | missing fields per language | no (report) |
| Link check | source URLs reachable (weekly) | no (report) |
| Unit (Vitest) | time filtering, grade → line style, URL state | yes |
| E2E (Playwright) | slider changes visible routes; click shows correct sources; story keys + Esc; works with network disabled | yes |
| Visual | screenshots, default + projector theme, reviewed by hand | before the evening |

## 7. Licensing

- Project is **public**. Code: MIT. Own data: CC BY-SA 4.0.
- Territory geometry derived from historical-basemaps is **GPL-3.0** and kept in
  `data/geo/` under that licence, stated in a LICENSE note there.
- Pleiades (CC BY), DARE (CC BY / BY-SA), Natural Earth (public domain): credited on
  a "Sources & attribution" page.
- Every media file carries its own licence in `media.yaml`.

## 8. Scope

**Version 1 (youth group evening, ~1 month)**

- Physical base map; territories with the key changes c. 30–100.
- Places, journeys, stays and episodes for all apostles from the research.
- Explore mode with filters; story mode with one story; projector theme.
- Offline use; GitHub Pages deployment; English UI with i18n wiring.

**Later**

- Dutch translation; more stories; Roman roads; "suggest a correction" link;
  finer borders outside the Roman Empire; PMTiles if base-map size demands it.

**Out of scope**: user accounts, online editing, backend/database.

## 9. Open items

- Make the GitHub repo public (currently private) — at the maintainer's go-ahead.
- Date of the youth group evening, to pin the v1 deadline.
- Research files are written but not yet reviewed against the brief; review and
  reference spot-checks precede import (§3.4).
