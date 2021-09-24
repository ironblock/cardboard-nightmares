import { css, SerializedStyles } from "@emotion/react";
import React from "react";

import { rarity, Rarity } from "../types/MTGJSON/Enums";
import { SerializedStyleMap } from "../utilities/emotion/extractClassNames";

/**
 * NOTE: This is a special global component, used to define the rarity gradients
 * in a hidden <svg>'s <def>s. This lets other components (eg. <SetSymbol />)
 * reference the gradient via `fill: url(#gradient-id);`. It should be lighter
 * weight than redefining the gradient in every <svg> isntance.
 */

export interface GradientStopProps {
  stopColor: string;
  offset: string;
}

export const idPrefix = "gradient-";
export const gradients: Record<Rarity, GradientStopProps[]> = {
  common: [
    { stopColor: "#302b2c", offset: "1%" },
    { stopColor: "#474040", offset: "50%" },
    { stopColor: "#302b2c", offset: "100%" },
  ],
  uncommon: [
    { stopColor: "#5a6572", offset: "0%" },
    { stopColor: "#9e9e9e", offset: "50%" },
    { stopColor: "#5a6572", offset: "100%" },
  ],
  rare: [
    { stopColor: "#876a3b", offset: "0%" },
    { stopColor: "#dfbd6b", offset: "50%" },
    { stopColor: "#876a3b", offset: "100%" },
  ],
  mythic: [
    { stopColor: "#b21f0f", offset: "0%" },
    { stopColor: "#f38300", offset: "50%" },
    { stopColor: "#b21f0f", offset: "100%" },
  ],
  timeshifted: [
    { stopColor: "#652978", offset: "0%" },
    { stopColor: "#c09ac5", offset: "50%" },
    { stopColor: "#652978", offset: "100%" },
  ],
  bonus: [
    { stopColor: "#652978", offset: "0%" },
    { stopColor: "#c09ac5", offset: "50%" },
    { stopColor: "#652978", offset: "100%" },
  ],
  special: [
    { stopColor: "#652978", offset: "0%" },
    { stopColor: "#c09ac5", offset: "50%" },
    { stopColor: "#652978", offset: "100%" },
  ],
};

export const serializedCSS = rarity.reduce((output, name) => {
  output[name] = css`
    path {
      fill: url(#${idPrefix + name});
    }
  `;

  return output;
}, {} as SerializedStyleMap<typeof gradients>);

const NonMemoRarityGradientSVG = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    style={{ width: 0, height: 0, position: "absolute" }}
  >
    {Object.entries(gradients).map(([name, stops]) => (
      <linearGradient key={name} id={`${idPrefix}${name}`}>
        {stops.map((props) => (
          <stop key={props.offset} {...props} />
        ))}
      </linearGradient>
    ))}
  </svg>
);

export const RarityGradientSVG = React.memo(NonMemoRarityGradientSVG);

export default RarityGradientSVG;
