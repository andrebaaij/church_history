import { useTranslation } from "react-i18next";

type Props = { year: number; circa: boolean; era?: string; onEra?: () => void };

export function YearDisplay({ year, circa, era, onEra }: Props) {
  const { t } = useTranslation();
  return (
    <div className="year-display" aria-live="polite">
      <span data-testid="year-display">{t(circa ? "year.circa" : "year.exact", { year })}</span>
      {era && (
        <button className="era" onClick={onEra} tabIndex={onEra ? 0 : -1}>
          {era}
        </button>
      )}
    </div>
  );
}
