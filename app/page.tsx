"use client";

import { useState } from "react";
import { getBulkCardDataByType } from "../api/Scryfall";
import { db } from "../database/Scryfall";
import { UUID } from "../types/Scryfall/Attributes";
import { CompleteCard } from "../types/Scryfall/Card";
import Image from "next/image";
import { SmallCardImage } from "../components/CardImage";

async function populateDatabase() {
  const scryfallCardData = await getBulkCardDataByType("unique_artwork");
  db.cards.bulkPut(scryfallCardData);
}

export const ArenaExportSyntax = /(\d*)S?\s*(.+)\s+\((.*)\)\s(\d*)/;
export interface DeckListEntry {
  quantity: number;
  name: string;
  set?: string;
  collectorNumber?: number;
}
export type DeckList = DeckListEntry[];
export type DeckDetails = Record<
  UUID,
  { card: CompleteCard; quantity: number }
>;

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

  async function handleDeckListChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setDeck(await findAllCardsInDeckList(parseDeckList(event)));
  }

  return (
    <h1>
      <button onClick={populateDatabase}>Populate Database</button>
      <hr />
      <textarea onChange={handleDeckListChange} />
      <hr />
      {Object.values(deck).map(({ card }) => {
        if (card.image_uris) {
          return (
            <SmallCardImage
              key={card.id}
              uris={card.image_uris}
              alt={card.name}
            />
          );
        } else if (card.card_faces) {
          return (
            <SmallCardImage
              key={card.id}
              uris={card.card_faces[0].image_uris}
              alt={card.card_faces[0].name}
            />
          );
        }
      })}
    </h1>
  );
}
