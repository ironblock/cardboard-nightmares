"use client";

import { updateBulkCardData } from "../database/Scryfall/operations";

export default async function MainPage() {
  await updateBulkCardData();

  return <div></div>;
}
