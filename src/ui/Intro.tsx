import { useTranslation } from "react-i18next";
import { GRADES } from "../schema/common";
import { GradeLine } from "./Legend";

type Props = { storyTitle?: string; onStory?: () => void; onClose(): void };

/** First-visit card: how to read the map. Non-blocking, so the map stays usable behind it. */
export function Intro({ storyTitle, onStory, onClose }: Props) {
  const { t } = useTranslation();
  return (
    <section className="panel intro" aria-labelledby="intro-title">
      <button className="close" onClick={onClose} aria-label={t("detail.close")}>×</button>
      <p className="eyebrow">{t("intro.eyebrow")}</p>
      <h2 id="intro-title" className="detail-title">{t("intro.title")}</h2>
      <ol className="intro-steps">
        <li><strong>{t("intro.timeTitle")}</strong> {t("intro.time")}</li>
        <li>
          <strong>{t("intro.linesTitle")}</strong> {t("intro.lines")}
          <span className="intro-grades">
            {GRADES.map((g) => (
              <span key={g} title={t(`grade.${g}`)}><span className={`grade grade-${g}`}>{g}</span><GradeLine grade={g} width={30} /></span>
            ))}
          </span>
        </li>
        <li><strong>{t("intro.sourcesTitle")}</strong> {t("intro.sources")}</li>
      </ol>
      <div className="intro-actions">
        {onStory && <button className="btn primary" onClick={onStory}>▶ {storyTitle}</button>}
        <button className="btn" onClick={onClose}>{t("intro.explore")}</button>
      </div>
    </section>
  );
}
