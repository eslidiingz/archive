const router = require("express").Router();
const auth = require("../auth");

router.use("/admin", require("./admin"));
router.use("/assets", require("./asset"));
router.use("/claim", require("./claim"));
router.use("/config", require("./config"));
router.use("/evo", require("./evo"));
router.use("/farms", require("./farm"));
router.use("/file", require("./file"));
router.use("/inventory", require("./inventory"));
router.use("/ipfs", require("./ipfs"));
router.use("/lands", require("./land"));
router.use("/landClass", require("./landClass"));
router.use("/landCode", require("./landCode"));
// router.use("/logs", require("./logs"));
router.use("/metadata", require("./metadata"));
router.use("/monsters", require("./monster"));
router.use("/pool", require("./pool"));
router.use("/ranking", require("./ranking"));
router.use("/sig", auth.required, require("./sig"));
router.use("/skill", require("./skill"));
router.use("/stakelog", require("./stakelog"));
router.use("/users", require("./user"));
router.use("/userLands", require("./userLand"));

router.use("/test", require("./_test"));

module.exports = router;
