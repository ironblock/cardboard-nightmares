import { db } from ".";
import {
  getBulkCardDataByType,
  isBulkCardDataCachedForType,
} from "../../api/Scryfall";
import { DeckListEntry, DeckList, DeckDetails } from "../../types/Decks";
import { CompleteCard } from "../../types/Scryfall/Card";

export async function findCard(
  entry: DeckListEntry
): Promise<CompleteCard | undefined> {
  const cardsWithName = await db.cards
    .where("name")
    .equals(entry.name)
    .toArray();

  return (
    cardsWithName.find((card) => {
      return (
        card.set === entry.set ||
        card.collector_number === entry.collectorNumber
      );
    }) ?? cardsWithName[0]
  );
}

export async function findAllCards(deckList: DeckList): Promise<DeckDetails> {
  const queries = deckList.map((entry) => findCard(entry));

  return (await Promise.all(queries)).reduce<DeckDetails>(
    (deck, card, index) => {
      if (card?.id) {
        deck[card.id] = { card, quantity: deckList[index].quantity };
      }
      return deck;
    },
    {}
  );
}

export async function updateBulkCardData() {
  if ((await isBulkCardDataCachedForType("unique_artwork")) === false) {
    console.info("Populating database with card data");
    const scryfallCardData = await getBulkCardDataByType("unique_artwork");

    db.cards.bulkPut(scryfallCardData);
  } else {
    console.info("Card data already exists in database (though may be stale)");
  }
}
