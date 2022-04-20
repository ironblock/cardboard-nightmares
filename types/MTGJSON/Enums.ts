import EnumValues from "../../cache/MTGJSON/EnumValues";

const { card, deck, foreignData, keywords, set } = EnumValues.data;

export const playFormat = [
  "brawl",
  "commander",
  "duel",
  "future",
  "frontier",
  "historic",
  "legacy",
  "modern",
  "pauper",
  "penny",
  "pioneer",
  "standard",
  "vintage",
] as const;
export const legality = ["Legal", "Banned", "Restricted"] as const;

export type PlayFormat = typeof playFormat[number];
export type Legality = typeof legality[number];

/**
 * CARD
 */
export const availability = [...card.availability] as const;
export const borderColor = [...card.borderColor] as const;
export const colorIdentity = [...card.colorIdentity] as const;
export const colorIndicator = [...card.colorIndicator] as const;
export const colors = [...card.colors] as const;
export const duelDeck = [...card.duelDeck] as const;
export const frameEffects = [...card.frameEffects] as const;
export const frameVersion = [...card.frameVersion] as const;
export const layout = [...card.layout] as const;
export const promoTypes = [...card.promoTypes] as const;
export const rarity = [...card.rarity, "timeshifted"] as const;
export const side = [...card.side] as const;
export const subtypes = [...card.subtypes] as const;
export const supertypes = [...card.supertypes] as const;
export const types = [...card.types] as const;
export const watermark = [...card.watermark] as const;

export type Availability = typeof availability[number];
export type BorderColor = typeof borderColor[number];
export type ColorIdentity = typeof colorIdentity[number];
export type ColorIndicator = typeof colorIndicator[number];
export type Colors = typeof colors[number];
export type DuelDeck = typeof duelDeck[number];
export type FrameEffects = typeof frameEffects[number];
export type FrameVersion = typeof frameVersion[number];
export type Layout = typeof layout[number];
export type PromoTypes = typeof promoTypes[number];
export type Rarity = typeof rarity[number];
export type Side = typeof side[number];
export type Subtypes = typeof subtypes[number];
export type Supertypes = typeof supertypes[number];
export type Types = typeof types[number];
export type Watermark = typeof watermark[number];

/**
 * DECK
 */
export const deckType = [...deck.type] as const;
export type DeckType = typeof deckType[number];

/**
 * FOREIGN DATA
 */
export const language = [...foreignData.language] as const;
export type Language = typeof language[number];

/**
 * KEYWORDS
 */
export const abilityWords = [...keywords.abilityWords] as const;
export const keywordAbilities = [...keywords.keywordAbilities] as const;
export const keywordActions = [...keywords.keywordActions] as const;

export type AbilityWords = typeof abilityWords[number];
export type KeywordAbilities = typeof keywordAbilities[number];
export type KeywordActions = typeof keywordActions[number];

/**
 * SET
 */
export const setType = [...set.type] as const;
export type SetType = typeof setType[number];
