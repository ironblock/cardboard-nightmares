import SetList from "../../cache/MTGJSON/SetList";
import { SetType } from "../../types/MTGJSON/Enums";
import { KeyruneCode, SetCode, SetShape } from "../../types/MTGJSON/Sets";

/**
 * Prior to the release of Exodus (1998), all set symbols were black and white
 */
const RARITY_COLORS_INTRODUCED = "1998-06-15";

/**
 * Mythic Rare didn't exist prior to Shards of Alara (2008)
 */
const MYTHIC_RARE_INTRODUCED = "2008-10-03";

/**
 * Eighth Edition (2003) to Magic 2015 (2014) had a specific set of styles applied to the set symbol
 */
const EIGHTH_EDITION_RELEASED = "2003-07-29";
const MAGIC_2015_RELEASED = "2014-07-18";

export type CodeMap = { [key in SetCode]: SetShape };
export type TypeMap = { [key in SetType]: SetShape };
export type KeyruneCodeMap = { [key in KeyruneCode]: SetShape };
export type ReleaseDateMap = { [date: string]: SetShape[] };

const byCode: Partial<CodeMap> = {};
const byType: Partial<TypeMap> = {};
const byKeyruneCode: Partial<KeyruneCodeMap> = {};
const byReleaseDate: Partial<ReleaseDateMap> = {};

export const noMythicRares: Set<Partial<SetCode>> = new Set();
export const noRarityColors: Set<Partial<SetCode>> = new Set();
export const eighthEditionToM15: Set<Partial<SetCode>> = new Set();

for (let i = 0; i < SetList.data.length; i++) {
  byCode[SetList.data[i].code] = SetList.data[i];
  byType[SetList.data[i].type] = SetList.data[i];
  byKeyruneCode[SetList.data[i].keyruneCode] = SetList.data[i];

  if (
    SetList.data[i].releaseDate >= EIGHTH_EDITION_RELEASED &&
    SetList.data[i].releaseDate <= MAGIC_2015_RELEASED
  ) {
    eighthEditionToM15.add(SetList.data[i].code);
  }

  if (SetList.data[i].releaseDate < RARITY_COLORS_INTRODUCED) {
    noRarityColors.add(SetList.data[i].code);
    noMythicRares.add(SetList.data[i].code);
  } else if (SetList.data[i].releaseDate < MYTHIC_RARE_INTRODUCED) {
    noMythicRares.add(SetList.data[i].code);
  }

  if (Array.isArray(typeof byReleaseDate[SetList.data[i].releaseDate])) {
    byReleaseDate[SetList.data[i].releaseDate]?.push(SetList.data[i]);
  } else {
    byReleaseDate[SetList.data[i].releaseDate] = [SetList.data[i]];
  }
}
console.log(eighthEditionToM15);

export const SetsByCode = byCode as CodeMap;
export const SetsByType = byType as TypeMap;
export const SetsByKeyruneCode = byKeyruneCode as KeyruneCodeMap;
export const SetsByReleaseDate = byReleaseDate as ReleaseDateMap;
