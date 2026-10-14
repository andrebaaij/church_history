import { useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { FilterSpecification, GeoJSONSource } from "maplibre-gl";
import type { Dataset } from "../model/dataset";
import type { Index } from "../model/index";
import type { Camera } from "../model/focus";
import type { Filters, ThemeName } from "../state/urlState";
import type { AppState } from "../state/store";
import { buildStyle, INTERACTIVE_LAYERS, TERRITORY_LAYERS, territoryFilter } from "./style";
import { buildPlaceFeatures, buildRouteFeatures, buildStayFeatures } from "./features";
import { hatchImage } from "./hatch";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

// Bundle MapLibre's worker with Vite so it loads from our own origin in dev and production.
maplibregl.setWorkerUrl(workerUrl);

export type MapViewProps = {
  ds: Dataset; idx: Index; year: number; filters: Filters; lang: string; theme: ThemeName;
  selected: string | null; highlight: string[]; flyRequest: AppState["flyRequest"]; initialCamera: Camera;
  onSelect(id: string | null): void; onCameraChange(c: Camera): void; onFlown(): void;
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
    // MapLibre 6 resolves pattern images on demand; event listeners can no longer supply them.
    map.setMissingStyleImageResolver((id) => {
      if (id === "hatch" && !map.hasImage("hatch")) map.addImage("hatch", hatchImage());
    });
    let frame = 0;
    const pulse = (t: number) => {
      if (map.getLayer("stays-halo")) map.setPaintProperty("stays-halo", "circle-radius", 12 + 4 * Math.sin(t / 400));
      frame = requestAnimationFrame(pulse);
    };
    // Start the pulse only after "load": a repaint every frame keeps the map from ever going idle.
    map.on("load", () => {
      setReady(true);
      frame = requestAnimationFrame(pulse);
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
      map.setFilter(id, (extra ? ["all", f, extra] : f) as FilterSpecification);
    }
  }, [ready, routes, stays, places, props.year]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const ids = [props.selected, ...props.highlight].filter(Boolean);
    // Highlight a selected leg, or every leg of a selected person.
    map.setFilter("territory-highlight", ["all", ["in", ["get", "id"], ["literal", ids]], territoryFilter(props.year)] as FilterSpecification);
    map.setFilter("route-highlight", ["any", ["in", ["get", "id"], ["literal", ids]], ["in", ["get", "person"], ["literal", ids]]]);
  }, [ready, props.selected, props.highlight, props.year]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !props.flyRequest) return;
    const { center, zoom, bearing } = props.flyRequest.camera;
    map.flyTo({ center, zoom, bearing, duration: 2000, essential: true });
    // Consume the request so a remount (theme/language change) does not replay it.
    latest.current.onFlown();
  }, [ready, props.flyRequest?.seq]);

  const doneLegs = routes.features.filter((f) => f.properties?.part === "done").length;
  return <div ref={container} className="map" data-testid="map" data-ready={ready} data-done-legs={doneLegs} />;
}
