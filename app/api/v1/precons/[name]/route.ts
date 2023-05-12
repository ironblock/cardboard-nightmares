import { NextResponse } from "next/server";

import { PreconModule } from "../../../../../constants/preconstructedDecks";
import preconstructedDecks from "../../../../../constants/preconstructedDecks";

export interface RouteParams {
  name: string;
}

export async function GET(request: void, params: RouteParams) {
  const deck = Object.values<PreconModule>(preconstructedDecks).find(
    ({ metadata }) => metadata.name === params.name
  );

  if (deck?.arenaFormat) {
    return NextResponse.json(deck.arenaFormat);
  } else {
    return NextResponse.next({ status: 404 });
  }
}
