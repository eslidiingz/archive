const router = require("express").Router();
const controllers = require("../../controllers/inventory.controller");
const auth = require("../auth");
const { authKey } = require("../auth");

// router.get("/", controllers.onGetAll);
// router.get("/:id", controllers.onGetById);
// router.post("/", controllers.onInsert);
// router.put("/:id", controllers.onUpdate);
// router.delete("/:id", controllers.onDelete);
router.post("/buy", authKey, controllers.onInsertAsset);
router.get("/getWithOwner", auth.required, controllers.onGetWithOwner);

module.exports = router;
