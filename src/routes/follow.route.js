const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow.controller");

router.post("/", followController.toggleFollow);
router.get("/company/:companyId", followController.getFollowsByCompany);

module.exports = router;
