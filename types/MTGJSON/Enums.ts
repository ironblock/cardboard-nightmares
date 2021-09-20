import EnumValues from "../../cache/EnumValues";

const { card, deck, foreignData, keywords, set } = EnumValues.data;

/**
 * CARD
 */
export type Availability = typeof card.availability[number];
export type BorderColor = typeof card.borderColor[number];
export type ColorIdentity = typeof card.colorIdentity[number];
export type ColorIndicator = typeof card.colorIndicator[number];
export type Colors = typeof card.colors[number];
export type DuelDeck = typeof card.duelDeck[number];
export type FrameEffects = typeof card.frameEffects[number];
export type FrameVersion = typeof card.frameVersion[number];
export type Layout = typeof card.layout[number];
export type PromoTypes = typeof card.promoTypes[number];
export type Rarity = typeof card.rarity[number];
export type Side = typeof card.side[number];
export type Subtypes = typeof card.subtypes[number];
export type Supertypes = typeof card.supertypes[number];
export type Types = typeof card.types[number];
export type Watermark = typeof card.watermark[number];

export interface Card {
  availability: Availability;
  borderColor: BorderColor;
  colorIdentity: ColorIdentity;
  colorIndicator: ColorIndicator;
  colors: Colors;
  duelDeck: DuelDeck;
  frameEffects: FrameEffects;
  frameVersion: FrameVersion;
  layout: Layout;
  promoTypes: PromoTypes;
  rarity: Rarity;
  side: Side;
  subtypes: Subtypes;
  supertypes: Supertypes;
  types: Types;
  watermark: Watermark;
}

/**
 * DECK
 */
export type DeckType = typeof deck.type[number];

/**
 * FOREIGN DATA
 */
export type Language = typeof foreignData.language[number];

/**
 * KEYWORDS
 */
export type AbilityWords = typeof keywords.abilityWords[number];
export type KeywordAbilities = typeof keywords.keywordAbilities[number];
export type KeywordActions = typeof keywords.keywordActions[number];

/**
 * SET
 */
export type SetType = typeof set.type[number];
