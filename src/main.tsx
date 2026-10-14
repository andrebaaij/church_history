import { createRoot } from "react-dom/client";
import "maplibre-gl/dist/maplibre-gl.css";
import "@fontsource/eb-garamond/500.css";
import "@fontsource/eb-garamond/600.css";
import "@fontsource/eb-garamond/500-italic.css";
import "@fontsource-variable/inter";
import { initI18n } from "./i18n";
import { App } from "./ui/App";

initI18n();
createRoot(document.getElementById("root")!).render(<App />);
