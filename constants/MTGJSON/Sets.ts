import SetList from "../../cache/SetList";
import { SetType } from "../../types/MTGJSON/Enums";
import { KeyruneCode, SetCode, SetShape } from "../../types/MTGJSON/Sets";

const inReleaseOrder: SetShape[] = [];
const byCode: Partial<{ [key in SetCode]: SetShape }> = {};
const byType: Partial<{ [key in SetType]: SetShape }> = {};
const byKeyruneCode: Partial<{ [key in KeyruneCode]: SetShape }> = {};

for (const set of SetList.data) {
  byCode[set.code] = set;
  byType[set.type] = set;
  byKeyruneCode[set.keyruneCode] = set;
}

export const SetsInReleaseOrder = inReleaseOrder as SetShape[];
export const SetsByCode = byCode as { [key in SetCode]: SetShape };
export const SetsByType = byType as { [key in SetType]: SetShape };
export const SetsByKeyruneCode = byKeyruneCode as {
  [key in KeyruneCode]: SetShape;
};
