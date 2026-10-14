import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";
import { missingTranslations } from "../src/reports/translations";
import { LANGS } from "../src/schema/common";

const { dataset } = loadDataset(join(import.meta.dirname, "..", "data"));
const lines = ["## Missing translations", ""];
for (const lang of LANGS.filter((l) => l !== "en")) {
  const missing = missingTranslations(dataset, lang);
  lines.push(`- **${lang}**: ${missing.length} field(s) missing`);
}
const out = lines.join("\n");
console.log(out);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${out}\n`);
