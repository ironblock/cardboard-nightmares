import { PreconMetadata } from "../constants/preconstructedDecks";

export const getPrecons = async () =>
  (await fetch("/api/v1/precons")).json() as Promise<PreconMetadata[]>;
