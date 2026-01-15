const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const upload = require("../middlewares/upload.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");

// Routes
router.get("/", verifyToken, userController.getAll); // Admin?
router.get("/:id", userController.getById);

router.put("/:id", verifyToken, userController.updateProfile);
router.put(
  "/:id/avatar",
  verifyToken,
  upload.single("avatar"),
  userController.updateAvatar
);
router.put(
  "/:id/cover-image",
  verifyToken,
  upload.single("coverImage"),
  userController.updateCover
);
router.put(
  "/:id/cv",
  verifyToken,
  upload.single("cv"),
  userController.updateCV
);

router.post("/:id/change-password", verifyToken, userController.changePassword);

router.get("/:id/applications", userController.getUserApplications);
router.get("/:id/posts", userController.getUserPosts);
router.get("/:id/skills", userController.getUserSkills);
router.post("/:id/skills", verifyToken, userController.addUserSkill);
router.delete(
  "/:id/skills/:skillId",
  verifyToken,
  userController.removeUserSkill
);

module.exports = router;
