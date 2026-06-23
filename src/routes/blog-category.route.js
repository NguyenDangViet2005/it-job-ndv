const express = require("express");
const router = express.Router();
const blogCategoryController = require("../controllers/blog-category.controller");

router.get("/", blogCategoryController.getAll);
router.get("/:id", blogCategoryController.getById);

module.exports = router;
