const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const upload = require("../middlewares/upload.middleware");

router.get("/", blogController.getAll);
router.get("/:id", blogController.getById);
router.get("/user/:userId", blogController.getByUserId);

router.post("/", upload.single("image"), blogController.create);
router.put("/:id", upload.single("image"), blogController.update);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
