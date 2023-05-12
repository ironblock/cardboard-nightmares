"use client";

import { useState, useEffect } from "react";

import DeckListImport from "../../components/DeckListImport";
import {
  findAllCards,
  updateBulkCardData,
} from "../../database/Scryfall/operations";
import { DeckDetails, DeckList } from "../../types/Decks";

export default function Page() {
  const [deck, setDeck] = useState<DeckDetails>({});

  async function handleDeckListChange(list: DeckList) {
    const cardData = await findAllCards(list);

    setDeck(cardData);
  }

  useEffect(() => {
    updateBulkCardData();
  }, []);

  return (
    <div>
      <DeckListImport onDeckListChange={handleDeckListChange} />
    </div>
  );
}
