"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getBulkCardDataByType } from "../api/Scryfall";
import { SmallCardImage } from "../components/CardImage";
import { db } from "../database/Scryfall";
import { DeckDetails, DeckList, DeckListEntry } from "../types/Decks";
import { UUID } from "../types/Scryfall/Attributes";
import { CompleteCard } from "../types/Scryfall/Card";
import { FisherYatesShuffle, expandDeck } from "../utilities/cards/shuffle";

async function populateDatabase() {
  const scryfallCardData = await getBulkCardDataByType("unique_artwork");
  db.cards.bulkPut(scryfallCardData);
}

export const ArenaExportSyntax = /(\d*)S?\s*(.+)\s+\((.*)\)\s(\d*)/;

function parseDeckList(
  event: React.ChangeEvent<HTMLTextAreaElement>
): DeckList {
  const deckList: DeckList = [];

  event.target.value.split("\n").forEach((line) => {
    const [match, quantityString, name, set, collectorNumberString] =
      line.match(ArenaExportSyntax) ?? [];

    if (match) {
      deckList.push({
        name,
        set,
        quantity: Number(quantityString),
        collectorNumber: Number(collectorNumberString),
      });
    }
  });

  return deckList;
}

async function findCardData(
  entry: DeckListEntry
): Promise<CompleteCard | undefined> {
  return await db.cards
    .where({ name: entry.name, set: entry.set?.toLowerCase() })
    .first()
    .then(
      (resultFromSet) =>
        resultFromSet ?? db.cards.where({ name: entry.name }).first()
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
  const [shuffle, setShuffle] = useState<UUID[]>([]);

  async function handleDeckListChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const updatedDeck = await findAllCardsInDeckList(parseDeckList(event));

    setDeck(updatedDeck);
    setShuffle(expandDeck(updatedDeck));
  }

  function handleShuffle() {
    setShuffle(FisherYatesShuffle(shuffle));
  }

  useEffect(() => {
    populateDatabase();
  }, []);

  return (
    <div>
      <h1>Import Deck</h1>
      <p>Export deck on Archidekt, pick "Copy to Arena", paste result here:</p>
      <textarea onChange={handleDeckListChange} />
      <hr />
      <button onClick={handleShuffle}>Shuffle</button>
      <hr />
      {shuffle.map((id, index) => {
        const card = deck[id].card;

        if (card.image_uris) {
          return (
            <SmallCardImage
              key={index}
              uris={card.image_uris}
              alt={card.name}
            />
          );
        } else if (card.card_faces) {
          return (
            <SmallCardImage
              key={index}
              uris={card.card_faces[0].image_uris}
              alt={card.card_faces[0].name}
            />
          );
        }
      })}
    </div>
  );
}
