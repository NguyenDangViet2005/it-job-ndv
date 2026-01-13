const { Follow, User, Company } = require("../models");

const toggleFollow = async (userId, companyId) => {
  try {
    const existing = await Follow.findOne({
      where: { userId, companyId },
    });

    if (existing) {
      await existing.destroy();
      return { followed: false };
    } else {
      await Follow.create({ userId, companyId });
      return { followed: true };
    }
  } catch (error) {
    throw error;
  }
};

const getFollowsByUser = async (userId, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Follow.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Company,
        as: "Company",
      },
    ],
    limit: pageSize,
    offset: offset,
  });

  return {
    follows: rows,
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const getFollowsByCompany = async (companyId, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Follow.findAndCountAll({
    where: { companyId },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullName", "avatar", "email"],
      },
    ],
    limit: pageSize,
    offset: offset,
  });

  return {
    follows: rows,
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

module.exports = {
  toggleFollow,
  getFollowsByUser,
  getFollowsByCompany,
};
