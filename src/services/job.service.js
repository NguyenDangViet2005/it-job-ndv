const { Job, Company, Skill, SkillJob, CompanyMember } = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const { JobResponse } = require("../dtos/JobResponse.dto");

const getAll = async (pageNumber = 1, pageSize = 10) => {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await Job.findAndCountAll({
      where: {
        status: { [Op.ne]: "closed" },
        deadline: { [Op.gt]: today },
      },
      include: [
        {
          model: Company,
          attributes: ["id", "name", "avatar", "website", "address"],
        },
        {
          model: Skill,
          through: { attributes: [] },
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });
    return {
      data: rows.map((job) => new JobResponse(job)),
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
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
          through: { attributes: [] },
        },
      ],
    });
    return job ? new JobResponse(job) : null;
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
    const { title, description, type, quantity, deadline, salary, skillIds } = jobData;

    const newJob = await Job.create({
      title,
      description,
      type: type || "full-time",
      quantity,
      deadline,
      salary,
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
    const { title, description, type, quantity, deadline, status, salary, skillIds } =
      jobData;
    if (title) job.title = title;
    if (description) job.description = description;
    if (type) job.type = type;
    if (quantity) job.quantity = quantity;
    if (deadline) job.deadline = deadline;
    if (status) job.status = status;
    if (salary) job.salary = salary;
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

const getJobsByCompanyId = async (
  companyId,
  pageNumber = 1,
  pageSize = 10,
  onlyActive = false
) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;

    let whereClause = { companyId };
    if (onlyActive) {
      whereClause.status = { [Op.ne]: "closed" };
      whereClause.deadline = { [Op.gt]: today };
    }

    const { count, rows } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Company,
          attributes: ["id", "name", "avatar", "website", "address"],
        },
        {
          model: Skill,
          through: { attributes: [] },
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });
    return {
      data: rows.map((job) => new JobResponse(job)),
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const getJobsToday = async () => {
  try {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const todayDate = `${yyyy}-${mm}-${dd}`;

    const jobs = await Job.findAll({
      where: {
        [Op.and]: [
          literal(`CAST([Job].[createdAt] AS DATE) = '${todayDate}'`),
          {
            status: { [Op.ne]: "closed" },
            deadline: { [Op.gt]: todayDate },
          },
        ],
      },
      include: [
        { model: Company },
        {
          model: Skill,
          through: { attributes: [] },
        },
      ],
    });

    return jobs.map((job) => new JobResponse(job));
  } catch (error) {
    throw error;
  }
};

const getJobsBySkill = async (skillId, pageNumber = 1, pageSize = 10) => {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
    const { count, rows } = await Job.findAndCountAll({
      where: {
        status: { [Op.ne]: "closed" },
        deadline: { [Op.gt]: today },
      },
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
      data: rows.map((job) => new JobResponse(job)),
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize,
    };
  } catch (error) {
    throw error;
  }
};

const getJobsByUserId = async (
  userId,
  pageNumber = 1,
  pageSize = 10,
  onlyActive = false
) => {
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
      pageSize,
      onlyActive
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
