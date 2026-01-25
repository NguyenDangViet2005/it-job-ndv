const { Interaction, User, Attachment, CompanyMember, Company } = require("../models");
const { sequelize } = require("../configs/sequelize.config");
const cloudinaryService = require("./cloudinary.service");
const { Op } = require("sequelize");

// Helper function to format comment response
const formatCommentResponse = (interaction) => {
  const comment = interaction.toJSON ? interaction.toJSON() : interaction;
  // Remove isLiked field from comment response
  const { isLiked, postId, User, ...commentData } = comment;

  if (User) {
    commentData.user = User;
  }

  return commentData;
};

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
          as: "User",
          attributes: ["id", "fullName", "avatar"],
          include: [
            {
              model: CompanyMember,
              attributes: ["companyId", "status"],
              where: { status: "active" },
              required: false,
              include: [
                {
                  model: Company,
                  attributes: ["id", "name", "avatar"],
                },
              ],
            },
          ],
        },
        {
          model: Attachment,
          as: "Attachments",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: offset,
    });

    return {
      data: comments.map((c) => formatCommentResponse(c)),
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
      { transaction },
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
            interactionId: interaction.id,
            fileUrl,
            fileType,
          },
          { transaction },
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
          include: [
            {
              model: CompanyMember,
              attributes: ["companyId", "status"],
              where: { status: "active" },
              required: false,
              include: [
                {
                  model: Company,
                  attributes: ["id", "name", "avatar"],
                },
              ],
            },
          ],
        },
        {
          model: Attachment,
          as: "Attachments",
        },
      ],
    });

    return formatCommentResponse(createdComment);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateComment = async (
  commentId,
  userId,
  content,
  files = [],
  keepImageUrls = [],
) => {
  const transaction = await sequelize.transaction();
  try {
    const comment = await Interaction.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== parseInt(userId)) throw new Error("Unauthorized");

    if (content !== undefined) {
      comment.content = content;
    }

    // Get existing attachments
    const existingAttachments = await Attachment.findAll({
      where: { interactionId: commentId },
    });

    // Determine which attachments to delete (not in keepImageUrls)
    const attachmentsToDelete = existingAttachments.filter(
      (att) => !keepImageUrls.includes(att.fileUrl),
    );

    // Delete old attachments from Cloudinary and DB
    for (const att of attachmentsToDelete) {
      if (att.fileUrl) {
        await cloudinaryService.deleteFile(att.fileUrl);
      }
      await att.destroy({ transaction });
    }

    // Upload new files
    if (files && files.length > 0) {
      for (const file of files) {
        let fileUrl;
        let fileType;

        if (file.mimetype.startsWith("video/")) {
          fileType = "video";
        } else {
          fileType = "image";
        }

        const result = await cloudinaryService.uploadFile(file);
        fileUrl = result.secure_url;

        await Attachment.create(
          {
            interactionId: commentId,
            fileUrl,
            fileType,
          },
          { transaction },
        );
      }
    }

    await comment.save({ transaction });
    await transaction.commit();

    const updatedComment = await Interaction.findByPk(commentId, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "fullName", "avatar"],
          include: [
            {
              model: CompanyMember,
              attributes: ["companyId", "status"],
              where: { status: "active" },
              required: false,
              include: [
                {
                  model: Company,
                  attributes: ["id", "name", "avatar"],
                },
              ],
            },
          ],
        },
        {
          model: Attachment,
          as: "Attachments",
        },
      ],
    });

    return formatCommentResponse(updatedComment);
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

    // Delete all attachments from Cloudinary
    if (comment.Attachments && comment.Attachments.length > 0) {
      for (const attachment of comment.Attachments) {
        if (attachment.fileUrl) {
          await cloudinaryService.deleteFile(attachment.fileUrl);
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
  updateComment,
};
