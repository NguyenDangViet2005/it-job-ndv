const { BlogCategory } = require("../models");

const getAllCategories = async () => {
  try {
    const categories = await BlogCategory.findAll();
    return categories;
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await BlogCategory.findByPk(id);
    return category;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
};
