const router = require("express").Router();
const controllers = require("../../controllers/user.controller");

router.get("/", controllers.onGetAll);
router.get("/:token", controllers.onGetFevByToken)
router.get("/username/:username", controllers.onGetByUsername)
router.post("/", controllers.onInsert);
router.put("/:id", controllers.onUpdate);
router.put("/favorites/:id", controllers.onUpdateFav);
router.delete("/:id", controllers.onDelete);

module.exports = router;