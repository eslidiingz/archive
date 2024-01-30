const router = require("express").Router();
const controllers = require("../../controllers/landClass.controller");
const auth = require("../auth");
const validator = require("../../validators");

router.get("/", controllers.onGetAll);

module.exports = router;
