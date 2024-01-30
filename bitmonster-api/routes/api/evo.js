const router = require("express").Router();
const controllers = require("../../controllers/evo.controller");
const auth = require("../auth");
const validator = require("../../validators");

router.get("/", controllers.onGetAll);

module.exports = router;
