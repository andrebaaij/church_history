const isI18n = (v: unknown): v is Record<string, string> =>
  !!v && typeof v === "object" && !Array.isArray(v) && typeof (v as Record<string, unknown>).en === "string" && Object.values(v).every((x) => typeof x === "string");

export function missingTranslations(value: unknown, lang: string, path = ""): string[] {
  if (isI18n(value)) return value[lang] ? [] : [path];
  if (Array.isArray(value)) return value.flatMap((v, i) => missingTranslations(v, lang, path ? `${path}.${i}` : String(i)));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => missingTranslations(v, lang, path ? `${path}.${k}` : k));
  return [];
}
