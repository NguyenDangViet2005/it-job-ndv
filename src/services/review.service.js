const { Review, User, Company } = require("../models");
const ReviewResponse = require("../dtos/ReviewResponse.dto");

const getReviewById = async (id) => {
  try {
    const review = await Review.findByPk(id, {
      include: [
        { model: User, as: "User", attributes: ["id", "fullname", "avatar"] },
        { model: Company, as: "Company", attributes: ["id", "name", "avatar"] },
      ],
    });
    return review ? new ReviewResponse(review) : null;
  } catch (error) {
    throw error;
  }
};

const getReviewsByCompanyId = async (companyid, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Review.findAndCountAll({
    where: { companyid },
    include: [
      { model: User, as: "User", attributes: ["id", "fullname", "avatar"] },
    ],
    order: [["createdat", "DESC"]],
    limit: pageSize,
    offset: offset,
  });

  return {
    reviews: rows.map((r) => new ReviewResponse(r)),
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const getReviewsByUserId = async (userid, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Review.findAndCountAll({
    where: { userid },
    include: [
      { model: Company, as: "Company", attributes: ["id", "name", "avatar"] },
    ],
    order: [["createdat", "DESC"]],
    limit: pageSize,
    offset: offset,
  });

  return {
    reviews: rows.map((r) => new ReviewResponse(r)),
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const createReview = async (userid, data) => {
  try {
    const review = await Review.create({
      userid,
      companyid: data.companyid,
      rating: data.rating,
      comment: data.comment,
    });
    return await getReviewById(review.id); // Already returns DTO
  } catch (error) {
    throw error;
  }
};

const updateReview = async (id, userid, data) => {
  try {
    const review = await Review.findByPk(id);
    if (!review) return null;

    if (review.userid !== userid) {
      throw new Error("Unauthorized");
    }

    if (data.rating) review.rating = data.rating;
    if (data.comment) review.comment = data.comment;

    await review.save();
    return await getReviewById(review.id);
  } catch (error) {
    throw error;
  }
};

const deleteReview = async (id, userid) => {
  try {
    const review = await Review.findByPk(id);
    if (!review) return false;
    if (review.userid !== userid) {
      if (userid !== -1) {
        throw new Error("Unauthorized");
      }
    }

    await review.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getReviewById,
  getReviewsByCompanyId,
  getReviewsByUserId,
  createReview,
  updateReview,
  deleteReview,
};
