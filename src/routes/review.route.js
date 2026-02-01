const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

router.get("/:id", reviewController.getById);
router.get("/company/:companyid", reviewController.getByCompanyId);
router.get("/user/:userid", reviewController.getByUserId);

router.post("/", reviewController.create);
router.post("/test", reviewController.createTest);

router.put("/:id", reviewController.update);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
