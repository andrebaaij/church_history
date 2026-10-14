import type { Claim, JourneyItem, Media, Person, Place, ReferenceWork, Source, Story, Territory, Timeline } from "../schema/entities";

export type Journey = { person: string; items: JourneyItem[] };

export type Dataset = {
  sources: Source[];
  referenceWorks: ReferenceWork[];
  claims: Claim[];
  people: Person[];
  places: Place[];
  territories: Territory[];
  journeys: Journey[];
  media: Media[];
  stories: Story[];
  timeline: Timeline;
};
