const router = require("express").Router();
const controllers = require("../../controllers/whitelist.controller");
const upload = require("../../utils/image");

router.get("/", controllers.onGetAll);
router.get("/:id", controllers.onGetById);
router.get("/username/:username", controllers.onGetByUsername)
router.post("/", upload.single("image"), controllers.onInsert);
router.post("/:address", controllers.onRegister);
router.put("/:id", controllers.onUpdate);
router.delete("/:id", controllers.onDelete);

module.exports = router;