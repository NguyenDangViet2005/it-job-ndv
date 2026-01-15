const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const getCurrentUserId = (req) => {
  if (req.user) return req.user.id;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, env.jwt.accessSecret);
      return decoded.id;
    } catch (e) {}
  }
  return null;
};

const getAll = async (req, res, next) => {
  try {
    // Permission check: Admin only (TODO)
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await userService.getAllUsers(page, pageSize);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userService.getUserById(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = getCurrentUserId(req);

    // Check permission
    if (userId !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await userService.updateUser(id, req.body);
    if (!result) return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.file)
      return res.status(400).json({ message: "Avatar file is required" });

    const result = await userService.updateAvatar(id, req.file);
    if (!result) return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "Avatar updated successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const updateCover = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.file)
      return res.status(400).json({ message: "Cover file is required" });

    const result = await userService.updateCover(id, req.file);
    if (!result) return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "Cover image updated successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const updateCV = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.file)
      return res.status(400).json({ message: "CV file is required" });

    const result = await userService.updateCV(id, req.file);
    if (!result) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "CV updated successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { currentPassword, newPassword } = req.body;
    // Call service
    const result = await userService.changePassword(
      id,
      currentPassword,
      newPassword
    );
    if (!result) return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ message: "Password changed successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const getUserApplications = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userService.getUserApplications(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userService.getUserPosts(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserSkills = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userService.getUserSkills(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addUserSkill = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id); // userId
    const { skillId } = req.body;

    // Check permission: Only current user can add skills to themselves
    const currentUserId = getCurrentUserId(req);
    if (currentUserId !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!skillId) {
      return res.status(400).json({ message: "Skill ID is required" });
    }

    const result = await userService.addUserSkill(id, skillId);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Skill not found or error adding skill" });
    }

    res.status(200).json({ message: "Skill added successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const removeUserSkill = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id); // userId
    const skillId = parseInt(req.params.skillId);

    // Check permission
    const currentUserId = getCurrentUserId(req);
    if (currentUserId !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await userService.removeUserSkill(id, skillId);
    if (!result) {
      return res.status(404).json({ message: "Skill not found on user" });
    }

    res.status(200).json({ message: "Skill removed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  updateProfile,
  updateAvatar,
  updateCover,
  updateCV,
  changePassword,
  getUserApplications,
  getUserPosts,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
};
