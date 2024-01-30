const router = require("express").Router();
const controllers = require("../../controllers/monster.controller");

router.get("/getDefault", controllers.onGetDefault);
router.get("/getAll", controllers.onGetAllMonster);
router.get("/", controllers.onGetAll);
router.get("/:id", controllers.onGetById);

module.exports = router;
