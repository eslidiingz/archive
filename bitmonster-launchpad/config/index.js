export const app = "local";

import local from "./config.local";

var Config = local;

if (app === "production") {
  Config = production;
} else if (app === "staging") {
  Config = staging;
}

export default Config;
