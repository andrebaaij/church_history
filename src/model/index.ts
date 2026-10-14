import type { Claim, Leg, Media, Person, Place, ReferenceWork, Source, Stay, Story, Territory } from "../schema/entities";
import type { Dataset } from "./dataset";
import { allEpisodes, type EpisodeRef } from "./walk";

export type Index = {
  claims: Map<string, Claim>;
  sources: Map<string, Source>;
  referenceWorks: Map<string, ReferenceWork>;
  people: Map<string, Person>;
  places: Map<string, Place>;
  territories: Map<string, Territory>;
  media: Map<string, Media>;
  legs: Map<string, { leg: Leg; person: string }>;
  stays: Map<string, { stay: Stay; person: string }>;
  episodes: Map<string, EpisodeRef>;
  stories: Map<string, Story>;
  /** How many legs/stays touch a place — used to prioritise labels. */
  placeRank: Map<string, number>;
};

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));

export function buildIndex(ds: Dataset): Index {
  const legs = new Map<string, { leg: Leg; person: string }>();
  const stays = new Map<string, { stay: Stay; person: string }>();
  const placeRank = new Map<string, number>();
  const bump = (id: string) => placeRank.set(id, (placeRank.get(id) ?? 0) + 1);
  for (const j of ds.journeys) {
    for (const item of j.items) {
      if (item.type === "leg") {
        legs.set(item.id, { leg: item, person: j.person });
        bump(item.from);
        bump(item.to);
      } else {
        stays.set(item.id, { stay: item, person: j.person });
        bump(item.place);
      }
    }
  }
  return {
    claims: byId(ds.claims),
    sources: byId(ds.sources),
    referenceWorks: byId(ds.referenceWorks),
    people: byId(ds.people),
    places: byId(ds.places),
    territories: byId(ds.territories),
    media: byId(ds.media),
    legs,
    stays,
    episodes: new Map(allEpisodes(ds).map((e) => [e.episode.id, e])),
    stories: byId(ds.stories),
    placeRank,
  };
}
