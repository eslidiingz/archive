require("dotenv").config();
const router = require("express").Router();
const controllers = require("../../controllers/_test.controller");

if (process.env.CHAIN_ID != 56) {
  router.get("/encodeKey", controllers.encodeKey);
  router.post("/decodeKey", controllers.decodeKey);
  router.post(
    "/removeAllMonsterAndInsertOne",
    controllers.removeAllMonsterAndInsertOne
  );
}

module.exports = router;
