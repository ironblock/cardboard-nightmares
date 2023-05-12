"use client";

import { useState } from "react";

import { DeckDetails } from "../../types/Decks";

async function preloadCardImages() {}
export default function Page() {
  const [yourDeck, setYourDeck] = useState<DeckDetails>({});

  useEffect(() => {}, []);

  return <main></main>;
}
