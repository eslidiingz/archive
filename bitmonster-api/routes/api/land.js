const router = require("express").Router();
const controllers = require("../../controllers/land.controller");

router.get("/", controllers.onGetAll);
router.get("/:id", controllers.onGetById);

module.exports = router;
