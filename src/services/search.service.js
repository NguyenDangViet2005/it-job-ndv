const { Job, Company, Skill } = require("../models");
const { Op } = require("sequelize");
const { JobResponse } = require("../dtos/JobResponse.dto");
const CompanyResponse = require("../dtos/CompanyResponse.dto");

const search = async (keyword, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const jobs = await Job.findAll({
      where: {
        title: { [Op.like]: `%${keyword}%` },
      },
      include: [
        { model: Company, as: "Company", attributes: ["id", "name", "avatar"] },
      ],
      limit: 5, // Limit top results per category for summary search
    });

    const companies = await Company.findAll({
      where: {
        name: { [Op.like]: `%${keyword}%` },
      },
      limit: 5,
    });

    const skills = await Skill.findAll({
      where: {
        name: { [Op.like]: `%${keyword}%` },
      },
      limit: 5,
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
