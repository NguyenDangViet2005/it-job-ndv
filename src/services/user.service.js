const {
  User,
  Application,
  Post,
  Attachment,
  Job,
  Company,
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

    const result = await cloudinaryService.uploadImage(file.path);
    user.avatar = result.secure_url;

    await user.save();
    return user.avatar;
  } catch (error) {
    throw error;
  }
};

const updateCover = async (id, file) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    const result = await cloudinaryService.uploadImage(file.path);
    user.coverImage = result.secure_url;

    await user.save();
    return user.coverImage;
  } catch (error) {
    throw error;
  }
};

const updateCV = async (id, file) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    const result = await cloudinaryService.uploadImage(file.path);
    user.cv = result.secure_url;

    await user.save();
    return user.cv;
  } catch (error) {
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

const getUserApplications = async (userId, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Application.findAndCountAll({
    where: { userId },
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

const getUserPosts = async (userId, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    where: { userId },
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
};
