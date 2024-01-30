const ConfigProduction = {
  CHAIN_ID: process.env.CHAIN_ID,
  /** ABIs */
  BUSD_ABI: require("../abis/production/Busd.json"),
  MONSTER_ABI: require("../abis/production/Monster.json"),
  LAND_ABI: require("../abis/production/Land.json"),
  ITEM_ABI: require("../abis/production/Item.json"),
  MYSTERYBOX_WHITELIST_ABI: require("../abis/production/MysteryBoxWhitelist.json"),
  MYSTERYBOX_ABI: require("../abis/production/MysteryBox.json"),
  TOKEN_WHITELIST_ABI: require("../abis/production/TokenWhitelist.json"),
  MARKET_ABI: require("../abis/production/Market.json"),
  ERC20_ABI: require("../abis/production/ERC20.json"),

  //** ROLE */
  WHITELIST_ROLE:
    "0x8ef86fad7d1f928a3294c0d6bc10cfae9863271c28df9cdabe172f1502d1fcdb",

  /** URIs */
  METADATA_URI: "https://api.bitmonsternft.com/api/v1/metadata",
  REST_API_URL: "https://api.bitmonsternft.com/api/v1",
  INVENTORY_IMG_URL: "https://api.bitmonsternft.com/images",

  /** Contract Address */
  BUSD_CA: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  MONSTER_CA: "0x9c2BfD3e40a5A50dc15Ee5d5244110360F7A44aD",
  LAND_CA: "0x1DEAFd13d1218E57Ff73AE93B23AB99F59ffFebD",
  ITEM_CA: "0xc1f274E7219Ac003cD58dd7c869a13e599C86771",
  MYSTERYBOX_WHITELIST_CA: "0x6b3027722DaF0DCAe147ef7F4142c1E4EdE2b3Af",
  MYSTERYBOX_CA: "0x3847aE58f01522950B0b2885b2f49AaEec53C747",
  TOKEN_WHITELIST_CA: "0x1fA94206928a8aa7A829A8f00878B8e297cdbc77",
  MARKET_CA: "0xbD83eca88FbDf5DC59Cb79cBee6d9110BAe8EdAF",
  DMS_CA: "0x0CfD49Df28EA5199170122571BF33b68Da26f99D",
  // RBS_CA: "0x5d567165E47f247e3D2a62729A6AB5248C9dD244",
  DGS_CA: "0xFEd7de794E49AEFD334Acf87DfaC2187FEc5F969",
  // EPLUSMEX_CA: "0x2693c9Ba619875F2236440c07Be281054dCb0c94",
};

export default ConfigProduction;
