const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");

router.get("/", postController.getAll);

router.get("/:id", postController.getById);

router.get("/user/:userId", postController.getByUserId);

router.get("/company/:companyId", postController.getByCompanyId);

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  (req, res, next) => {
    const files = [];
    if (req.files) {
      if (req.files.images) files.push(...req.files.images);
      if (req.files.video) files.push(...req.files.video);
    }
    req.files = files;
    next();
  },
  postController.create
);

router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  (req, res, next) => {
    const files = [];
    if (req.files) {
      if (req.files.images) files.push(...req.files.images);
      if (req.files.video) files.push(...req.files.video);
    }
    req.files = files;
    next();
  },
  postController.update
);

router.delete("/:id", postController.deletePost);

router.get("/:id/comments", postController.getComments);

router.post("/:id/like", postController.toggleLike);

router.post(
  "/:id/comment",
  upload.array("attachments", 10),
  postController.addComment
);

router.put(
  "/:id/comment/:commentId",
  upload.array("attachments", 10),
  postController.updateComment
);

router.delete("/:id/comment/:commentId", postController.deleteComment);

module.exports = router;
