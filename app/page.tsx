"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  getBulkCardDataByType,
  isBulkCardDataCachedForType,
} from "../api/Scryfall";
import { SmallCardImage } from "../components/CardImage";
import { db } from "../database/Scryfall";
import {
  DeckDetails,
  DeckList,
  DeckListEntry,
  DeckOrder,
} from "../types/Decks";
import { UUID } from "../types/Scryfall/Attributes";
import { CompleteCard } from "../types/Scryfall/Card";
import { FisherYatesShuffle, expandDeck } from "../utilities/cards/shuffle";

async function populateDatabase() {
  if ((await isBulkCardDataCachedForType("unique_artwork")) === false) {
    console.info("Populating database with card data");
    const scryfallCardData = await getBulkCardDataByType("unique_artwork");

    db.cards.bulkPut(scryfallCardData);
  } else {
    console.info("Card data already exists in database (though may be stale)");
  }
}

export const ArenaExportSyntax = /(\d*)S?\s*(.+)\s+\((.*)\)\s(\d*)/;

function parseDeckList(
  event: React.ChangeEvent<HTMLTextAreaElement>
): DeckList {
  const deckList: DeckList = [];

  event.target.value.split("\n").forEach((line) => {
    const [match, quantityString, name, set, collectorNumber] =
      line.match(ArenaExportSyntax) ?? [];

    if (match) {
      deckList.push({
        name,
        set: set.toLowerCase(),
        collectorNumber,
        quantity: Number(quantityString),
      });
    }
  });

  return deckList;
}

async function findCardData(
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

async function findAllCardsInDeckList(
  deckList: DeckList
): Promise<DeckDetails> {
  const queries = deckList.map((entry) => findCardData(entry));

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

export default function Page() {
  const [deck, setDeck] = useState<DeckDetails>({});
  const [shuffle, setShuffle] = useState<DeckOrder>([]);

  async function handleDeckListChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const updatedDeck = await findAllCardsInDeckList(parseDeckList(event));

    setDeck(updatedDeck);
    setShuffle(FisherYatesShuffle(expandDeck(updatedDeck)));
  }

  function handleShuffle() {
    setShuffle(FisherYatesShuffle([...shuffle]));
  }

  useEffect(() => {
    populateDatabase();
  }, []);

  console.log(shuffle);

  return (
    <div>
      <h1>Import Deck</h1>
      <p>
        Export deck on Archidekt, pick &quot;Copy to Arena&quot;, paste result
        here:
      </p>
      <textarea onChange={handleDeckListChange} />
      <hr />
      <button onClick={handleShuffle}>Shuffle</button>
      <hr />
      {shuffle.map(([deckIndex, id]) => {
        const card = deck[id].card;

        if (card.image_uris) {
          return (
            <SmallCardImage
              key={`${deckIndex}_${id}`}
              uris={card.image_uris}
              alt={card.name}
            />
          );
        } else if (card.card_faces) {
          return (
            <SmallCardImage
              key={`${deckIndex}_${id}`}
              uris={card.card_faces[0].image_uris}
              alt={card.card_faces[0].name}
            />
          );
        }
      })}
    </div>
  );
}
