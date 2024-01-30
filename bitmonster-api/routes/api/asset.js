const router = require("express").Router();
const controllers = require("../../controllers/asset.controller");
const { authKey } = require("../auth");
router.get("/getDefault", controllers.onGetDefault);
router.get("/getAll", controllers.onGetAll);
router.get("/updateComma", authKey, controllers.onUpdateComma);
router.get("/:id", controllers.onGetById);
router.get("/", controllers.onGetAll);

module.exports = router;
