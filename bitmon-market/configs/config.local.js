const ConfigLocal = {
  CHAIN_ID: process.env.CHAIN_ID,
  /** ABIs */
  BUSD_ABI: require("../abis/local/Busd.json"),
  MONSTER_ABI: require("../abis/local/Monster.json"),
  LAND_ABI: require("../abis/local/Land.json"),
  ITEM_ABI: require("../abis/local/Item.json"),
  MYSTERYBOX_WHITELIST_ABI: require("../abis/local/MysteryBoxWhitelist.json"),
  MYSTERYBOX_ABI: require("../abis/local/MysteryBox.json"),
  TOKEN_WHITELIST_ABI: require("../abis/local/TokenWhitelist.json"),
  MARKET_ABI: require("../abis/local/Market.json"),
  ERC20_ABI: require("../abis/local/ERC20.json"),

  //** ROLE */
  WHITELIST_ROLE:
    "0x8ef86fad7d1f928a3294c0d6bc10cfae9863271c28df9cdabe172f1502d1fcdb",

  /** URIs */
  METADATA_URI: "http://localhost:3001/api/v1/metadata",
  REST_API_URL: "http://localhost:3001/api/v1",
  INVENTORY_IMG_URL: "http://localhost:3001/images",
};

if (process.env.CHAIN_ID == 97) {
  // testnet bsc [demo2]
  ConfigLocal.BUSD_CA = "0x1E03067A3CCAB676a5FFaE386a7394Ca1f103bfb";
  ConfigLocal.MONSTER_CA = "0xa4f879883D8bCC9a25981a2b9791F129D5562DC9";
  ConfigLocal.LAND_CA = "0xD2D070DB56258E31193B0F2963b9B076FC1D9A30";
  ConfigLocal.ITEM_CA = "0x29732E891CAeFd0923144EE1CfD472C07e23DfBf";
  ConfigLocal.MYSTERYBOX_WHITELIST_CA =
    "0xeF562018C397c598d66Ab5A7d21827F6D1f63667";
  ConfigLocal.MYSTERYBOX_CA = "0x92344d05F80A77DC1D4E52c3EF2B093D8798f80c";
  ConfigLocal.TOKEN_WHITELIST_CA =
    "0xAaB822cb629612cF8627E1E082475fB9ee4a2903";
  ConfigLocal.MARKET_CA = "0xF2F535adFc6A8074a875626C731A8dC4Ef51486d";
  ConfigLocal.DMS_CA = "0x02cBbF9aCdD5b25eE384cd0A4eE25323D1A1c039";
  ConfigLocal.DGS_CA = "0x0Efc9AB6f68e7799dc9540E1C042905632d7B41A";
  // ConfigLocal.EPLUSMEX_CA = "0x2693c9Ba619875F2236440c07Be281054dCb0c94";
} else if (process.env.CHAIN_ID == 80001) {
  // testnet polygon (mumbai)
  ConfigLocal.BUSD_CA = "0x8195fB43c73E577d66f07C55f863C8607b0976A6";
  ConfigLocal.MONSTER_CA = "0xf3267dc925554d201dabf6796d71c1daf7664454";
  ConfigLocal.LAND_CA = "0x771fe3a879bfa041355ec147721c691c468a7959";
  ConfigLocal.ITEM_CA = "0x170ab932c2dca3644ed6061f53c57e7054d8d118";
  ConfigLocal.MYSTERYBOX_WHITELIST_CA =
    "0x2b64733e36b85561662cf02660691ce36873a0ca";
  ConfigLocal.MYSTERYBOX_CA = "0x09FD3ADA340aFE1926D5872d3fFB0ac2c4CCA8CA";
  ConfigLocal.TOKEN_WHITELIST_CA =
    "0x4539e31c277268642f482744d0a5a57aadf5df7a";
  ConfigLocal.MARKET_CA = "0x3a8E8f07036205a492624F6E880bbC1a0ade4833";
  ConfigLocal.DMS_CA = "0x81FfFc301Cb3ff3E005739BCd37aFD17c4C61962";
  ConfigLocal.DGS_CA = "0x487079363Eabc50c81bB216b70216976d59C8383";
  // ConfigLocal.EPLUSMEX_CA = "";
}
export default ConfigLocal;
