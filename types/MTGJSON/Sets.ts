import type SetList from "../../cache/SetList";
import type { SetType } from "./Enums";

export interface SetShape {
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

export type SetsWithBlock = Extract<
  typeof SetList.data[number],
  { block: NonNullable<SetShape["block"]> }
>;
export type SetsWithIsForeignOnly = Extract<
  typeof SetList.data[number],
  { isForeignOnly: NonNullable<SetShape["isForeignOnly"]> }
>;
export type SetsWithIsNonFoilOnly = Extract<
  typeof SetList.data[number],
  { isNonFoilOnly: NonNullable<SetShape["isNonFoilOnly"]> }
>;
export type SetsWithIsPartialPreview = Extract<
  typeof SetList.data[number],
  { isPartialPreview: NonNullable<SetShape["isPartialPreview"]> }
>;
export type SetsWithMcmId = Extract<
  typeof SetList.data[number],
  { mcmId: NonNullable<SetShape["mcmId"]> }
>;
export type SetsWithMcmIdExtras = Extract<
  typeof SetList.data[number],
  { mcmIdExtras: NonNullable<SetShape["mcmIdExtras"]> }
>;
export type SetsWithMcmName = Extract<
  typeof SetList.data[number],
  { mcmName: NonNullable<SetShape["mcmName"]> }
>;
export type SetsWithMtgoCode = Extract<
  typeof SetList.data[number],
  { mtgoCode: NonNullable<SetShape["mtgoCode"]> }
>;
export type SetsWithParentCode = Extract<
  typeof SetList.data[number],
  { parentCode: NonNullable<SetShape["parentCode"]> }
>;
export type SetsWithSealedProduct = Extract<
  typeof SetList.data[number],
  { sealedProduct: NonNullable<SetShape["sealedProduct"]> }
>;
export type SetsWithTcgplayerGroupId = Extract<
  typeof SetList.data[number],
  { tcgplayerGroupId: NonNullable<SetShape["tcgplayerGroupId"]> }
>;

/**
 * SET ENUMS: PROPERTIES ALWAYS PRESENT
 */
export type SetCode = typeof SetList.data[number]["code"];
export type KeyruneCode = typeof SetList.data[number]["keyruneCode"];
export type Name = typeof SetList.data[number]["name"];

/**
 * SET ENUMS: PROPERTIES OPTIONALLY PRESENT
 */
export type Block = SetsWithBlock["block"];
export type McmName = SetsWithMcmName["mcmName"];
export type MtgoCode = SetsWithMtgoCode["mtgoCode"];
export type ParentCode = SetsWithParentCode["parentCode"];
