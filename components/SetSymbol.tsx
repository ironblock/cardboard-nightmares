import { css, ClassNames } from "@emotion/react";
import React, { RefAttributes } from "react";

import * as Keyrune from "../cache/SVGR";
import { noMythicRares, noRarityColors } from "../constants/MTGJSON/Sets";
import { Rarity } from "../types/MTGJSON/Enums";
import { SetCode } from "../types/MTGJSON/Sets";
import extractClassNames from "../utilities/emotion/extractClassNames";
import { serializedCSS as rarityCSS } from "./SetSymbolDefsSVG";

export const serializedCSS = {
  base: css`
    display: inline-block;
    line-height: 1em;
    vertical-align: middle;
    stroke-width: 0.03em;
  `,
  duo: css``,
  useStroke: css`
    stroke: black;
  `,

  ...rarityCSS,
};

export interface Props {
  set: SetCode;
  rarity: Rarity;
  original: boolean;
}

const SetSymbol = ({
  set,
  rarity,
  original,
  ...rest
}: Props & RefAttributes<SVGSVGElement>) => {
  const SVG = Keyrune[`${Keyrune.PREFIX}${set}`];

  return (
    <ClassNames>
      {({ cx, css }) => {
        const s = extractClassNames(css, serializedCSS);
        let rarityClass = [s[rarity], s.useStroke];

        if (original && rarity !== "timeshifted") {
          if (noRarityColors.has(set)) {
            rarityClass = [""];
          } else if (rarity === "mythic" && noMythicRares.has(set)) {
            rarityClass = [s.rare, s.useStroke];
          }
        }

        return <SVG className={cx(s.base, ...rarityClass)} {...rest} />;
      }}
    </ClassNames>
  );
};

export default SetSymbol;
