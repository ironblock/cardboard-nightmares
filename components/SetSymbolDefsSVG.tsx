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

export const gradientPrefix = "gradient-";
export const eighthEditionToM15Filters = {
  outline: "filter-heavy-white-outline",
  innerShadow: "filter-inner-drop-shadow",
  outerShadow: "filter-outer-drop-shadow",
};

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
      fill: url(#${gradientPrefix + name});
    }
  `;

  return output;
}, {} as SerializedStyleMap<typeof gradients>);

const NonMemoSetSymbolDefsSVG = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    style={{ width: 0, height: 0, position: "absolute" }}
  >
    <defs>
      {/* HEAVY WHITE OUTLINE - 8TH EDITION TO M15*/}
      <filter id={eighthEditionToM15Filters.outline}>
        <feMorphology
          in="SourceAlpha"
          result="expanded"
          operator="dilate"
          radius="1"
        />
        <feFlood floodColor="white" />
        <feComposite in2="expanded" operator="in" />
        <feComposite in="SourceGraphic" />
      </filter>

      {/* INNER DROP SHADOW - 8TH EDITION TO M15*/}
      <filter
        id={eighthEditionToM15Filters.innerShadow}
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5" />
      </filter>

      {/* OUTER DROP SHADOW - 8TH EDITION TO M15*/}
      <filter
        id={eighthEditionToM15Filters.outerShadow}
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5" />
      </filter>

      {Object.entries(gradients).map(([name, stops]) => (
        <linearGradient key={name} id={`${gradientPrefix}${name}`}>
          {stops.map((props) => (
            <stop key={props.offset} {...props} />
          ))}
        </linearGradient>
      ))}
    </defs>
  </svg>
);

export const SetSymbolDefsSVG = React.memo(NonMemoSetSymbolDefsSVG);

export default SetSymbolDefsSVG;
