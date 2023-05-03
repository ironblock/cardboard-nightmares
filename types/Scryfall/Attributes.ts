export type MultiverseID = string;
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type URI = `https://${string}` | `http://${string}`;
export type Color = "W" | "U" | "B" | "R" | "G";
export type Colors = Color[];
export type GameContext = "paper" | "arena" | "mtgo";
export type Games = GameContext[];

export interface ImageURIs<I extends UUID> {
  art_crop: `"https://cards.scryfall.io/art_crop/front/0/b/${I}.jpg?${number}`;
  border_crop: `"https://cards.scryfall.io/border_crop/front/0/b/${I}.jpg?${number}`;
  large: `"https://cards.scryfall.io/large/front/0/b/${I}.jpg?${number}`;
  normal: `"https://cards.scryfall.io/normal/front/0/b/${I}.jpg?${number}`;
  png: `"https://cards.scryfall.io/png/front/0/b/${I}.png?${number}`;
  small: `"https://cards.scryfall.io/small/front/0/b/${I}.jpg?${number}`;
}
