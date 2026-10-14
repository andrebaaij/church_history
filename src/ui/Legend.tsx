import { useTranslation } from "react-i18next";
import { GRADES, type Grade } from "../schema/common";
import { GRADE_DASH } from "../model/grades";

export function GradeLine({ grade, color = "currentColor", width = 40 }: { grade: Grade; color?: string; width?: number }) {
  const dash = GRADE_DASH[grade];
  return (
    <svg width={width} height="10" aria-hidden className="grade-line">
      <line x1="2" y1="5" x2={width - 2} y2="5" stroke={color} strokeWidth="3" strokeLinecap={dash && dash[0] < 1 ? "round" : "butt"} strokeDasharray={dash?.map((n) => n * 3).join(" ")} />
    </svg>
  );
}

/** Compact always-on legend (used in story mode, where the filter panel is hidden). */
export function Legend() {
  const { t } = useTranslation();
  return (
    <div className="legend">
      {GRADES.map((g) => (
        <span key={g} className="legend-row" title={t(`grade.${g}`)}>
          <GradeLine grade={g} width={28} /> {g}
        </span>
      ))}
    </div>
  );
}
