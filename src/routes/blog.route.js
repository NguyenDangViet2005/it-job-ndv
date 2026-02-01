const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const upload = require("../middlewares/upload.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", blogController.getAll);
router.get("/:id", blogController.getById);
router.get("/user/:userid", blogController.getByUserId);

router.post("/", verifyToken, upload.single("image"), blogController.create);
router.put("/:id", verifyToken, upload.single("image"), blogController.update);
router.delete("/:id", verifyToken, blogController.deleteBlog);

module.exports = router;
