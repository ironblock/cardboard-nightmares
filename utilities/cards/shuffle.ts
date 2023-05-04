import { DeckDetails, DeckList } from "../../types/Decks";
import { UUID } from "../../types/Scryfall/Attributes";

export function FisherYatesShuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function expandDeck(deck: DeckDetails) {
  const expandedDeck: UUID[] = [];
  for (const [id, { quantity }] of Object.entries(deck)) {
    for (let i = 0; i < quantity; i++) {
      expandedDeck.push(id);
    }
  }

  return expandedDeck;
}
