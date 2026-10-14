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
  const last = story.steps.length - 1;
  const stepIndex = Math.min(state.step, last);
  const step = story.steps[stepIndex];
  const yearRef = useRef(state.year);
  yearRef.current = state.year;

  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    const target = story.steps[n];
    dispatch({ type: "gotoStep", step: n, camera: target.camera, selected: target.episode ?? target.highlight[0] ?? null, highlight: target.highlight });
  };
  const goRef = useRef(go);
  goRef.current = go;

  // Enter the current step (camera + selection) on mount and whenever the index changes.
  useEffect(() => {
    goRef.current(stepIndex);
  }, [stepIndex, story.id]);

  // Animate the slider year to the step's year, so the audience sees time pass.
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
  }, [step.year, stepIndex, dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const a = keyToStoryAction(e.key);
      if (!a) return;
      e.preventDefault();
      if (a === "next") goRef.current(stepIndex + 1);
      if (a === "prev") goRef.current(stepIndex - 1);
      if (a === "notes") dispatch({ type: "toggleNotes" });
      if (a === "exit") dispatch({ type: "exitStory" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepIndex, dispatch]);

  const episode = step.episode ? describeEntity(step.episode, idx) : null;
  const person = episode?.person ? idx.people.get(episode.person) : undefined;
  const claim = episode?.claims[0];
  const media = episode?.media[0];

  return (
    <div className="story" style={person ? ({ "--accent-person": person.color } as React.CSSProperties) : undefined}>
      <div className="story-top">
        <p className="story-title">{tx(story.title, lang)}</p>
        <div className="story-progress" aria-hidden>
          {story.steps.map((_, i) => (
            <button key={i} tabIndex={-1} className={`seg ${i < stepIndex ? "past" : i === stepIndex ? "now" : ""}`} onClick={() => go(i)} />
          ))}
        </div>
      </div>

      <article className="story-card" data-testid="story-card" key={stepIndex}>
        {episode ? (
          <>
            <p className="eyebrow">
              {person && <><span className="swatch" style={{ background: person.color }} /> {tx(person.name, lang)} · </>}
              {t(episode.when?.circa ? "year.circa" : "year.exact", { year: episode.when?.from })}
            </p>
            <h2>{tx(episode.title, lang)}</h2>
            {media && <img src={`${import.meta.env.BASE_URL}media/${media.file}`} alt={tx(media.caption, lang)} />}
            <p className="story-text">{tx(idx.episodes.get(step.episode!)!.episode.text, lang)}</p>
            {claim && (
              <p className="story-source">
                <span className={`grade grade-${claim.claim.grade}`} title={t(`grade.${claim.claim.grade}`)}>{claim.claim.grade}</span>
                <span>{claim.citations.map((c) => `${c.source.work} ${c.locator}`).join(" · ")}</span>
              </p>
            )}
          </>
        ) : (
          <p className="story-text lead">{tx(step.text, lang)}</p>
        )}
        <nav className="story-nav">
          <button className="btn" onClick={() => go(stepIndex - 1)} disabled={stepIndex === 0} aria-label={t("story.prev")}>←</button>
          <span className="story-count" data-testid="story-step">{t("story.step", { n: stepIndex + 1, total: story.steps.length })}</span>
          <button className="btn primary" onClick={() => go(stepIndex + 1)} disabled={stepIndex === last} aria-label={t("story.next")}>→</button>
          <span className="spacer" />
          <button className="btn ghost" onClick={() => dispatch({ type: "exitStory" })}>{t("story.exit")}</button>
          <button className="btn ghost" onClick={() => dispatch({ type: "closeStory" })}>{t("story.close")}</button>
        </nav>
      </article>

      {state.showNotes && step.notes && (
        <aside className="story-notes" data-testid="story-notes">
          <p className="eyebrow">{t("story.notes")}</p>
          {tx(step.notes, lang)}
        </aside>
      )}
      <p className="story-keys">{t("story.keys")}</p>
    </div>
  );
}
