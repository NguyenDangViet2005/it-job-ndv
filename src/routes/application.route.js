const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, applicationController.getAll);

router.post("/", verifyToken, applicationController.create);

router.get("/user/:userid", verifyToken, applicationController.getByUserId);

router.get(
  "/company/:companyid",
  verifyToken,
  applicationController.getByCompanyId,
);

router.put("/:jobId/:userid", verifyToken, applicationController.update);

router.delete("/:jobId/:userid", verifyToken, applicationController.deleteApp);

module.exports = router;
