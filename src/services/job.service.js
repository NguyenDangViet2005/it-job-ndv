const { Job, Company, Skill, SkillJob, CompanyMember } = require("../models");
const { Op } = require("sequelize");

const getAll = async (pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Job.findAndCountAll({
      include: [
        {
          model: Company,
          attributes: ["id", "name", "avatar", "website", "address"],
        },
        {
          model: Skill,
        },
      ],
      offset,
      limit: pageSize,
      order: [["created_at", "DESC"]],
      distinct: true,
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

const getById = async (id) => {
  try {
    const job = await Job.findByPk(id, {
      include: [
        {
          model: Company,
          attributes: ["id", "name", "avatar", "website", "address"],
        },
        {
          model: Skill,
        },
      ],
    });
    return job;
  } catch (error) {
    throw error;
  }
};

const create = async (userId, jobData) => {
  try {
    const companyMember = await CompanyMember.findOne({
      where: {
        userId: userId,
        status: "active",
      },
    });

    if (!companyMember) {
      throw new Error("User is not a member of any company");
    }
    const { title, description, type, quantity, deadline, skillIds } = jobData;

    const newJob = await Job.create({
      title,
      description,
      type: type || "full-time",
      quantity,
      deadline,
      companyId: companyMember.companyId,
      status: "open",
    });
    if (skillIds && skillIds.length > 0) {
      const skillJobs = skillIds.map((skillId) => ({
        jobId: newJob.id,
        skillId: skillId,
      }));
      await SkillJob.bulkCreate(skillJobs);
    }
    return await getById(newJob.id);
  } catch (error) {
    throw error;
  }
};

const update = async (id, jobData) => {
  try {
    const job = await Job.findByPk(id);
    if (!job) return null;
    const { title, description, type, quantity, deadline, status, skillIds } =
      jobData;
    if (title) job.title = title;
    if (description) job.description = description;
    if (type) job.type = type;
    if (quantity) job.quantity = quantity;
    if (deadline) job.deadline = deadline;
    if (status) job.status = status;
    await job.save();
    if (skillIds) {
      await SkillJob.destroy({ where: { jobId: id } });
      if (skillIds.length > 0) {
        const skillJobs = skillIds.map((skillId) => ({
          jobId: id,
          skillId: skillId,
        }));
        await SkillJob.bulkCreate(skillJobs);
      }
    }

    return await getById(id);
  } catch (error) {
    throw error;
  }
};

const deleteJob = async (id) => {
  try {
    const job = await Job.findByPk(id);
    if (!job) return false;
    await SkillJob.destroy({ where: { jobId: id } });
    await job.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

const getJobsByCompanyId = async (companyId, pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Job.findAndCountAll({
      where: { companyId },
      include: [
        {
          model: Company,
          attributes: ["id", "name", "avatar", "website", "address"],
        },
        { model: Skill },
      ],
      offset,
      limit: pageSize,
      order: [["created_at", "DESC"]],
      distinct: true,
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

const getJobsToday = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const jobs = await Job.findAll({
      where: {
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: [{ model: Company }, { model: Skill }],
    });
    return jobs;
  } catch (error) {
    throw error;
  }
};

const getJobsBySkill = async (skillId, pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Job.findAndCountAll({
      include: [
        { model: Company },
        {
          model: Skill,
          where: { id: skillId },
        },
      ],
      offset,
      limit: pageSize,
      distinct: true,
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

const getJobsByUserId = async (userId, pageNumber = 1, pageSize = 10) => {
  try {
    const companyMember = await CompanyMember.findOne({
      where: { userId: userId, status: "active" },
    });
    if (!companyMember) {
      throw new Error("User not in any company");
    }
    return await getJobsByCompanyId(
      companyMember.companyId,
      pageNumber,
      pageSize
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteJob,
  getJobsByCompanyId,
  getJobsToday,
  getJobsBySkill,
  getJobsByUserId,
};
