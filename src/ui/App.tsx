import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import type { Dataset } from "../model/dataset";
import { buildIndex } from "../model/index";
import { describeEntity } from "../model/detail";
import { DEFAULT_CAMERA, focusFor, startYearFor } from "../model/focus";
import { clampYear, eraAt } from "../model/time";
import { tx } from "../i18n/tx";
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
import { Intro } from "./Intro";
import { StoryMode } from "../story/StoryMode";
import { stepYaml } from "../story/story";
import "./app.css";

export function App() {
  const { t } = useTranslation();
  const data = useDataset();
  if (data.status === "loading") return <div data-testid="app" className="loading"><span className="loading-mark">✦</span> {t("app.loading")}</div>;
  if (data.status === "error") return <div data-testid="app" className="loading" role="alert">{t("app.loadError")} ({data.message})</div>;
  return <Loaded ds={data.dataset} />;
}

export function Loaded({ ds }: { ds: Dataset }) {
  const { t } = useTranslation();
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
  const [showIntro, setShowIntro] = useState(() => {
    if (location.search.includes("sel=") || location.search.includes("story=")) return false;
    try {
      return localStorage.getItem("intro-seen") !== "1";
    } catch {
      return true;
    }
  });
  const closeIntro = () => {
    setShowIntro(false);
    try {
      localStorage.setItem("intro-seen", "1");
    } catch {
      /* storage unavailable: the card will simply show again next visit */
    }
  };

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
  const era = eraAt(ds.timeline.eras, state.year);
  const circa = state.mode === "story" && !!(state.selected && idx.episodes.get(state.selected)?.episode.when.circa);
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
      <div className="vignette" aria-hidden />
      <YearDisplay
        year={state.year}
        circa={circa}
        era={era ? tx(era.label, state.lang) : undefined}
        onEra={era && state.mode === "explore" ? () => select(era.claim) : undefined}
      />
      {state.mode === "story" && story ? (
        <>
          <StoryMode story={story} state={state} dispatch={dispatch} idx={idx} lang={state.lang} />
          <Legend />
        </>
      ) : (
        <>
          <header className="topbar">
            <div className="brand">
              <span className="brand-mark" aria-hidden>✦</span>
              <div>
                <h1>{t("app.title")}</h1>
                <p>{t("app.subtitle")}</p>
              </div>
            </div>
            <Search ds={ds} idx={idx} lang={state.lang} onPick={(r) => (r.kind === "person" ? select(r.id) : focus(r.id))} />
            {story && <button className="btn" onClick={() => dispatch({ type: "resumeStory" })}>{t("story.back")}</button>}
            <Settings
              lang={state.lang} theme={state.theme} stories={ds.stories}
              onLang={(lang) => dispatch({ type: "setLang", lang })}
              onTheme={(theme) => dispatch({ type: "setTheme", theme })}
              onStory={(id) => dispatch({ type: "startStory", id })}
              onAttribution={() => setShowAttribution(true)}
              onHelp={() => setShowIntro(true)}
              copyStep={copyStep}
            />
          </header>
          <Filters
            people={ds.people} filters={state.filters} lang={state.lang}
            onTogglePerson={(id) => dispatch({ type: "togglePerson", id, all: ds.people.map((p) => p.id) })}
            onToggleGrade={(grade) => dispatch({ type: "toggleGrade", grade })}
            onOpenPerson={select}
          />
          {showIntro && !detail && (
            <Intro
              storyTitle={ds.stories[0] ? tx(ds.stories[0].title, state.lang) : undefined}
              onStory={ds.stories[0] ? () => { closeIntro(); dispatch({ type: "startStory", id: ds.stories[0].id }); } : undefined}
              onClose={closeIntro}
            />
          )}
          {detail && <DetailPanel detail={detail} lang={state.lang} idx={idx} onSelect={focus} onClose={() => select(null)} />}
          <YearSlider ds={ds} timeline={ds.timeline} year={state.year} lang={state.lang} filters={state.filters} selected={state.selected} onYear={setYear} onSelect={focus} />
        </>
      )}
      {showAttribution && <Attribution ds={ds} onClose={() => setShowAttribution(false)} />}
    </div>
  );
}
