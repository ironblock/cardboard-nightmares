export type MultiverseID = string;
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type URI = `https://${string}` | `http://${string}`;
export type Color = "W" | "U" | "B" | "R" | "G";
export type Colors = Color[];
export type GameContext = "paper" | "arena" | "mtgo";
export type Games = GameContext[];

export type CardImageType =
  | "art_crop"
  | "border_crop"
  | "large"
  | "normal"
  | "png"
  | "small";
export type ImageURIs = Record<CardImageType, URI> & {
  art_crop: `"https://cards.scryfall.io/art_crop/front/0/b/${UUID}.jpg?${number}`;
  border_crop: `"https://cards.scryfall.io/border_crop/front/0/b/${UUID}.jpg?${number}`;
  large: `"https://cards.scryfall.io/large/front/0/b/${UUID}.jpg?${number}`;
  normal: `"https://cards.scryfall.io/normal/front/0/b/${UUID}.jpg?${number}`;
  png: `"https://cards.scryfall.io/png/front/0/b/${UUID}.png?${number}`;
  small: `"https://cards.scryfall.io/small/front/0/b/${UUID}.jpg?${number}`;
};
export type Keyword = string;
