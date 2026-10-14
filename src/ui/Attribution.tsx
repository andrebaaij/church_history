import { useTranslation } from "react-i18next";
import type { Dataset } from "../model/dataset";

export function Attribution({ ds, onClose }: { ds: Dataset; onClose(): void }) {
  const { t } = useTranslation();
  const datasets = ds.sources.filter((s) => s.kind === "dataset");
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="panel modal" role="dialog" aria-label={t("attribution.title")} onClick={(e) => e.stopPropagation()}>
        <h2 className="detail-title">{t("attribution.title")}</h2>
        <p>{t("attribution.intro")}</p>
        <ul>
          {datasets.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.work}</a> — {s.author}</li>)}
          <li><a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a> — public domain</li>
          <li><a href="https://pleiades.stoa.org/" target="_blank" rel="noreferrer">Pleiades</a> — CC BY</li>
          <li><a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noreferrer">historical-basemaps</a> — GPL-3.0 (territory geometry)</li>
          <li>Noto Sans, EB Garamond, Inter — SIL Open Font License</li>
          {ds.referenceWorks.map((r) => <li key={r.id}>{r.author}, <cite>{r.title}</cite></li>)}
        </ul>
        <h3 className="eyebrow">{t("filters.grades")}</h3>
        <ul className="grade-key">
          {(["A", "B", "C", "D", "E"] as const).map((g) => <li key={g}><span className={`grade grade-${g}`}>{g}</span> {t(`grade.${g}`)}</li>)}
        </ul>
        <button className="btn" onClick={onClose}>{t("attribution.close")}</button>
      </div>
    </div>
  );
}
