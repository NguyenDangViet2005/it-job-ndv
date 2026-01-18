const { Post, User, Company, Attachment, Interaction } = require("../models");
const cloudinaryService = require("./cloudinary.service");
const { Op } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");
const { PostResponse } = require("../dtos/PostResponse.dto");

// Helper: Batched fetching of interaction stats to avoid N+1 queries
const enrichPosts = async (posts, currentUserId) => {
  if (!posts || posts.length === 0) return [];
  
  const postIds = posts.map(p => p.id);
  const postsMap = {};
  posts.forEach(p => postsMap[p.id] = p);

  // 1. Bulk count likes
  // Index usage: IX_Interaction_PostId_UserId_IsLiked (postId, userId, isLiked) includes postId, isLiked
  const likesCounts = await Interaction.findAll({
    attributes: ['postId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    where: { postId: { [Op.in]: postIds }, isLiked: true },
    group: ['postId'],
    raw: true
  });
  const likesMap = {};
  likesCounts.forEach(c => likesMap[c.postId] = c.count);

  // 2. Bulk count comments
  // Index usage: IX_Interaction_PostId (postId)
  const commentsCounts = await Interaction.findAll({
    attributes: ['postId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    where: { postId: { [Op.in]: postIds }, content: { [Op.ne]: null } },
    group: ['postId'],
    raw: true
  });
  const commentsMap = {};
  commentsCounts.forEach(c => commentsMap[c.postId] = c.count);

  // 3. User like status
  const userLikesMap = {};
  if (currentUserId) {
    // Index usage: IX_Interaction_PostId_UserId_IsLiked (postId, userId, isLiked) - Perfect covering
    const userLikes = await Interaction.findAll({
      attributes: ['postId'],
      where: {
        postId: { [Op.in]: postIds },
        userId: currentUserId,
        isLiked: true
      },
      raw: true
    });
    userLikes.forEach(ul => userLikesMap[ul.postId] = true);
  }

  // 4. Recent comments (Top 3 per post) via parallel queries
  // Index usage: IX_Interaction_PostId + CreatedAt for sort
  const commentsPromises = posts.map(post => 
    Interaction.findAll({
      where: { postId: post.id, content: { [Op.ne]: null } },
      include: [
        { model: User, as: "User", attributes: ["id", "fullName", "avatar"] },
        { model: Attachment, as: "Attachments" },
      ],
      order: [["createdAt", "DESC"]],
      limit: 3,
    })
  );
  
  const commentsResults = await Promise.all(commentsPromises);
  const recentCommentsMap = {};
  posts.forEach((p, index) => {
    recentCommentsMap[p.id] = commentsResults[index].map(c => c.toJSON());
  });

  return posts.map(post => {
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
        totalLikes: likesMap[post.id] || 0,
        totalComments: commentsMap[post.id] || 0,
        isLikedByCurrentUser: !!userLikesMap[post.id],
        comments: recentCommentsMap[post.id] || [],
      },
    };
  });
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
    // Index usage: IX_Post_CreatedAt
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
    distinct: true,
  });

  const formattedPosts = await enrichPosts(rows, currentUserId);
  const data = formattedPosts.map(p => new PostResponse(p));

  return {
    data,
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

  const [formatted] = await enrichPosts([post], currentUserId);
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
    // Index usage: IX_Post_UserId_CreatedAt
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
    distinct: true,
  });

  const formattedPosts = await enrichPosts(rows, currentUserId);
  const data = formattedPosts.map(p => new PostResponse(p));

  return {
    data,
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
    // Index usage: IX_Post_CompanyId
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset: offset,
    distinct: true,
  });

  const formattedPosts = await enrichPosts(rows, currentUserId);
  const data = formattedPosts.map(p => new PostResponse(p));

  return {
    data,
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

        if (file.mimetype.startsWith("video/")) {
          fileType = "video";
        } else {
          fileType = "image";
        }

        // Upload file buffer to cloudinary
        const result = await cloudinaryService.uploadFile(file);
        fileUrl = result.secure_url;

        await Attachment.create(
          {
            postId: post.id,
            fileUrl,
            fileType,
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

const updatePost = async (id, data, files, keepImageUrls = []) => {
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

    // Handle attachments update
    const existingAttachments = await Attachment.findAll({
      where: { postId: id },
    });

    // Delete attachments that are NOT in keepImageUrls
    for (const att of existingAttachments) {
      const shouldKeep = keepImageUrls.includes(att.fileUrl);
      
      if (!shouldKeep) {
        if (att.fileUrl) {
          await cloudinaryService.deleteFile(att.fileUrl);
        }
        await att.destroy({ transaction });
      }
    }

    // Add new files
    if (files && files.length > 0) {
      for (const file of files) {
        let fileUrl;
        let fileType;

        if (file.mimetype.startsWith("video/")) {
          fileType = "video";
        } else {
          fileType = "image";
        }

        // Upload file buffer to cloudinary
        const result = await cloudinaryService.uploadFile(file);
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
