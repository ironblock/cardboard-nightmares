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
