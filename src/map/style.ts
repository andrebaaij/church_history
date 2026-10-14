import type { ExpressionSpecification, FilterSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";
import { GRADES } from "../schema/common";
import { GRADE_DASH } from "../model/grades";
import type { ThemeName } from "../state/urlState";

export type Theme = { sea: string; land: string; river: string; territoryOpacity: number; label: string; halo: string; lineWidth: number; textSize: number; fadedOpacity: number };

export const THEMES: Record<ThemeName, Theme> = {
  default: { sea: "#bfd2d5", land: "#f2e8d0", river: "#96b3bb", territoryOpacity: 0.3, label: "#3b2f22", halo: "#f7f1e3", lineWidth: 3, textSize: 13, fadedOpacity: 0.3 },
  projector: { sea: "#9fbcc4", land: "#f6ecd2", river: "#6f97a8", territoryOpacity: 0.42, label: "#1b140c", halo: "#ffffff", lineWidth: 5, textSize: 18, fadedOpacity: 0.4 },
};

export function territoryFilter(year: number): ExpressionSpecification {
  return ["all", ["<=", ["get", "from"], year], [">=", ["get", "to"], year]];
}

/** Layers whose filter depends on the year; `extra` is AND-ed with territoryFilter. */
export const TERRITORY_LAYERS: { id: string; extra?: ExpressionSpecification }[] = [
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
const FONT_MEDIUM = ["Noto Sans Medium"];
const FONT_ITALIC = ["Noto Sans Italic"];

export function buildStyle(themeName: ThemeName, origin: string, base: string, lang: string): StyleSpecification {
  const t = THEMES[themeName];
  const url = (p: string) => `${origin}${base}${p}`;
  const empty = () => ({ type: "geojson" as const, data: { type: "FeatureCollection" as const, features: [] } });

  const routeLayers: LayerSpecification[] = (["remaining", "done"] as const).flatMap((part) =>
    GRADES.map((g): LayerSpecification => {
      const dash = GRADE_DASH[g];
      return {
        id: `routes-${part}-${g}`,
        type: "line",
        source: "routes",
        filter: ["all", ["==", ["get", "part"], part], ["==", ["get", "grade"], g]],
        layout: { "line-cap": dash && dash[0] < 1 ? "round" : "butt", "line-join": "round" },
        paint: {
          "line-color": ["get", "color"],
          "line-width": t.lineWidth,
          "line-opacity": part === "done" ? 1 : t.fadedOpacity,
          ...(dash ? { "line-dasharray": dash } : {}),
        },
      };
    }),
  );

  return {
    version: 8,
    glyphs: url("fonts/{fontstack}/{range}.pbf"),
    sources: {
      land: { type: "geojson", data: url("data/land.geojson") },
      "ancient-sea": { type: "geojson", data: url("data/ancient-sea.geojson") },
      rivers: { type: "geojson", data: url("data/rivers.geojson") },
      territories: { type: "geojson", data: url("data/territories.geojson") },
      "territory-labels": { type: "geojson", data: url("data/territory-labels.geojson") },
      routes: empty(),
      stays: empty(),
      places: empty(),
    },
    layers: [
      { id: "sea", type: "background", paint: { "background-color": t.sea } },
      { id: "land", type: "fill", source: "land", paint: { "fill-color": t.land } },
      // Where the sea reached further in antiquity (e.g. silted harbours of Ephesus and Miletus).
      { id: "ancient-sea", type: "fill", source: "ancient-sea", paint: { "fill-color": t.sea } },
      { id: "coast", type: "line", source: "land", paint: { "line-color": "#b8a47e", "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.4, 8, 1.2], "line-opacity": 0.7 } },
      { id: "rivers", type: "line", source: "rivers", paint: { "line-color": t.river, "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.5, 8, 1.6] } },
      { id: "territory-fill", type: "fill", source: "territories", filter: territoryFilter(0), paint: { "fill-color": ["get", "fillColor"], "fill-opacity": ["interpolate", ["linear"], ["zoom"], 2, t.territoryOpacity, 8, t.territoryOpacity * 0.45] } },
      { id: "territory-hatch", type: "fill", source: "territories", filter: ["all", territoryFilter(0), ["==", ["get", "status"], "client-kingdom"]], paint: { "fill-pattern": "hatch", "fill-opacity": 0.55 } },
      { id: "territory-edge", type: "line", source: "territories", filter: territoryFilter(0), paint: { "line-color": ["get", "color"], "line-opacity": 0.75, "line-width": ["interpolate", ["linear"], ["zoom"], 2, 1, 8, 2.5], "line-blur": ["match", ["get", "precision"], 1, 5, 2, 2.5, 0.5] } },
      {
        id: "territory-label",
        type: "symbol",
        source: "territory-labels",
        filter: territoryFilter(0),
        layout: {
          "text-field": ["coalesce", ["get", `name:${lang}`], ["get", "name:en"]],
          "text-font": FONT_ITALIC,
          "text-size": ["interpolate", ["linear"], ["get", "area"], 1, t.textSize - 2, 40, t.textSize + 1, 400, t.textSize + 6],
          "text-transform": "uppercase",
          "text-letter-spacing": 0.2,
          "text-max-width": 9,
          "symbol-sort-key": ["-", 0, ["get", "area"]],
        },
        paint: { "text-color": t.label, "text-opacity": 0.6, "text-halo-color": t.halo, "text-halo-width": 1.2 },
      },
      { id: "routes-casing", type: "line", source: "routes", filter: ["==", ["get", "part"], "done"], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": t.halo, "line-width": t.lineWidth + 4, "line-opacity": 0.85 } },
      ...routeLayers,
      { id: "route-highlight", type: "line", source: "routes", filter: ["in", ["get", "id"], ["literal", []]], paint: { "line-color": "#f1c40f", "line-width": t.lineWidth * 3, "line-opacity": 0.5, "line-blur": 2 } },
      { id: "stays-halo", type: "circle", source: "stays", paint: { "circle-color": ["get", "color"], "circle-opacity": 0.25, "circle-radius": 14 } },
      { id: "stays", type: "circle", source: "stays", paint: { "circle-color": ["get", "color"], "circle-radius": 7, "circle-stroke-color": "#fff", "circle-stroke-width": 2 } },
      { id: "places-dot", type: "circle", source: "places", paint: { "circle-color": t.label, "circle-radius": ["interpolate", ["linear"], ["get", "rank"], 0, 2.5, 6, 5], "circle-stroke-color": t.halo, "circle-stroke-width": 1.5 } },
      {
        id: "places-label",
        type: "symbol",
        source: "places",
        layout: {
          "text-field": ["format", ["get", "ancient"], { "text-font": ["literal", FONT_MEDIUM] }, "\n", {}, ["get", "modern"], { "font-scale": 0.78, "text-font": ["literal", FONT_ITALIC] }],
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
