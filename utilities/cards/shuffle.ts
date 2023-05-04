import { DeckDetails, DeckList, DeckOrder } from "../../types/Decks";
import { UUID } from "../../types/Scryfall/Attributes";

export function FisherYatesShuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function expandDeck(deck: DeckDetails): DeckOrder {
  const expandedDeck: DeckOrder = [];
  let cardCount = 1;

  for (const [id, { quantity }] of Object.entries(deck)) {
    for (let q = 0; q < quantity; q++) {
      expandedDeck.push([cardCount, id as UUID]);
      cardCount++;
    }
  }

  return expandedDeck;
}
