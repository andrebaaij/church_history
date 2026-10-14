import type { ExpressionSpecification, FilterSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";
import { GRADES } from "../schema/common";
import { GRADE_DASH } from "../model/grades";
import type { ThemeName } from "../state/urlState";

export type Theme = { sea: string; land: string; river: string; territoryOpacity: number; label: string; halo: string; lineWidth: number; textSize: number; fadedOpacity: number };

export const THEMES: Record<ThemeName, Theme> = {
  default: { sea: "#c9d6dc", land: "#efe6d2", river: "#9fb7c2", territoryOpacity: 0.28, label: "#3b2f22", halo: "#f7f1e3", lineWidth: 3, textSize: 13, fadedOpacity: 0.3 },
  projector: { sea: "#a9c1cc", land: "#f4ead2", river: "#6f97a8", territoryOpacity: 0.4, label: "#1b140c", halo: "#ffffff", lineWidth: 5, textSize: 18, fadedOpacity: 0.4 },
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
      rivers: { type: "geojson", data: url("data/rivers.geojson") },
      territories: { type: "geojson", data: url("data/territories.geojson") },
      routes: empty(),
      stays: empty(),
      places: empty(),
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
