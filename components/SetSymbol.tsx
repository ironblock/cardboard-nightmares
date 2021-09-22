import { css } from "@emotion/react";
import React, { RefAttributes } from "react";

import * as Keyrune from "../cache/SVGR";
import { Rarity } from "../types/MTGJSON/Enums";
import { SetCode } from "../types/MTGJSON/Sets";

export const s = {
  SVG: css``,
  common: css``,
  uncommon: css``,
  rare: css``,
  mythic: css``,
  bonus: css``,
};

export interface Props {
  set: SetCode;
  rarity: Rarity;
}

const SetSymbol = ({
  set,
  rarity,
  ...rest
}: Props & RefAttributes<SVGSVGElement>) => {
  const SVG = Keyrune[`${Keyrune.PREFIX}${set}`];

  return <SVG {...rest} />;
};

export default SetSymbol;
