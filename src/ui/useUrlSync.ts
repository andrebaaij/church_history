import { useEffect, useRef } from "react";

/**
 * Mirror the app state into the address bar, at most once per 300 ms and only when the query
 * string changed. Story animations change state every frame; Safari throws after 100
 * replaceState calls in 10 s, so never write per frame and never let a failure propagate.
 */
export function useUrlSync(query: string): void {
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (query === last.current) return;
    const h = setTimeout(() => {
      last.current = query;
      try {
        history.replaceState(null, "", location.pathname + query);
      } catch {
        /* throttled by the browser: the next change will try again */
      }
    }, 300);
    return () => clearTimeout(h);
  }, [query]);
}
