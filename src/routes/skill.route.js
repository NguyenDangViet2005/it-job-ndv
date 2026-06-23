const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");

router.get("/", skillController.getAll);
router.post("/", skillController.create);
router.put("/:id", skillController.update);
router.delete("/:id", skillController.deleteSkill);

module.exports = router;
