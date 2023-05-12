import { NextResponse } from "next/server";

import preconstructedDecks from "../../../../constants/preconstructedDecks";

export async function GET() {
  return NextResponse.json(
    Object.values(preconstructedDecks).map(({ metadata }) => metadata)
  );
}
