import { css, ClassNames } from "@emotion/react";
import React, { RefAttributes } from "react";

import * as Keyrune from "../cache/SVGR";
import { noMythicRares, noRarityColors } from "../constants/MTGJSON/Sets";
import { Rarity } from "../types/MTGJSON/Enums";
import { SetCode } from "../types/MTGJSON/Sets";
import extractClassNames from "../utilities/emotion/extractClassNames";
import {
  eighthEditionToM15Filters,
  serializedCSS as rarityCSS,
} from "./SetSymbolDefsSVG";

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
  eigthEditionToM15: css`
    filter: url(#${eighthEditionToM15Filters.outline})
      url(#${eighthEditionToM15Filters.innerShadow})
      url(#${eighthEditionToM15Filters.outerShadow});
  `,

  ...rarityCSS,
};

export interface Props {
  set: SetCode;
  rarity: Rarity;
  original: boolean;
  eigthEditionToM15: boolean;
}

const SetSymbol = ({
  set,
  rarity,
  original,
  eigthEditionToM15,
  ...rest
}: Props & RefAttributes<SVGSVGElement>) => {
  const SVG =
    Keyrune[`${Keyrune.PREFIX}${set}`] ?? Keyrune[`${Keyrune.PREFIX}BCORE`];

  return (
    <ClassNames>
      {({ cx, css }) => {
        const s = extractClassNames(css, serializedCSS);
        let additionalStyles = [];
        let rarityClass = [s[rarity], s.useStroke];

        if (original && rarity !== "timeshifted") {
          if (noRarityColors.has(set)) {
            rarityClass = [""];
          } else if (rarity === "mythic" && noMythicRares.has(set)) {
            rarityClass = [s.rare, s.useStroke];
          }
        }

        if (eigthEditionToM15) {
          additionalStyles.push(s.eigthEditionToM15);
        }

        return (
          <SVG
            className={cx(s.base, ...additionalStyles, ...rarityClass)}
            {...rest}
          />
        );
      }}
    </ClassNames>
  );
};

export default SetSymbol;
