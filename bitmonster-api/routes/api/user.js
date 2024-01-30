const router = require("express").Router();
const controllers = require("../../controllers/user.controller");
const auth = require("../auth");
const { authKey } = require("../auth");
const validator = require("../../validators");

router.get("/", controllers.onGetAll);
router.get("/account", auth.required, controllers.onGetAccount);
router.put(
  "/update/name",
  [auth.required, validator.user.updateName, validator.check],
  controllers.onUpdateName
);
router.post(
  "/login",
  [validator.user.register, validator.check],
  controllers.onLogin
);
router.post("/refresh-token", controllers.onRefreshToken);
router.get("/server-time", controllers.onServerTime);
router.put("/updateEnergy", auth.required, controllers.onUpdateEnergy);
router.get(
  "/getTokenByAccount",
  auth.required,
  controllers.onGetTokenByAccount
);

module.exports = router;
