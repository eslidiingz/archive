const dateHelper = require("./date.helper");
const stakeHelper = require("./stake.helper");

const methods = {
  ...dateHelper,
  ...stakeHelper,
};

module.exports = { methods };
