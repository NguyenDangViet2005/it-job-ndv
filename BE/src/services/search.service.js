const { Job, Company, Skill, Ward, Province } = require("../models");
const { Op } = require("sequelize");
const { JobResponse } = require("../dtos/JobResponse.dto");
const CompanyResponse = require("../dtos/CompanyResponse.dto");

const search = async (keyword, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(now.getDate()).padStart(2, "0")}`;

    const jobs = await Job.findAll({
      where: {
        title: { [Op.iLike]: `%${keyword}%` },
        status: "open",
        deadline: { [Op.gte]: today },
      },
      include: [
        { model: Company, as: "Company", attributes: ["id", "name", "avatar"] },
      ],
      offset,
      limit: pageSize,
      order: [["createdat", "DESC"]],
    });

    const companies = await Company.findAll({
      where: {
        name: { [Op.iLike]: `%${keyword}%` },
      },
      include: [
        {
          model: Ward,
          include: [
            {
              model: Province,
            },
          ],
        },
      ],
      offset,
      limit: pageSize,
      order: [["name", "ASC"]],
    });

    const skills = await Skill.findAll({
      where: {
        name: { [Op.iLike]: `%${keyword}%` },
      },
      offset,
      limit: pageSize,
      order: [["name", "ASC"]],
    });

    return {
      jobs: jobs.map((j) => new JobResponse(j)),
      companies: companies.map((c) => new CompanyResponse(c)),
      skills,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  search,
};
