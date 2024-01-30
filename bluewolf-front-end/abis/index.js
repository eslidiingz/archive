import { app } from "../utils/config";

var _abiBwCoin, _abiBwNft, _abiMarket;

if (app === "local") {
  _abiBwCoin = require("./local/BWCoin.json");
  _abiBwNft = require("./local/BWNFT.json");
  _abiMarket = require("./local/BWNFTMarket.json");
} else if (app === "staging") {
  _abiBwCoin = require("./staging/BWCoin.json");
  _abiBwNft = require("./staging/BWNFT.json");
  _abiMarket = require("./staging/BWNFTMarket.json");
} else if (app === "production") {
  _abiBwCoin = require("./production/BWCoin.json");
  _abiBwNft = require("./production/BWNFT.json");
  _abiMarket = require("./production/BWNFTMarket.json");
}

export const abiBwCoin = _abiBwCoin;
export const abiBwNft = _abiBwNft;
export const abiMarket = _abiMarket;
