const router = require("express").Router();
const controllers = require("../../controllers/admin.controller");
const { authKey } = require("../auth");

router.post("/create", controllers.onCreateBurn);
router.post("/monster", authKey, controllers.onInsertMonster);
router.post("/land", authKey, controllers.onInsertLand);
router.post("/item", authKey, controllers.onInsertAsset);

module.exports = router;
