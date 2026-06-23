const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");
const { searchLimiter } = require("../middlewares/rate-limit.middleware");

// Áp dụng rate limiter cho search endpoint
router.get("/", searchLimiter, searchController.search);

module.exports = router;
