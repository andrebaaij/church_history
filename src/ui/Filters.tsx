import { useTranslation } from "react-i18next";
import { GRADES, type Grade } from "../schema/common";
import type { Person } from "../schema/entities";
import type { Filters as F } from "../state/urlState";
import { tx } from "../i18n/tx";
import { GradeLine } from "./Legend";

type Props = { people: Person[]; filters: F; lang: string; onTogglePerson(id: string): void; onToggleGrade(g: Grade): void };

export function Filters({ people, filters, lang, onTogglePerson, onToggleGrade }: Props) {
  const { t } = useTranslation();
  return (
    <aside className="panel filters">
      <h2 className="eyebrow">{t("filters.people")}</h2>
      <ul className="people">
        {people.map((p) => {
          const on = filters.people === null || filters.people.includes(p.id);
          return (
            <li key={p.id}>
              <label className={`person ${on ? "on" : "off"}`}>
                <input type="checkbox" checked={on} onChange={() => onTogglePerson(p.id)} />
                <span className="swatch" style={{ background: p.color }} />
                <span>{tx(p.name, lang)}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <h2 className="eyebrow">{t("filters.grades")}</h2>
      <ul className="grades">
        {GRADES.map((g) => {
          const on = filters.grades.includes(g);
          return (
            <li key={g}>
              <label className={`grade-toggle ${on ? "on" : "off"}`}>
                <input type="checkbox" checked={on} onChange={() => onToggleGrade(g)} />
                <span className={`grade grade-${g}`}>{g}</span>
                <GradeLine grade={g} width={34} />
                <span className="grade-label">{t(`gradeShort.${g}`)}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="hint">{t("filters.hint")}</p>
    </aside>
  );
}
