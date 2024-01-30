const router = require("express").Router();
const controllers = require("../../controllers/sig.controller");
const auth = require("../auth");
const validator = require("../../validators");

router.post("/monster", controllers.onSigMonster);
router.put("/updateMonster", controllers.onUpdateSigMonster);
router.post("/confirmMonster", controllers.onConfirmSigMonster);

router.post("/land", controllers.onSigLand);
router.put("/updateLand", controllers.onUpdateSigLand);
router.post("/confirmLand", controllers.onConfirmSigLand);

router.post("/item", controllers.onSigItem);
router.put("/updateItem", controllers.onUpdateSigItem);
router.post("/confirmItem", controllers.onConfirmSigItem);

router.post("/tokenStack", controllers.onSigToken);
router.put("/updateTokenStack", controllers.onUpdateSigToken);
router.post("/confirmTokenStack", controllers.onConfirmSigTokenStack);

module.exports = router;
