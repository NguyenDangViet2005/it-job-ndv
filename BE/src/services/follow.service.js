const { Follow, User, Company } = require("../models");
const FollowResponse = require("../dtos/FollowResponse.dto");

const toggleFollow = async (userid, companyid) => {
  try {
    const existing = await Follow.findOne({
      where: { userid, companyid },
    });

    if (existing) {
      await existing.destroy();
      return { followed: false };
    } else {
      await Follow.create({ userid, companyid });
      return { followed: true };
    }
  } catch (error) {
    throw error;
  }
};

const getFollowsByCompany = async (companyid, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Follow.findAndCountAll({
    where: { companyid },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullname", "avatar", "email"],
      },
    ],
    limit: pageSize,
    offset: offset,
  });

  return {
    follows: rows.map((f) => new FollowResponse(f)),
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

module.exports = {
  toggleFollow,
  getFollowsByCompany,
};
