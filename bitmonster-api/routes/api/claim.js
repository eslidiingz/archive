const router = require("express").Router();
const controllers = require("../../controllers/claim.controller");
const auth = require("../auth");
const { authKey } = require("../auth");

router.get("/", authKey, controllers.onGetAll);
router.get("/latest", auth.required, controllers.onGetLatest);

module.exports = router;
