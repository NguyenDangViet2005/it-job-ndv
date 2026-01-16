const { Post, User, Company, Attachment, Interaction } = require("../models");
const cloudinaryService = require("./cloudinary.service");
const { Op } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");
const { PostResponse } = require("../dtos/PostResponse.dto");

const getFormattedPost = async (post, currentUserId) => {
  // 1. Get total likes
  const totalLikes = await Interaction.count({
    where: { postId: post.id, isLiked: true },
  });

  // 2. Get total comments
  const totalComments = await Interaction.count({
    where: { postId: post.id, content: { [Op.ne]: null } },
  });

  // 3. Check if liked by current user
  let isLikedByCurrentUser = false;
  if (currentUserId) {
    const like = await Interaction.findOne({
      where: {
        postId: post.id,
        userId: currentUserId,
        isLiked: true,
      },
    });
    isLikedByCurrentUser = !!like;
  }

  // 4. Get top 3 recent comments
  const recentComments = await Interaction.findAll({
    where: { postId: post.id, content: { [Op.ne]: null } },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: Attachment,
        as: "Attachments",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 3,
  });

  const formattedComments = recentComments.map((c) => c.toJSON());

  return {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    user: post.User
      ? {
          id: post.User.id,
          fullName: post.User.fullName,
          avatar: post.User.avatar,
        }
      : null,
    company: post.Company
      ? {
          id: post.Company.id,
          name: post.Company.name,
          avatar: post.Company.avatar,
          address: post.Company.address,
        }
      : null,
    attachments: post.Attachments || [],
    interaction: {
      totalLikes,
      totalComments,
      isLikedByCurrentUser,
      comments: formattedComments,
    },
  };
};

const getAllPosts = async (page = 1, pageSize = 10, currentUserId = null) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: Company,
        as: "Company",
        attributes: ["id", "name", "avatar", "address"],
      },
      {
        model: Attachment,
        as: "Attachments",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
    distinct: true,
  });

  const posts = await Promise.all(
    rows.map(async (post) => {
      const p = await getFormattedPost(post, currentUserId);
      return new PostResponse(p);
    })
  );

  return {
    data: posts,
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const getPostById = async (id, currentUserId = null) => {
  const post = await Post.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: Company,
        as: "Company",
        attributes: ["id", "name", "avatar", "address"],
      },
      {
        model: Attachment,
        as: "Attachments",
      },
    ],
  });

  if (!post) return null;

  const formatted = await getFormattedPost(post, currentUserId);
  return new PostResponse(formatted);
};

const getPostsByUserId = async (
  userId,
  page = 1,
  pageSize = 10,
  currentUserId = null
) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    where: { userId },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: Company,
        as: "Company",
      },
      {
        model: Attachment,
        as: "Attachments",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
    distinct: true,
  });

  const posts = await Promise.all(
    rows.map(async (post) => {
      const p = await getFormattedPost(post, currentUserId);
      return new PostResponse(p);
    })
  );

  return {
    posts,
    totalItems: count,
    page,
    pageSize,
  };
};

const getPostsByCompanyId = async (
  companyId,
  page = 1,
  pageSize = 10,
  currentUserId = null
) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    where: { companyId },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "fullName", "avatar"],
      },
      {
        model: Company,
        as: "Company",
      },
      {
        model: Attachment,
        as: "Attachments",
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
    distinct: true,
  });

  const posts = await Promise.all(
    rows.map(async (post) => {
      const p = await getFormattedPost(post, currentUserId);
      return new PostResponse(p);
    })
  );

  return {
    posts,
    totalItems: count,
    page,
    pageSize,
  };
};

const createPost = async (data, files) => {
  const transaction = await sequelize.transaction();
  try {
    const post = await Post.create(
      {
        content: data.content,
        userId: data.userId || 0,
        companyId: data.companyId || null,
      },
      { transaction }
    );

    if (files && files.length > 0) {
      for (const file of files) {
        let fileUrl;
        let fileType;
        let publicId;

        if (file.mimetype.startsWith("video/")) {
          fileType = "video";
        } else {
          fileType = "image";
        }

        // Upload file
        const result = await cloudinaryService.uploadFile(file.path);
        fileUrl = result.secure_url;
        publicId = result.public_id;

        await Attachment.create(
          {
            postId: post.id,
            fileUrl,
            fileType,
            publicId,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    return await getPostById(post.id, data.userId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updatePost = async (id, data, files) => {
  const transaction = await sequelize.transaction();
  try {
    const post = await Post.findByPk(id);
    if (!post) throw new Error("Post not found");
    if (post.userId > 0) {
      if (parseInt(data.userId) !== post.userId) {
        throw new Error("User mismatch");
      }
    } else if (post.companyId) {
      if (parseInt(data.companyId) !== post.companyId) {
        throw new Error("Company mismatch");
      }
    }

    if (data.content !== undefined) {
      post.content = data.content;
    }
    if (files && files.length > 0) {
      const existingAttachments = await Attachment.findAll({
        where: { postId: id },
      });

      // Delete old attachments from Cloudinary
      for (const att of existingAttachments) {
        if (att.fileUrl) {
          await cloudinaryService.deleteFile(att.fileUrl);
        }
        await att.destroy({ transaction });
      }

      for (const file of files) {
        let fileUrl;
        let fileType;

        if (file.mimetype.startsWith("video/")) {
          fileType = "video";
        } else {
          fileType = "image";
        }

        // Upload file
        const result = await cloudinaryService.uploadFile(file.path);
        fileUrl = result.secure_url;

        await Attachment.create(
          {
            postId: id,
            fileUrl,
            fileType,
          },
          { transaction }
        );
      }
    }

    await post.save({ transaction });
    await transaction.commit();

    return await getPostById(id, data.userId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deletePost = async (id) => {
  try {
    const post = await Post.findByPk(id, {
      include: [{ model: Attachment, as: "Attachments" }],
    });

    if (!post) return false;

    // Delete all attachments from Cloudinary
    if (post.Attachments && post.Attachments.length > 0) {
      for (const att of post.Attachments) {
        if (att.fileUrl) {
          await cloudinaryService.deleteFile(att.fileUrl);
        }
      }
      await Attachment.destroy({ where: { postId: id } });
    }

    await Interaction.destroy({ where: { postId: id } });
    await post.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUserId,
  getPostsByCompanyId,
  createPost,
  updatePost,
  deletePost,
};
