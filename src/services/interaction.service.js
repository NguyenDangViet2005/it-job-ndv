const { Interaction, User, Attachment, sequelize } = require("../models");
const cloudinaryService = require("./cloudinary.service");
const { Op } = require("sequelize");

const getCommentsByPostId = async (postId, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;
    const totalComments = await Interaction.count({
      where: {
        postId,
        content: { [Op.ne]: null },
      },
    });

    const comments = await Interaction.findAll({
      where: {
        postId,
        content: { [Op.ne]: null },
      },
      include: [
        {
          model: User,
          as: "User", // Ensure alias matches model association
          attributes: ["id", "fullName", "avatar"],
        },
        {
          model: Attachment,
          as: "Attachments", // Ensure alias matches
        },
      ],
      order: [["createdAt", "DESC"]], // Recent first
      limit: pageSize,
      offset: offset,
    });

    return {
      comments,
      totalComments,
      page,
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const toggleLike = async (postId, userId) => {
  try {
    const existingLike = await Interaction.findOne({
      where: {
        postId,
        userId,
        isLiked: true,
      },
    });

    let isLiked = false;

    if (existingLike) {
      await existingLike.destroy();
      isLiked = false;
    } else {
      await Interaction.create({
        postId,
        userId,
        isLiked: true,
        content: null,
      });
      isLiked = true;
    }

    const totalLikes = await Interaction.count({
      where: {
        postId,
        isLiked: true,
      },
    });

    return {
      postId,
      userId,
      isLiked,
      totalLikes,
    };
  } catch (error) {
    throw error;
  }
};

const addComment = async (postId, userId, content, files = []) => {
  const transaction = await sequelize.transaction();
  try {
    const interaction = await Interaction.create(
      {
        postId,
        userId,
        content,
        isLiked: false,
      },
      { transaction }
    );

    if (files && files.length > 0) {
      for (const file of files) {
        let fileUrl;
        let fileType;
        if (file.mimetype.startsWith("video/")) {
          // Upload video logic
          const result = await cloudinaryService.uploadVideo(file.path);
          fileUrl = result.secure_url;
          fileType = "video";
        } else {
          // Image
          const result = await cloudinaryService.uploadImage(file.path);
          fileUrl = result.secure_url;
          fileType = "image";
        }

        await Attachment.create(
          {
            interactionId: interaction.id,
            fileUrl,
            fileType,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    const createdComment = await Interaction.findByPk(interaction.id, {
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
    });

    return createdComment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteComment = async (commentId, userId) => {
  try {
    const comment = await Interaction.findByPk(commentId, {
      include: [{ model: Attachment, as: "Attachments" }],
    });

    if (!comment) return false;
    if (comment.userId !== userId) {
      return false;
    }

    if (comment.Attachments && comment.Attachments.length > 0) {
      for (const attachment of comment.Attachments) {
        const publicId = cloudinaryService.getPublicIdFromUrl(
          attachment.fileUrl
        );
        if (publicId) {
          if (attachment.fileType === "video") {
            await cloudinaryService.deleteVideo(publicId);
          } else {
            await cloudinaryService.deleteImage(publicId);
          }
        }
      }
      await Attachment.destroy({ where: { interactionId: commentId } });
    }

    await comment.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCommentsByPostId,
  toggleLike,
  addComment,
  deleteComment,
};
