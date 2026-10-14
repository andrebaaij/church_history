import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Timeline } from "../schema/entities";
import type { Dataset } from "../model/dataset";
import type { Filters } from "../state/urlState";
import { tx } from "../i18n/tx";

type Props = {
  ds: Dataset; timeline: Timeline; year: number; lang: string; filters: Filters; selected: string | null;
  onYear(y: number): void; onSelect(id: string): void;
};

export function YearSlider({ ds, timeline, year, lang, filters, selected, onYear, onSelect }: Props) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const min = timeline.start.year;
  const max = timeline.end.year;
  useEffect(() => {
    if (!playing) return;
    if (year >= max) {
      setPlaying(false);
      return;
    }
    const h = setTimeout(() => onYear(year + 1), 450);
    return () => clearTimeout(h);
  }, [playing, year, max, onYear]);
  const pct = (y: number) => `${((Math.min(max, Math.max(min, y)) - min) / (max - min)) * 100}%`;
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let y = Math.ceil(min / 10) * 10; y <= max; y += 10) out.push(y);
    return out;
  }, [min, max]);
  const lanes = ds.journeys
    .filter((j) => filters.people === null || filters.people.includes(j.person))
    .map((j) => ({ person: ds.people.find((p) => p.id === j.person)!, items: j.items }));

  return (
    <div className="timeline">
      <button className="play" onClick={() => setPlaying((p) => !p)} aria-label={t(playing ? "slider.pause" : "slider.play")}>
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="timeline-body">
        <div className="track">
          <div className="lanes" aria-hidden>
            {lanes.map(({ person, items }) => (
              <div key={person.id} className="lane" title={tx(person.name, lang)}>
                {items.map((it) => (
                  <button
                    key={it.id}
                    tabIndex={-1}
                    className={`span ${it.type} ${selected === it.id ? "selected" : ""}`}
                    style={{ left: pct(it.when.from), width: `max(6px, calc(${pct(it.when.to + 1)} - ${pct(it.when.from)}))`, background: person.color }}
                    onClick={() => { onYear(Math.max(min, it.when.from)); onSelect(it.id); }}
                  />
                ))}
              </div>
            ))}
          </div>
          <input data-testid="year-slider" type="range" min={min} max={max} value={year} aria-label={t("slider.label")} onChange={(e) => onYear(Number(e.target.value))} />
          <div className="cursor" style={{ left: pct(year) }} aria-hidden />
        </div>
        <div className="ticks" aria-hidden>
          <button className="tick endpoint" style={{ left: "0%" }} onClick={() => onSelect(timeline.start.claim)} tabIndex={-1}>
            {timeline.start.circa ? `c. ${min}` : min}
          </button>
          {ticks.filter((y) => y !== min && y !== max).map((y) => (
            <span key={y} className="tick" style={{ left: pct(y) }}>{y}</span>
          ))}
          <button className="tick endpoint end" style={{ left: "100%" }} onClick={() => onSelect(timeline.end.claim)} tabIndex={-1}>
            {timeline.end.circa ? `c. ${max}` : max}
          </button>
        </div>
        <div className="key-events">
          {timeline.keyEvents.map((k) => (
            <button key={`${k.year}-${k.target}`} className="key-event" style={{ left: pct(k.year) }} onClick={() => { onYear(k.year); onSelect(k.target); }}>
              <span className="key-dot" aria-hidden />
              <span className="key-label">{tx(k.label, lang)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
