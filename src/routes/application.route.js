const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, applicationController.getAll);

router.post("/", verifyToken, applicationController.create);

router.get("/user/:userId", verifyToken, applicationController.getByUserId);

router.get(
  "/company/:companyId",
  verifyToken,
  applicationController.getByCompanyId
);

router.put("/:jobId/:userId", verifyToken, applicationController.update);

router.delete("/:jobId/:userId", verifyToken, applicationController.deleteApp);

module.exports = router;
