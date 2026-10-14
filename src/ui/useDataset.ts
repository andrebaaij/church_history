import { useEffect, useState } from "react";
import type { Dataset } from "../model/dataset";

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; dataset: Dataset };

export function useDataset(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/dataset.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((dataset: Dataset) => setState({ status: "ready", dataset }))
      .catch((e: Error) => setState({ status: "error", message: e.message }));
  }, []);
  return state;
}
