const router = require("express").Router();
const controllers = require("../../controllers/farm.controller");
const auth = require("../auth");

const { authKey } = require("../auth");

router.post("/buy", authKey, controllers.onBuyMonster);
router.get("/getWithOwner", auth.required, controllers.onGetWithOwner);
router.put("/reborn", auth.required, controllers.onMonsterReborn);
router.get("/", authKey, controllers.onGetAll);
router.get("/:id", authKey, controllers.onGetById);

module.exports = router;
