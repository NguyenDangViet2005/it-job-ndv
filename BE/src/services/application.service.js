const { Application, Job, Company, User } = require("../models");
const ApplicationResponse = require("../dtos/ApplicationResponse.dto");

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
          attributes: ["id", "fullname", "email", "avatar"],
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdat", "DESC"]],
    });
    return {
      data: rows.map((app) => new ApplicationResponse(app)),
      totalItems: count,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

const create = async (applicationData) => {
  try {
    const { jobid, userid, cvurl, coverletter } = applicationData;

    // Check if application already exists
    const existingApplication = await Application.findOne({
      where: {
        jobid,
        userid,
      },
    });
    if (existingApplication) {
      throw new Error("Bạn đã ứng tuyển vào công việc này rồi");
    }

    // Create application
    const newApplication = await Application.create({
      jobid,
      userid,
      cvurl: cvurl || null,
      coverletter: coverletter || null,
      status: "pending",
    });

    // Load with relations
    const loadedApplication = await Application.findOne({
      where: { jobid, userid },
      include: [
        {
          model: Job,
          include: [{ model: Company }],
        },
        {
          model: User,
          attributes: ["id", "fullname", "email"],
        },
      ],
    });

    return new ApplicationResponse(loadedApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

const getByUserId = async (userid, pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Application.findAndCountAll({
      where: { userid },
      include: [
        {
          model: Job,
          include: [{ model: Company }],
        },
        {
          model: User,
          attributes: ["id", "fullname", "email"],
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdat", "DESC"]],
    });
    return {
      data: rows.map((app) => new ApplicationResponse(app)),
      totalItems: count,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

const getByCompanyId = async (companyid, pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Application.findAndCountAll({
      include: [
        {
          model: Job,
          where: { companyid },
          required: true,
          include: [{ model: Company }],
        },
        {
          model: User,
          attributes: ["id", "fullname", "email", "avatar"],
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdat", "DESC"]],
    });
    return {
      data: rows.map((app) => new ApplicationResponse(app)),
      totalItems: count,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

const update = async (jobid, userid, updateData) => {
  try {
    const application = await Application.findOne({
      where: { jobid, userid },
      include: [
        {
          model: Job,
          include: [{ model: Company }],
        },
        {
          model: User,
        },
      ],
    });

    if (!application) {
      return null;
    }
    if (updateData.cvurl) application.cvurl = updateData.cvurl;
    if (updateData.coverletter)
      application.coverletter = updateData.coverletter;
    if (updateData.status) application.status = updateData.status;

    await application.save();
    return new ApplicationResponse(application);
  } catch (error) {
    throw error;
  }
};

const deleteApp = async (jobid, userid) => {
  try {
    const application = await Application.findOne({
      where: { jobid, userid },
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
