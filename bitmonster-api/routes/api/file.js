const router = require("express").Router();
const controllers = require("../../controllers/file.controller");

router.get("/:id", controllers.onFileById);

module.exports = router;
