const {
  Interaction,
  User,
  Attachment,
  CompanyMember,
  Company,
} = require("../models");
const { sequelize } = require("../configs/sequelize.config");
const cloudinaryService = require("./cloudinary.service");
const { Op } = require("sequelize");

// Helper function to format comment response
const formatCommentResponse = (interaction) => {
  const comment = interaction.toJSON ? interaction.toJSON() : interaction;
  // Remove isliked field from comment response
  const { isliked, postid, User, ...commentData } = comment;

  if (User) {
    commentData.user = User;
  }

  return commentData;
};

const getCommentsByPostId = async (postid, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;
    const totalComments = await Interaction.count({
      where: {
        postid,
        content: { [Op.ne]: null },
      },
    });

    const comments = await Interaction.findAll({
      where: {
        postid,
        content: { [Op.ne]: null },
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "fullname", "avatar"],
          include: [
            {
              model: CompanyMember,
              attributes: ["companyid", "status"],
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
      order: [["createdat", "DESC"]],
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

const toggleLike = async (postid, userid) => {
  try {
    const existingLike = await Interaction.findOne({
      where: {
        postid,
        userid,
        isliked: true,
      },
    });

    let isliked = false;

    if (existingLike) {
      await existingLike.destroy();
      isliked = false;
    } else {
      await Interaction.create({
        postid,
        userid,
        isliked: true,
        content: null,
      });
      isliked = true;
    }

    const totalLikes = await Interaction.count({
      where: {
        postid,
        isliked: true,
      },
    });

    return {
      postid,
      userid,
      isliked,
      totalLikes,
    };
  } catch (error) {
    throw error;
  }
};

const addComment = async (postid, userid, content, files = []) => {
  const transaction = await sequelize.transaction();
  try {
    const interaction = await Interaction.create(
      {
        postid,
        userid,
        content,
        isliked: false,
      },
      { transaction },
    );

    if (files && files.length > 0) {
      for (const file of files) {
        let fileurl;
        let filetype;

        if (file.mimetype.startsWith("video/")) {
          filetype = "video";
        } else {
          filetype = "image";
        }

        // Upload file buffer to cloudinary
        const result = await cloudinaryService.uploadFile(file);
        fileurl = result.secure_url;

        await Attachment.create(
          {
            interactionid: interaction.id,
            fileurl,
            filetype,
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
          attributes: ["id", "fullname", "avatar"],
          include: [
            {
              model: CompanyMember,
              attributes: ["companyid", "status"],
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
  userid,
  content,
  files = [],
  keepImageUrls = [],
) => {
  const transaction = await sequelize.transaction();
  try {
    const comment = await Interaction.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userid !== parseInt(userid)) throw new Error("Unauthorized");

    if (content !== undefined) {
      comment.content = content;
    }

    // Get existing attachments
    const existingAttachments = await Attachment.findAll({
      where: { interactionid: commentId },
    });

    // Determine which attachments to delete (not in keepImageUrls)
    const attachmentsToDelete = existingAttachments.filter(
      (att) => !keepImageUrls.includes(att.fileurl),
    );

    // Delete old attachments from Cloudinary and DB
    for (const att of attachmentsToDelete) {
      if (att.fileurl) {
        await cloudinaryService.deleteFile(att.fileurl);
      }
      await att.destroy({ transaction });
    }

    // Upload new files
    if (files && files.length > 0) {
      for (const file of files) {
        let fileurl;
        let filetype;

        if (file.mimetype.startsWith("video/")) {
          filetype = "video";
        } else {
          filetype = "image";
        }

        const result = await cloudinaryService.uploadFile(file);
        fileurl = result.secure_url;

        await Attachment.create(
          {
            interactionid: commentId,
            fileurl,
            filetype,
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
          attributes: ["id", "fullname", "avatar"],
          include: [
            {
              model: CompanyMember,
              attributes: ["companyid", "status"],
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

const deleteComment = async (commentId, userid) => {
  try {
    const comment = await Interaction.findByPk(commentId, {
      include: [{ model: Attachment, as: "Attachments" }],
    });

    if (!comment) return false;
    if (comment.userid !== userid) {
      return false;
    }

    // Delete all attachments from Cloudinary
    if (comment.Attachments && comment.Attachments.length > 0) {
      for (const attachment of comment.Attachments) {
        if (attachment.fileurl) {
          await cloudinaryService.deleteFile(attachment.fileurl);
        }
      }
      await Attachment.destroy({ where: { interactionid: commentId } });
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
