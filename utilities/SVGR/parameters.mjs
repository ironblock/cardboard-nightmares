export const parameters = {
  /**
   * Prior to the release of Exodus (1998), all set symbols were black and white
   */
  rarityColorsIntroduced: "1998-06-15",
  /**
   * Mythic Rare didn't exist prior to Shards of Alara (2008)
   */
  mythicRareIntroduced: "2008-10-03",
  /**
   * Some set symbols use a white "base" layer with a black border, rather than
   * the default black "base" with white border.
   */
  dualLayerSymbols: [
    // Adventures in the Forgotten Realms
    "AFR",
    // Forgotten Realms Commander
    "AFC",
    // Commander 2021
    "C21",
    // Jumpstart: Historic Horizons
    "J21",
    // Innistrad Werewolves
    "XIN4",
  ],
  /**
   * Some of MTGJSON's choices for mapping Keyrune codes produce a result that
   * isn't correct to the original card art. This field overrides those values.
   */
  customMapping: {
    // Ice Age | White on black is original
    ICE: "ICE2",
  },
  /**
   * Older set symbols weren't designed with rarity colors in mind, so may not
   * translate well to a modern card template. This field provides values for
   * pre-Exodus cards that would prefer a different set symbol if they're going
   * to need to show rarity colors.
   */
  customModern: {},
};

export default parameters;
