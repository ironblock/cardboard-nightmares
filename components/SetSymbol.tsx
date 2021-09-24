import { css, ClassNames } from "@emotion/react";
import React, { RefAttributes } from "react";

import * as Keyrune from "../cache/SVGR";
import { Rarity } from "../types/MTGJSON/Enums";
import { SetCode } from "../types/MTGJSON/Sets";
import extractClassNames from "../utilities/emotion/extractClassNames";
import { serializedCSS as rarityCSS } from "./RarityGradientSVG";

export const serializedCSS = {
  base: css`
    display: inline-block;
    line-height: 1em;
    vertical-align: middle;
    fill: url("#rarity-gradient");
  `,
  duo: css``,

  ...rarityCSS,
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
  return (
    <ClassNames>
      {({ cx, css }) => {
        const s = extractClassNames(css, serializedCSS);

        return <SVG className={cx(s.base, s[rarity])} {...rest}></SVG>;
      }}
    </ClassNames>
  );
};

export default SetSymbol;
