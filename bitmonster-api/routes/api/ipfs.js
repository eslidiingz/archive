const router = require("express").Router();
const controllers = require("../../controllers/file.controller");

router.get("/", controllers.onIPFSCreate);

module.exports = router;
