import { app } from "../config";

var _token, _launchpad, _locker, _stake;

if (app === "production") {
} else if (app === "staging") {
} else if (app === "local") {
  _token = require("./local/token.json");
  _launchpad = require("./local/launchpad.json");
  _locker = require("./local/locker.json");
  _stake = require("./local/stake.json");
}

export const abiToken = _token;
export const abiLaunchpad = _launchpad;
export const abiLocker = _locker;
export const abiStake = _stake;
