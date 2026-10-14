import { useTranslation } from "react-i18next";
import { LANGS } from "../schema/common";
import type { Story } from "../schema/entities";
import type { ThemeName } from "../state/urlState";
import { tx } from "../i18n/tx";

type Props = {
  lang: string; theme: ThemeName; stories: Story[]; onLang(l: string): void; onTheme(t: ThemeName): void;
  onStory(id: string): void; onAttribution(): void; onHelp(): void; copyStep?: () => void;
};

export function Settings({ lang, theme, stories, onLang, onTheme, onStory, onAttribution, onHelp, copyStep }: Props) {
  const { t } = useTranslation();
  return (
    <div className="settings">
      {stories.map((s) => (
        <button key={s.id} className="btn primary" data-testid="story-open" onClick={() => onStory(s.id)}>▶ {tx(s.title, lang)}</button>
      ))}
      <div className="segmented" role="group" aria-label={t("settings.theme")}>
        <button className={theme === "default" ? "on" : ""} onClick={() => onTheme("default")}>{t("settings.themeDefault")}</button>
        <button className={theme === "projector" ? "on" : ""} onClick={() => onTheme("projector")}>{t("settings.themeProjector")}</button>
      </div>
      <select aria-label={t("settings.language")} value={lang} onChange={(e) => onLang(e.target.value)}>
        {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
      </select>
      <button className="btn ghost icon" onClick={onHelp} aria-label={t("intro.help")} title={t("intro.help")}>?</button>
      <button className="btn ghost" onClick={onAttribution}>{t("attribution.open")}</button>
      {copyStep && <button className="btn ghost" onClick={copyStep}>{t("settings.copyStep")}</button>}
    </div>
  );
}
