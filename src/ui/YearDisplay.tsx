import { useTranslation } from "react-i18next";

export function YearDisplay({ year, circa }: { year: number; circa: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="year-display" aria-live="polite">
      <span data-testid="year-display">{t(circa ? "year.circa" : "year.exact", { year })}</span>
    </div>
  );
}
