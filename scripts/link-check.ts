import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { loadDataset } from "../src/pipeline/load";
import { collectUrls } from "../src/reports/urls";

const { dataset } = loadDataset(join(import.meta.dirname, "..", "data"));
const urls = collectUrls(dataset);

async function check(url: string): Promise<number | string> {
  const opts = { redirect: "follow" as const, signal: AbortSignal.timeout(15000), headers: { "user-agent": "church-history-map link check" } };
  try {
    let r = await fetch(url, { ...opts, method: "HEAD" });
    if (r.status === 405 || r.status === 403) r = await fetch(url, { ...opts, method: "GET" });
    return r.status;
  } catch (e) {
    return (e as Error).name;
  }
}

const failures: string[] = [];
for (let i = 0; i < urls.length; i += 6) {
  const batch = urls.slice(i, i + 6);
  const results = await Promise.all(batch.map((u) => check(u.url)));
  batch.forEach((u, j) => {
    const s = results[j];
    if (typeof s !== "number" || s >= 400) failures.push(`| ${u.where} | ${u.url} | ${s} |`);
  });
}
const out = [`## Link check: ${urls.length} URLs, ${failures.length} failing`, "", ...(failures.length ? ["| where | url | status |", "|---|---|---|", ...failures] : [])].join("\n");
console.log(out);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${out}\n`);
