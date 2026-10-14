import type { I18nText, When } from "../schema/common";
import type { Claim, Episode, Media, ReferenceWork, Source } from "../schema/entities";
import { joinText } from "../i18n/tx";
import type { Index } from "./index";

export type ClaimView = {
  claim: Claim;
  citations: { source: Source; locator: string; quote?: string; href?: string }[];
  mentions: { work: ReferenceWork; chapter: string; quote?: string }[];
  alternatives: Claim[];
};
export type EntityKind = "leg" | "stay" | "episode" | "place" | "territory" | "claim";
export type EntityDetail = {
  id: string; kind: EntityKind; title: I18nText; when?: When; person?: string;
  claims: ClaimView[]; episodes: Episode[]; media: Media[];
};

export function claimView(id: string, idx: Index): ClaimView | null {
  const claim = idx.claims.get(id);
  if (!claim) return null;
  return {
    claim,
    citations: claim.citations.map((c) => {
      const source = idx.sources.get(c.source)!;
      const href = source.locatorUrl ? source.locatorUrl.replace("{locator}", encodeURIComponent(c.locator)) : source.url;
      return { source, locator: c.locator, quote: c.quote, href };
    }),
    mentions: claim.referenceWorks.map((r) => ({ work: idx.referenceWorks.get(r.work)!, chapter: r.chapter, quote: r.quote })),
    alternatives: claim.alternativeTo.map((a) => idx.claims.get(a)).filter((c): c is Claim => !!c),
  };
}

const views = (ids: (string | undefined)[], idx: Index) =>
  ids.map((id) => (id ? claimView(id, idx) : null)).filter((v): v is ClaimView => !!v);

export function describeEntity(id: string, idx: Index): EntityDetail | null {
  const leg = idx.legs.get(id);
  if (leg) {
    const from = idx.places.get(leg.leg.from)!;
    const to = idx.places.get(leg.leg.to)!;
    return { id, kind: "leg", title: joinText(from.name.ancient, " → ", to.name.ancient), when: leg.leg.when, person: leg.person, claims: views([leg.leg.claim], idx), episodes: leg.leg.episodes, media: [] };
  }
  const stay = idx.stays.get(id);
  if (stay) {
    const place = idx.places.get(stay.stay.place)!;
    return { id, kind: "stay", title: place.name.ancient, when: stay.stay.when, person: stay.person, claims: views([stay.stay.claim], idx), episodes: stay.stay.episodes, media: [] };
  }
  const ep = idx.episodes.get(id);
  if (ep) {
    const media = ep.episode.media.map((m) => idx.media.get(m)).filter((m): m is Media => !!m);
    return { id, kind: "episode", title: ep.episode.title, when: ep.episode.when, person: ep.person, claims: views([ep.episode.claim], idx), episodes: [], media };
  }
  const place = idx.places.get(id);
  if (place) return { id, kind: "place", title: place.name.ancient, claims: views([place.claim], idx), episodes: [], media: [] };
  const territory = idx.territories.get(id);
  if (territory) {
    const claimIds = [...new Set(territory.versions.map((v) => v.claim))];
    return { id, kind: "territory", title: territory.name, claims: views(claimIds, idx), episodes: [], media: [] };
  }
  const claim = idx.claims.get(id);
  if (claim) return { id, kind: "claim", title: claim.text, when: claim.when, claims: views([id], idx), episodes: [], media: [] };
  return null;
}
