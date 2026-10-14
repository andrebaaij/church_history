import { useTranslation } from "react-i18next";
import type { EntityDetail, ClaimView } from "../model/detail";
import type { Index } from "../model/index";
import { tx } from "../i18n/tx";

type Props = { detail: EntityDetail; lang: string; idx: Index; onSelect(id: string): void; onClose(): void };

function yearsLabel(t: (k: string, o?: Record<string, unknown>) => string, when: { from: number; to: number; circa: boolean }) {
  const year = when.from === when.to ? when.from : `${when.from}–${when.to}`;
  return t(when.circa ? "year.circa" : "year.exact", { year });
}

function ClaimBlock({ view, lang, onSelect }: { view: ClaimView; lang: string; onSelect(id: string): void }) {
  const { t } = useTranslation();
  const { claim } = view;
  return (
    <section className="claim">
      <div className="claim-head">
        <span className={`grade grade-${claim.grade}`} data-testid="grade-badge" title={t(`grade.${claim.grade}`)}>{claim.grade}</span>
        <span className="grade-caption">{t(`gradeShort.${claim.grade}`)}</span>
      </div>
      <p className="claim-text">{tx(claim.text, lang)}</p>
      {claim.notes && <p className="note">{tx(claim.notes, lang)}</p>}
      <h4 className="eyebrow">{t("detail.sources")}</h4>
      <ul className="citations">
        {view.citations.map((c, i) => (
          <li key={i}>
            {c.href ? (
              <a href={c.href} target="_blank" rel="noreferrer">{c.source.author}, <cite>{c.source.work}</cite> {c.locator}</a>
            ) : (
              <span>{c.source.author}, <cite>{c.source.work}</cite> {c.locator}</span>
            )}
            {c.quote && <blockquote>“{c.quote}”</blockquote>}
          </li>
        ))}
      </ul>
      {view.mentions.map((m, i) => (
        <p key={i} className="mention">
          <span className="mention-icon" aria-hidden>📖</span>
          <span>
            {t("detail.alsoToldBy", { author: m.work.author, chapter: m.chapter })}
            {m.quote && <>: “{m.quote}”</>}
          </span>
        </p>
      ))}
      {view.alternatives.length > 0 && (
        <div className="alternatives">
          <h4 className="eyebrow">{t("detail.alternatives")}</h4>
          <ul>
            {view.alternatives.map((a) => (
              <li key={a.id}>
                <button className="alt" onClick={() => onSelect(a.id)}>
                  <span className={`grade grade-${a.grade}`}>{a.grade}</span> {tx(a.text, lang)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function DetailPanel({ detail, lang, idx, onSelect, onClose }: Props) {
  const { t } = useTranslation();
  const person = detail.person ? idx.people.get(detail.person) : undefined;
  return (
    <aside className="panel detail" data-testid="detail-panel" style={person ? ({ "--accent-person": person.color } as React.CSSProperties) : undefined}>
      <button className="close" onClick={onClose} aria-label={t("detail.close")}>×</button>
      <p className="eyebrow kind">{t(`kind.${detail.kind}`)}</p>
      <h2 className="detail-title">{tx(detail.title, lang)}</h2>
      {(person || detail.when) && (
        <p className="meta">
          {person && (
            <span className="chip"><span className="swatch" style={{ background: person.color }} /> {tx(person.name, lang)}</span>
          )}
          {detail.when && <span className="chip">{yearsLabel(t, detail.when)}</span>}
        </p>
      )}
      {detail.media.map((m) => (
        <figure key={m.id}>
          <img src={`${import.meta.env.BASE_URL}media/${m.file}`} alt={tx(m.caption, lang)} />
          <figcaption>
            {tx(m.caption, lang)} <span className={`media-role ${m.role}`}>{t(m.role === "evidence" ? "media.evidence" : "media.illustration")}</span>
            <br />
            <a href={m.sourceUrl} target="_blank" rel="noreferrer">{t("media.credit", { creator: m.creator, licence: m.licence })}</a>
          </figcaption>
        </figure>
      ))}
      {detail.claims.map((v) => <ClaimBlock key={v.claim.id} view={v} lang={lang} onSelect={onSelect} />)}
      {detail.itinerary && detail.itinerary.length > 0 && (
        <>
          <h3 className="eyebrow">{t("detail.itinerary")}</h3>
          <ol className="itinerary">
            {detail.itinerary.map((it) => (
              <li key={it.id}>
                <button className="episode" onClick={() => onSelect(it.id)}>
                  <span className="episode-year">{it.when.from === it.when.to ? it.when.from : `${it.when.from}–${it.when.to}`}</span>
                  <span className="itinerary-icon" aria-hidden>{it.type === "leg" ? "⟶" : "●"}</span>
                  <span className="itinerary-title">{tx(it.title, lang)}</span>
                  <span className={`grade grade-${it.grade}`}>{it.grade}</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
      {detail.episodes.length > 0 && (
        <>
          <h3 className="eyebrow">{t("detail.episodes")}</h3>
          <ol className="episodes">
            {[...detail.episodes].sort((a, b) => a.when.from - b.when.from).map((e) => (
              <li key={e.id}>
                <button className="episode" onClick={() => onSelect(e.id)}>
                  <span className="episode-year">{e.when.from}</span>
                  <span>{tx(e.title, lang)}</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </aside>
  );
}
