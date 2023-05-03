import Dexie, { Table } from "dexie";

import { CompleteCard } from "../types/Scryfall/Card";

export class ScryfallDatabase extends Dexie {
  cards!: Table<CompleteCard>;

  constructor() {
    super("ScryfallDatabase");
    this.version(1).stores({
      cards: "++id, [name+set]", // Primary key and indexed props
    });
  }
}

export const db = new ScryfallDatabase();
