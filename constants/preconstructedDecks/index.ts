import * as DraxxThemSklounst from "./DraxxThemSklounst";
import * as SameBadCat from "./SameBadCat";
import { Colors } from "../../types/Scryfall/Attributes";

export interface PreconMetadata {
  name: string;
  colorIdentity: Partial<Colors>;
  description: string;
}

export interface PreconModule {
  metadata: PreconMetadata;
  arenaFormat: string;
}

export const preconstructedDecks: { [k: string]: PreconModule } = {
  DraxxThemSklounst,
  SameBadCat,
};

export default preconstructedDecks;
