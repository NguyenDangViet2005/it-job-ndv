const { Application, Job, Company, User } = require("../models");

const getAll = async (pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Application.findAndCountAll({
      include: [
        {
          model: Job,
          include: [{ model: Company }],
        },
        {
          model: User,
          attributes: ["id", "fullName", "email", "avatar"],
        },
      ],
      offset,
      limit: pageSize,
      order: [["created_at", "DESC"]],
    });
    return {
      data: rows,
      totalItems: count,
      pageNumber,
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const create = async (applicationData) => {
  try {
    const { jobId, userId, cvUrl, coverLetter } = applicationData;
    const existingApplication = await Application.findOne({
      where: {
        jobId,
        userId,
      },
    });
    if (existingApplication) {
      throw new Error("Bạn đã ứng tuyển vào công việc này rồi");
    }
    await Application.create({
      jobId,
      userId,
      cvUrl,
      coverLetter,
      status: "pending",
    });
    const loadedApplication = await Application.findOne({
      where: { jobId, userId },
      include: [
        {
          model: Job,
          include: [{ model: Company }],
        },
        {
          model: User,
          attributes: ["id", "fullName", "email"],
        },
      ],
    });
    return loadedApplication;
  } catch (error) {
    throw error;
  }
};

const getByUserId = async (userId, pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Application.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Job,
          include: [{ model: Company }],
        },
        {
          model: User,
          attributes: ["id", "fullName", "email"],
        },
      ],
      offset,
      limit: pageSize,
      order: [["created_at", "DESC"]],
    });
    return {
      data: rows,
      totalItems: count,
      pageNumber,
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const getByCompanyId = async (companyId, pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Application.findAndCountAll({
      include: [
        {
          model: Job,
          where: { companyId },
          required: true,
          include: [{ model: Company }],
        },
        {
          model: User,
          attributes: ["id", "fullName", "email", "avatar"],
        },
      ],
      offset,
      limit: pageSize,
      order: [["created_at", "DESC"]],
    });
    return {
      data: rows,
      totalItems: count,
      pageNumber,
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const update = async (jobId, userId, updateData) => {
  try {
    const application = await Application.findOne({
      where: { jobId, userId },
    });

    if (!application) {
      return null;
    }
    if (updateData.cvUrl) application.cvUrl = updateData.cvUrl;
    if (updateData.coverLetter)
      application.coverLetter = updateData.coverLetter;
    if (updateData.status) application.status = updateData.status;

    await application.save();
    return application;
  } catch (error) {
    throw error;
  }
};

const deleteApp = async (jobId, userId) => {
  try {
    const application = await Application.findOne({
      where: { jobId, userId },
    });

    if (!application) {
      return false;
    }
    await application.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAll,
  create,
  getByUserId,
  getByCompanyId,
  update,
  deleteApp,
};
