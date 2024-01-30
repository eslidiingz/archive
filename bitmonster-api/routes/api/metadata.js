const router = require("express").Router();
const controllers = require("../../controllers/metadata.controller");
const auth = require("../auth");
const validator = require("../../validators");

router.get("/monster/:id", controllers.onGetMonster);
router.get("/land/:id", controllers.onGetLand);
router.get("/item/:id", controllers.onGetItem);
router.get("/type/item", controllers.onGetTypeItem);

module.exports = router;
