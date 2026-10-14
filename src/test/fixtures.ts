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
    timeline: { start: { year: 30, circa: true, claim: "c-start" }, end: { year: 100, circa: true, claim: "c-end" }, keyEvents: [], eras: [] },
  };
}
