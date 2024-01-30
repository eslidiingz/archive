require("dotenv").config();
const router = require("express").Router();
const controllers = require("../../controllers/ranking.controller");
const validator = require("../../validators");
const { authKey } = require("../auth");

if (process.env.CHAIN_ID == 56) {
  router.put(
    "/endMatch",
    [authKey, validator.ranking.verifyWallet, validator.check],
    controllers.onEndMatch
  );
  router.put(
    "/startMatch",
    [authKey, validator.ranking.verifyWallet, validator.check],
    controllers.onStartMatch
  );
} else {
  router.put(
    "/endMatch",
    [validator.ranking.verifyWallet, validator.check],
    controllers.onEndMatch
  );
  router.put(
    "/startMatch",
    [validator.ranking.verifyWallet, validator.check],
    controllers.onStartMatch
  );
}
// router.post("/test", controllers.onTest);

router.get("/", controllers.onRanking);

module.exports = router;
