const { Blog, User, BlogCategory } = require("../models");
const cloudinaryService = require("./cloudinary.service");

const getAllBlogs = async (page = 1, pageSize = 10, categoryId = null) => {
  const offset = (page - 1) * pageSize;
  const where = {};
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const { count, rows } = await Blog.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: BlogCategory,
        as: "Category",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
  });

  return {
    blogs: rows,
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const getBlogById = async (id) => {
  try {
    const blog = await Blog.findByPk(id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "fullName", "avatar"],
        },
        {
          model: BlogCategory,
          as: "Category",
        },
      ],
    });
    return blog;
  } catch (error) {
    throw error;
  }
};

const getBlogsByUserId = async (userId, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Blog.findAndCountAll({
    where: { userId },
    include: [
      {
        model: BlogCategory,
        as: "Category",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
  });

  return {
    blogs: rows,
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const createBlog = async (data, file) => {
  try {
    let imageUrl = "";
    if (file) {
      const result = await cloudinaryService.uploadImage(file.path);
      imageUrl = result.secure_url;
    }

    const blog = await Blog.create({
      userId: data.userId,
      categoryId: data.categoryId,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      image: imageUrl,
    });

    return await getBlogById(blog.id);
  } catch (error) {
    throw error;
  }
};

const updateBlog = async (id, data, file) => {
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) return null;

    if (data.title) blog.title = data.title;
    if (data.excerpt) blog.excerpt = data.excerpt;
    if (data.content) blog.content = data.content;
    if (data.categoryId) blog.categoryId = data.categoryId;

    if (file) {
      // Update image
      const result = await cloudinaryService.uploadImage(file.path);
      blog.image = result.secure_url;
    }

    await blog.save();
    return await getBlogById(blog.id);
  } catch (error) {
    throw error;
  }
};

const deleteBlog = async (id) => {
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) return false;

    if (blog.image) {
      const publicId = cloudinaryService.getPublicIdFromUrl(blog.image);
      if (publicId) await cloudinaryService.deleteImage(publicId);
    }

    await blog.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  getBlogsByUserId,
  createBlog,
  updateBlog,
  deleteBlog,
};
