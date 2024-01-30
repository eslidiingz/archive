// const env = require("dotenv");
export const app = process.env.ENVIRONMENT;
export const debug = process.env.APP_DEBUG === "true" ? true : false;
console.log("debug", debug);
import local from "./config.local";
import staging from "./config.staging";
import production from "./config.production";

var Config = local;

if (app === "production") {
  Config = production;
} else if (app === "staging") {
  Config = staging;
}

Config.PROVIDER_LIST = {
  97: "https://data-seed-prebsc-1-s2.binance.org:8545/",
  56: "https://bsc-dataseed.binance.org/",
  80001: "https://nd-851-869-734.p2pify.com/f403df1ee9cec1bab45a5302e359ba3e",
};

Config.JSON_RPC = Config.PROVIDER_LIST[process.env.CHAIN_ID];

if (debug) {
  console.log(`%c========== App (${app}) ==========`, `color: skyblue`);
  console.log("CHAIN_ID", process.env.CHAIN_ID);
  console.log("LAND_CA", Config.LAND_CA);
  console.log("ITEM_CA", Config.ITEM_CA);
  console.log("MYSTERYBOX_CA", Config.MYSTERYBOX_CA);
  console.log("MARKET_CA", Config.MARKET_CA);
  console.log(`%c========== End Config App ==========`, `color: skyblue`);
}

export default Config;
