const router = require("express").Router();
const controllers = require("../../controllers/userLand.controller");
const auth = require("../auth");
const { authKey } = require("../auth");

router.post("/buy", authKey, controllers.onBuyLand);
router.get("/getWithOwner", auth.required, controllers.onGetWithOwner);
router.put("/updateActive", auth.required, controllers.onUpdateActive);
router.put("/assignAsset", auth.required, controllers.onAssignAsset);
router.put("/removeAsset", auth.required, controllers.onRemoveAsset);
router.put("/resetAsset", auth.required, controllers.onResetAsset);
router.put("/assignMonster", auth.required, controllers.onAssignMonster);
router.put("/removeMonster", auth.required, controllers.onRemoveMonster);
router.put("/updateInLands", auth.required, controllers.onUpdateInLands);
router.put("/updateAssetInLands", auth.required, controllers.onIncrementAsset);
router.put(
  "/updateMonsterEatInLand",
  auth.required,
  controllers.onMonsterUpdate
);
router.put(
  "/updateMonsterHabitInLand",
  auth.required,
  controllers.onHabitUpdate
);
router.put("/resetLand", auth.required, controllers.onResetLand);
router.put("/evoMonster", auth.required, controllers.onEvoMonster);

module.exports = router;
