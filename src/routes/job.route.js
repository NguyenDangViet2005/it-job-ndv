const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", jobController.getAll);
router.get("/today", jobController.getJobsToday);
router.get("/by-skill", jobController.getJobsBySkill);
router.get("/by-company", jobController.getJobsByCompanyId);
router.get("/:id", jobController.getById);

router.post("/", verifyToken, jobController.create);

router.put("/:id", verifyToken, jobController.update);

router.delete("/:id", verifyToken, jobController.deleteJob);

router.get("/by-user/:userId", verifyToken, jobController.getJobsByUserId);

module.exports = router;
