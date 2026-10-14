import type { I18nText } from "../schema/common";

export function tx(text: I18nText | undefined, lang: string): string {
  if (!text) return "";
  return text[lang] ?? text.en ?? "";
}

export function joinText(a: I18nText, sep: string, b: I18nText): I18nText {
  const langs = new Set([...Object.keys(a), ...Object.keys(b)]);
  return Object.fromEntries([...langs].map((l) => [l, `${tx(a, l)}${sep}${tx(b, l)}`])) as I18nText;
}
