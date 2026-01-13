const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/", companyController.getCompanies);
router.get("/logos", companyController.getCompanyLogos);

router.get("/my-company", verifyToken, companyController.getMyCompany);
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("file"),
  companyController.uploadAvatar
);
router.post(
  "/upload-cover",
  verifyToken,
  upload.single("file"),
  companyController.uploadCover
);

router.post("/", verifyToken, companyController.createCompany);
router.put("/:id", verifyToken, companyController.updateCompany);
router.delete("/:id", verifyToken, companyController.deleteCompany);

router.get("/:id", companyController.getCompanyById);

module.exports = router;
