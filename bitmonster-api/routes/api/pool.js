const router = require("express").Router();
const controllers = require("../../controllers/pool.controller");
const auth = require("../auth");
const { authKey } = require("../auth");
const validator = require("../../validators");

router.put("/initPool", authKey, controllers.onInitPool);
router.put("/addPool", authKey, controllers.onAddPool);
router.get("/", controllers.onGetPool);

module.exports = router;
