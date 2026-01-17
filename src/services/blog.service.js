const { Blog, User, BlogCategory } = require("../models");
const cloudinaryService = require("./cloudinary.service");
const BlogResponse = require("../dtos/BlogResponse.dto");

const getAllBlogs = async (page = 1, pageSize = 10, categoryId = null) => {
  const offset = (page - 1) * pageSize;
  const where = {};
  if (categoryId) {
    where.categoryId = categoryId;
  }

  try {
    const { count, rows } = await Blog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "avatar"],
        },
        {
          model: BlogCategory,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: offset,
    });

    return {
      data: rows.map((blog) => new BlogResponse(blog)),
      totalItems: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

const getBlogById = async (id) => {
  try {
    const blog = await Blog.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "avatar"],
        },
        {
          model: BlogCategory,
        },
      ],
    });
    return blog ? new BlogResponse(blog) : null;
  } catch (error) {
    throw error;
  }
};

const getBlogsByUserId = async (userId, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);
  const { count, rows } = await Blog.findAndCountAll({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: BlogCategory,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: limit,
    offset: offset,
  });

  return {
    data: rows.map((blog) => new BlogResponse(blog)),
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
      const result = await cloudinaryService.uploadFile(file);
      imageUrl = result.secure_url;
    }

    const blog = await Blog.create({
      userId: data.userId,
      categoryId: data.categoryId,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      readTime: data.readTime,
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
    if (data.readTime) blog.readTime = data.readTime;

    if (file) {
      // Delete old image from Cloudinary if exists
      if (blog.image) {
        await cloudinaryService.deleteFile(blog.image);
      }

      // Update image
      const result = await cloudinaryService.uploadFile(file);
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
      await cloudinaryService.deleteFile(blog.image);
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
