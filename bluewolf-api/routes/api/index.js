const router = require("express").Router();

router.use("/images", require("./image"));
router.use("/users", require("./user"));
router.use("/collections", require("./collection"));
router.use("/assets", require("./asset"));
router.use("/whitelists", require("./whitelist"));

module.exports = router;
