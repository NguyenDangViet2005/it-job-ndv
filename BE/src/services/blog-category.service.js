const { BlogCategory } = require("../models");
const BlogCategoryResponse = require("../dtos/BlogCategoryResponse.dto");

const getAllCategories = async () => {
  try {
    const categories = await BlogCategory.findAll();
    return categories.map((c) => new BlogCategoryResponse(c));
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await BlogCategory.findByPk(id);
    return category ? new BlogCategoryResponse(category) : null;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
};
