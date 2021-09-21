import SetList from "../../cache/SetList";
import { SetType } from "../../types/MTGJSON/Enums";
import { KeyruneCode, SetCode, SetShape } from "../../types/MTGJSON/Sets";

export type CodeMap = { [key in SetCode]: SetShape };
export type TypeMap = { [key in SetType]: SetShape };
export type KeyruneCodeMap = { [key in KeyruneCode]: SetShape };
export type ReleaseDateMap = { [date: string]: SetShape[] };

const byCode: Partial<CodeMap> = {};
const byType: Partial<TypeMap> = {};
const byKeyruneCode: Partial<KeyruneCodeMap> = {};
const byReleaseDate: Partial<ReleaseDateMap> = {};

for (let i = 0; i < SetList.data.length; i++) {
  byCode[SetList.data[i].code] = SetList.data[i];
  byType[SetList.data[i].type] = SetList.data[i];
  byKeyruneCode[SetList.data[i].keyruneCode] = SetList.data[i];

  if (Array.isArray(typeof byReleaseDate[SetList.data[i].releaseDate])) {
    byReleaseDate[SetList.data[i].releaseDate]?.push(SetList.data[i]);
  } else {
    byReleaseDate[SetList.data[i].releaseDate] = [SetList.data[i]];
  }
}

export const SetsByCode = byCode as CodeMap;
export const SetsByType = byType as TypeMap;
export const SetsByKeyruneCode = byKeyruneCode as KeyruneCodeMap;
export const SetsByReleaseDate = byReleaseDate as ReleaseDateMap;
