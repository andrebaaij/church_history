import type { Episode, JourneyItem } from "../schema/entities";
import type { Dataset } from "./dataset";

export type EpisodeRef = { episode: Episode; parent: JourneyItem; person: string };

export function allEpisodes(ds: Pick<Dataset, "journeys">): EpisodeRef[] {
  return ds.journeys.flatMap((j) => j.items.flatMap((item) => item.episodes.map((episode) => ({ episode, parent: item, person: j.person }))));
}
