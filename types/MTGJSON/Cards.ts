import {
  AbilityWords,
  Availability,
  BorderColor,
  ColorIdentity,
  ColorIndicator,
  Colors,
  DuelDeck,
  FrameEffects,
  FrameVersion,
  KeywordAbilities,
  KeywordActions,
  Layout,
  PromoTypes,
  Rarity,
  Side,
  Subtypes,
  Supertypes,
  Types,
  Watermark,
} from "./Enums";
import {
  ForeignData,
  Identifiers,
  Legalities,
  PurchaseUrls,
  Rulings,
  LeadershipSkills,
} from "./Models";
import { SetCode } from "./Sets";

/**
 * The Card (Atomic) file model describes the a single atomic card, an
 * oracle-like entity of a Magic: The Gathering card that only stores evergreen
 * data about a card that would never change from printing to printing.
 */
export interface CardAtomic {
  /** The ASCII(opens new window) (Basic/128) code formatted card name with no special unicode characters. */
  asciiName?: string;

  /** A list of all the colors found in manaCost, colorIndicator, and text. */
  colorIdentity: ColorIdentity[];

  /** A list of all the colors in the color indicator (The symbol prefixed to a card's types). */
  colorIndicator?: ColorIndicator[];

  /** A list of all the colors in manaCost and colorIndicator. Some cards may not have a value, such as cards with "Devoid" in its text. */
  colors: Colors[];

  /** The converted mana cost of the card. */
  convertedManaCost: number;

  /** The card rank on EDHRec(opens new window). */
  edhrecRank?: number;

  /** The converted mana cost of the face of either half or part of the card. */
  faceConvertedManaCost?: number;

  /** The name on the face of the card. */
  faceName?: string;

  /** A list of data properties in other languages. See the Foreign Data data model. */
  foreignData: ForeignData;

  /** The starting maximum hand size total modifier. A + or - character precedes an integer. */
  hand?: string;

  /** If the card allows a value other than 4 copies in a deck. */
  hasAlternativeDeckLimit?: boolean;

  /** A list of identifiers associated to a card. See the Identifiers data model. */
  identifiers: Identifiers;

  /** If the card is on the Magic: The Gathering Reserved List(opens new window). */
  isReserved?: boolean;

  /** A list of keywords found on the card. */
  keywords?: Array<AbilityWords | KeywordAbilities | KeywordActions>;

  /** The type of card layout. For a token card, this will be "token". */
  layout: Layout;

  /** A list of formats the card is legal to be a commander in. See the Leadership Skills data model. */
  leadershipSkills?: LeadershipSkills;

  /** A list of play formats the card the card is legal in. See the Legalities data model. */
  legalities: Legalities;

  /** The starting life total modifier. A plus or minus character precedes an integer. Used only on cards with "Vanguard" in its types. */
  life?: string;

  /** The loyalty value of the card. Used on Planeswalker cards. */
  loyalty?: string;

  /** The mana cost of the card. */
  manaCost?: string;

  /** The name of the card. Cards with multiple faces, like "Split" and "Meld" cards are given a delimiter. */
  name: string;

  /** The power of the card. */
  power?: string;

  /** A list of set codes the card was printed in, formatted in uppercase. */
  printings?: SetCode[];

  /** Links that navigate to websites where the card can be purchased. See the Purchase Urls data model. */
  purchaseUrls: PurchaseUrls;

  /** The official rulings of the card. See the Rulings data model. */
  rulings: Rulings;

  /** The identifier of the card side. Used on cards with multiple faces. */
  side?: string;

  /** A list of card subtypes found after em-dash. */
  subtypes: Subtypes;

  /** A list of card supertypes found before em-dash. */
  supertypes: Supertypes;

  /** The rules text of the card. */
  text?: string;

  /** The toughness of the card. */
  toughness?: string;

  /** The type of the card as visible, including any supertypes and subtypes. */
  type: string;

  /** A list of all card types of the card, including Un‑sets and gameplay variants. */
  types: Types;
}

/**
 * NOTE: This type doesn't exist on MTGJSON. It's an ergonomic convenience to
 * combine attributes that are common to various descendent types.
 */
export interface CardInstance extends CardAtomic {
  /** The name of the artist that illustrated the card art. */
  artist?: string;

  /** A list of the card's available printing types. */
  availability: Availability[];

  /** The color of the card border. */
  borderColor: BorderColor;

  /** The italicized text found below the rules text that has no game function. */
  flavorText?: string;

  /** The visual frame effect. */
  frameEffects: FrameEffects[];

  /** The version of the card frame style. */
  frameVersion: FrameVersion;

  /** If the card be found in foil. */
  hasFoil: boolean;

  /** If the card can be found in non-foil. */
  hasNonFoil: boolean;

  /** If the card has full artwork. */
  isFullArt?: boolean;

  /** If the card is only available in Magic: The Gathering Online(opens new window). */
  isOnlineOnly?: boolean;

  /** If the card is promotional. */
  isPromo?: boolean;

  /** If the card has been reprinted. */
  isReprint?: boolean;

  /** The number of the card. Can be prefixed or suffixed with a * or other characters for promo sets. */
  number: string;

  /** A list of promotional types for a card. */
  promoTypes: PromoTypes[];
}

/**
 * The Card (Token) data model describes the properties and values of a single card token.
 */
export interface CardToken extends CardInstance {
  /** The names of the cards that produce this card. */
  reverseRelated: string;
}

/**
 * The Card (Set) data model describes the properties of a single card.
 */
export interface CardSet extends CardInstance {
  /** The promotional card name printed above the true card name on special cards that has no game function. See this card(opens new window) for an example. */
  flavorName?: string;

  /** If the card marked by Wizards of the Coast(opens new window) for having sensitive content. Cards with this property may have missing or degraded properties and values. See this official article(opens new window) for more information. */
  hasContentWarning?: boolean;

  /** If the card has some kind of alternative variation to its printed counterpart. */
  isAlternative?: boolean;

  /** If the card is oversized. */
  isOversized?: boolean;

  /** If this card is found in a booster pack. */
  isStarter?: boolean;

  /** If the card has a story spotlight. */
  isStorySpotlight?: boolean;

  /** If the card does not have a text box. */
  isTextless?: boolean;

  /** If this card is "timeshifted", a feature from Time Spiral block. */
  isTimeshifted?: boolean;

  /** The original release date in ISO 8601(opens new window) format for a promotional card printed outside of a cycle window, such as Secret Lair Drop promotions. */
  originalReleaseDate?: string;

  /** The text on the card as originally printed. */
  originalText?: string;

  /** The type of the card as originally printed. Includes any supertypes and subtypes. */
  originalType?: string;

  /** A list of UUID's of this card with counterparts, such as transformed or melded faces. */
  otherFaceIds: string[];

  /** The card printing rarity. */
  rarity: Rarity;

  /** The universal unique identifier (v5) generated by MTGJSON. Each entry is unique. */
  uuid: string;

  /** A list of UUID's of this card with alternate printings in the same set. Excludes Un‑sets. */
  variations: string[];

  /** The name of the watermark on the card. */
  watermark?: string;
}

/**
 * The Card (Deck) data model describes the properties and values of a single card.
 */
export interface CardDeck extends CardSet {
  isFoil: boolean;
  count: boolean;
  duelDeck: DuelDeck;
}
