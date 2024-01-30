const router = require("express").Router();
const controllers = require("../../controllers/config.controller");

router.get("/", controllers.onGetConfig);
router.post("/", controllers.onInsert);

module.exports = router;
