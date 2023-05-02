export type MultiverseID = string;
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type URI = `https://${string}` | `http://${string}`;
export type Color = "W" | "U" | "B" | "R" | "G";
export type Colors = Color[];
export type GameContext = "paper" | "arena" | "mtgo";
export type Games = GameContext[];

export interface ImageURIs {
  small: URI;
  normal: URI;
  large: URI;
}
