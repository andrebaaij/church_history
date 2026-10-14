import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Dataset } from "../model/dataset";
import type { Index } from "../model/index";
import { searchEntities, type SearchResult } from "../model/search";

export function Search({ ds, idx, lang, onPick }: { ds: Dataset; idx: Index; lang: string; onPick(r: SearchResult): void }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const results = searchEntities(q, ds, idx, lang);
  return (
    <div className="search">
      <span className="search-icon" aria-hidden>⌕</span>
      <input data-testid="search-input" value={q} placeholder={t("search.placeholder")} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && results[0]) { onPick(results[0]); setQ(""); } }} />
      {q.trim().length >= 2 && (
        <ul role="listbox" className="panel results">
          {results.length === 0 && <li className="empty">{t("search.noResults")}</li>}
          {results.map((r) => (
            <li key={r.id} role="option" aria-selected={false}>
              <button data-testid="search-result" onClick={() => { onPick(r); setQ(""); }}>
                <span className={`kind-badge ${r.kind}`}>{t(`kind.${r.kind}`)}</span> {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
