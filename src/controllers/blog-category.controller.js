const blogCategoryService = require("../services/blog-category.service");

const getAll = async (req, res, next) => {
  try {
    const result = await blogCategoryService.getAllCategories();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await blogCategoryService.getCategoryById(id);
    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
};
