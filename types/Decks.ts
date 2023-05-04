import { UUID } from "./Scryfall/Attributes";
import { CompleteCard } from "./Scryfall/Card";

export interface DeckListEntry {
  quantity: number;
  name: string;
  set?: Lowercase<string>;
  collectorNumber?: string;
}
export type DeckList = DeckListEntry[];
export type DeckDetails = Record<
  UUID,
  { card: CompleteCard; quantity: number }
>;

export type DeckOrder = [number, UUID][];
