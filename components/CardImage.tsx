"use client";

import Image from "next/image";
import { CardImageType, ImageURIs } from "../types/Scryfall/Attributes";
import { css } from "@emotion/react";

export const ScryfallImageSizes: Record<
  CardImageType,
  [width: number, height: number]
> = {
  // A transparent, rounded full card PNG. This is the best image to use for
  // videos or other high-quality content.
  png: [745, 1040],

  // A full card image with the rounded corners and the majority of the border
  // cropped off. Designed for dated contexts where rounded images can’t be
  // used.
  border_crop: [480, 680],
  // A large full card image
  large: [672, 936],

  // A medium-sized full card image
  normal: [488, 680],

  // A small full card image. Designed for use as thumbnail or list icon.
  small: [146, 204],

  // WARNING: The next/image component requires a known width and height OR
  // layout="fill". Scryfall's art crops have varied dimensions and will need
  // special handling.
  //
  // A rectangular crop of the card’s art only. Not guaranteed to be perfect for
  // cards with outlier designs or strange frame arrangements
  art_crop: [NaN, NaN],
};

export interface CardImageProps {
  kind: CardImageType;
  uris: ImageURIs;
  alt: string;
}
export type PreTypedCardImageProps = Omit<CardImageProps, "kind">;

export const CardImageStyles = css`
  border-radius: 5.35%/3.85%;
  margin: 0.1em;
  padding: 0;
  box-shadow: 0.05em 0.05em 0.2em rgba(0, 0, 0, 0.15);
  border: 0.05rem inset rgba(22, 22, 22, 0.66);
`;

export function CardImage({ kind, uris, alt, ...rest }: CardImageProps) {
  return (
    <Image
      css={CardImageStyles}
      src={uris?.[kind] ?? uris?.normal ?? ""}
      width={ScryfallImageSizes[kind][0]}
      height={ScryfallImageSizes[kind][1]}
      alt={alt}
      {...rest}
    />
  );
}

export const PngCardImage = (props: PreTypedCardImageProps) => (
  <CardImage kind="png" {...props} />
);
export const BorderCropCardImage = (props: PreTypedCardImageProps) => (
  <CardImage kind="border_crop" {...props} />
);
export const LargeCardImage = (props: PreTypedCardImageProps) => (
  <CardImage kind="large" {...props} />
);
export const NormalCardImage = (props: PreTypedCardImageProps) => (
  <CardImage kind="normal" {...props} />
);
export const SmallCardImage = (props: PreTypedCardImageProps) => (
  <CardImage kind="small" {...props} />
);
