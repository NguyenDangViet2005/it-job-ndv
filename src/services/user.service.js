const {
  User,
  Application,
  Post,
  Attachment,
  Job,
  Company,
  SkillUser,
  Skill,
} = require("../models");
const cloudinaryService = require("./cloudinary.service");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const UserResponse = require("../dtos/UserResponse.dto");
const ApplicationResponse = require("../dtos/ApplicationResponse.dto");
const { PostResponse } = require("../dtos/PostResponse.dto");

const getAllUsers = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await User.findAndCountAll({
    limit: pageSize,
    offset: offset,
    attributes: { exclude: ["password"] },
  });

  return {
    users: rows.map((u) => new UserResponse(u)),
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    return user ? new UserResponse(user) : null;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (data.fullName) user.fullName = data.fullName;
    if (data.phone) user.phone = data.phone;
    if (data.about) user.about = data.about;

    await user.save();
    return await getUserById(user.id);
  } catch (error) {
    throw error;
  }
};

const updateAvatar = async (id, file) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    // Delete old avatar from Cloudinary if exists
    if (user.avatar) {
      await cloudinaryService.deleteFile(user.avatar);
    }

    const result = await cloudinaryService.uploadFile(file);
    user.avatar = result.secure_url;

    await user.save();

    // Return full user object without password
    return new UserResponse(user);
  } catch (error) {
    throw error;
  }
};

const updateCover = async (id, file) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    // Delete old cover image from Cloudinary if exists
    if (user.coverimage) {
      await cloudinaryService.deleteFile(user.coverimage);
    }

    const result = await cloudinaryService.uploadFile(file);
    user.coverimage = result.secure_url;

    await user.save();

    // Return full user object without password
    return new UserResponse(user);
  } catch (error) {
    throw error;
  }
};

const updateCV = async (id, file) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    // Delete old CV from Cloudinary if exists
    if (user.cvurl) {
      await cloudinaryService.deleteFile(user.cvurl);
    }

    // Upload CV from buffer
    const result = await cloudinaryService.uploadFile(file);
    user.cvurl = result.secure_url;

    await user.save();

    // Return full user object without password
    return new UserResponse(user);
  } catch (error) {
    console.error("Error updating CV:", error);
    throw error;
  }
};

const changePassword = async (id, currentPassword, newPassword) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return false;

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return false;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    return true;
  } catch (error) {
    throw error;
  }
};

const getUserApplications = async (userid, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Application.findAndCountAll({
    where: { userid },
    include: [{ model: Job, include: [Company] }],
    limit: pageSize,
    offset,
  });
  return {
    applications: rows.map((app) => new ApplicationResponse(app)),
    totalItems: count,
    page,
    pageSize,
  };
};

const getUserPosts = async (userid, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    where: { userid },
    limit: pageSize,
    offset,
  });
  return {
    posts: rows.map((post) => new PostResponse(post)),
    totalItems: count,
    page,
    pageSize,
  };
};

const getUserSkills = async (userid) => {
  try {
    const skillUsers = await SkillUser.findAll({
      where: { userid },
      include: [{ model: Skill }],
    });
    // Return only the skill objects, maybe flattened
    return skillUsers.map((su) => su.Skill);
  } catch (error) {
    throw error;
  }
};

const addUserSkill = async (userid, skillid) => {
  try {
    // Check if user exists
    const user = await User.findByPk(userid);
    if (!user) throw new Error("User not found");

    // Check if skill exists
    const skill = await Skill.findByPk(skillId);
    if (!skill) throw new Error("Skill not found");

    // Check if user already has skill
    const existing = await SkillUser.findOne({
      where: { userid, skillid },
    });

    if (existing) return existing;

    const newSkillUser = await SkillUser.create({
      userid,
      skillid,
    });
    return newSkillUser;
  } catch (error) {
    console.error("Error in addUserSkill:", error);
    throw error;
  }
};

const removeUserSkill = async (userid, skillid) => {
  try {
    const deleted = await SkillUser.destroy({
      where: { userid, skillid },
    });
    return deleted > 0;
  } catch (error) {
    console.error("Error in removeUserSkill:", error);
    throw error;
  }
};

const getUserMedia = async (userid, page = 1, pageSize = 6) => {
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const { count, rows } = await Attachment.findAndCountAll({
    include: [
      {
        model: Post,
        where: { userid: userid },
        attributes: [],
      },
    ],
    where: {
      filetype: {
        [Op.in]: ["image", "video"],
      },
    },
    order: [["id", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    totalItems: count,
    totalPages: Math.ceil(count / pageSize),
    currentPage: parseInt(page),
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  updateCover,
  updateCV,
  changePassword,
  getUserApplications,
  getUserPosts,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  getUserMedia,
};
