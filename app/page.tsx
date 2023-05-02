"use client";

import { getBulkCardDataByType } from "../api/Scryfall";
import { db } from "../database/Scryfall";

async function populateDatabase() {
  const scryfallCardData = await getBulkCardDataByType("unique_artwork");
  db.cards.bulkPut(scryfallCardData);
}

export default async function Page() {
  return (
    <h1>
      Hello, Next.js!
      <button onClick={populateDatabase}>Populate Database</button>
    </h1>
  );
}
