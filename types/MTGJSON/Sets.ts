import { Entries, ConditionalPick } from "type-fest";

import SetList from "../../cache/SetList";
import { SetType } from "./Enums";

type SetEntries = Entries<typeof SetList>;

interface SetShape {
  readonly baseSetSize: number;
  readonly block?: string;
  readonly code: string;
  readonly isFoilOnly: boolean;
  readonly isForeignOnly?: boolean;
  readonly isNonFoilOnly?: boolean;
  readonly isOnlineOnly: boolean;
  readonly isPartialPreview?: boolean;
  readonly keyruneCode: string;
  readonly mcmId?: unknown;
  readonly mcmIdExtras?: any;
  readonly mcmName?: string;
  readonly mtgoCode?: string;
  readonly name: string;
  readonly parentCode?: string;
  readonly releaseDate: string;
  readonly sealedProduct?: readonly unknown[];
  readonly tcgplayerGroupId?: number;
  readonly totalSetSize: number;
  readonly translations: unknown;
  readonly type: SetType;
}

const AllSets = SetList.data;

export type SetsWithBlock = Extract<
  typeof AllSets[number],
  { block: NonNullable<SetShape["block"]> }
>;
export type SetsWithIsForeignOnly = Extract<
  typeof AllSets[number],
  { isForeignOnly: NonNullable<SetShape["isForeignOnly"]> }
>;
export type SetsWithIsNonFoilOnly = Extract<
  typeof AllSets[number],
  { isNonFoilOnly: NonNullable<SetShape["isNonFoilOnly"]> }
>;
export type SetsWithIsPartialPreview = Extract<
  typeof AllSets[number],
  { isPartialPreview: NonNullable<SetShape["isPartialPreview"]> }
>;
export type SetsWithMcmId = Extract<
  typeof AllSets[number],
  { mcmId: NonNullable<SetShape["mcmId"]> }
>;
export type SetsWithMcmIdExtras = Extract<
  typeof AllSets[number],
  { mcmIdExtras: NonNullable<SetShape["mcmIdExtras"]> }
>;
export type SetsWithMcmName = Extract<
  typeof AllSets[number],
  { mcmName: NonNullable<SetShape["mcmName"]> }
>;
export type SetsWithMtgoCode = Extract<
  typeof AllSets[number],
  { mtgoCode: NonNullable<SetShape["mtgoCode"]> }
>;
export type SetsWithParentCode = Extract<
  typeof AllSets[number],
  { parentCode: NonNullable<SetShape["parentCode"]> }
>;
export type SetsWithSealedProduct = Extract<
  typeof AllSets[number],
  { sealedProduct: NonNullable<SetShape["sealedProduct"]> }
>;
export type SetsWithTcgplayerGroupId = Extract<
  typeof AllSets[number],
  { tcgplayerGroupId: NonNullable<SetShape["tcgplayerGroupId"]> }
>;

/**
 * SET ENUMS: PROPERTIES ALWAYS PRESENT
 */
export type SetCode = typeof AllSets[number]["code"];
export type KeyruneCode = typeof AllSets[number]["keyruneCode"];
export type Name = typeof AllSets[number]["name"];

/**
 * SET ENUMS: PROPERTIES OPTIONALLY PRESENT
 */
export type Block = SetsWithBlock["block"];
export type McmName = SetsWithMcmName["mcmName"];
export type MtgoCode = SetsWithMtgoCode["mtgoCode"];
export type ParentCode = SetsWithParentCode["parentCode"];
