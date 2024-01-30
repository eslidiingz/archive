const router = require("express").Router();
const controllers = require("../../controllers/stake.controller");
const auth = require("../auth");
const { authKey } = require("../auth");

router.get("/", auth.required, controllers.onGetAll);
router.get("/:id", authKey, controllers.onGetById);
router.post("/", authKey, controllers.onStake);
// router.post("/unstake", controllers.onUnstake);

module.exports = router;
