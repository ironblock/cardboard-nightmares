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
   *
   * TO USE: MTGJSON Code: Target KeyruneCode
   */
  dualLayerMapping: {
    // Adventures in the Forgotten Realms
    AFR: "AFR-BORDER",
    // Forgotten Realms Commander
    AFC: "AFC-BORDER",
    // Commander 2021
    C21: "C21-BORDER",
    // Jumpstart: Historic Horizons
    J21: "J21-BORDER",
    // Innistrad Werewolves
    XIN4: "XIN4-BORDER",
  },
  /**
   * Some of MTGJSON's choices for mapping Keyrune codes produce a result that
   * isn't correct to the original card art. This field overrides those values.
   *
   * These values take precedence over "dualLayerMapping".
   *
   * TO USE: MTGJSON Code: Target KeyruneCode
   */
  customMapping: {
    // Ice Age | White on black is original
    ICE: "ICE2",
    STX: "XSSM",
    KHM: "XKLD",
    XDND: "AFR-BORDER",
  },
  /**
   * Some set symbols are missing from Keyrune, or a better version is available
   * elsewhere on the internet.
   *
   * These values take precedence over "dualLayerMapping" and "customMapping".
   *
   * TO USE: MTGJSON Code: URL for replacement SVG
   */
  externalSource: {},
  /**
   * Older set symbols weren't designed with rarity colors in mind, so may not
   * translate well to a modern card template. This field provides values for
   * pre-Exodus cards that would prefer a different set symbol if they're going
   * to need to show rarity colors.
   *
   * These values are only used when "modernizing" an older card.
   *
   * TO USE: MTGJSON Code: Target KeyruneCode
   */
  customModern: {
    // Ice Age | Switch back to white border
    ICE: "ICE",
  },
};

export default parameters;
