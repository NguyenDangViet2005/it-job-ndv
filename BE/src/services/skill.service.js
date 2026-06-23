const { Skill } = require("../models");
const { Op } = require("sequelize");

const getAllSkills = async (page = 1, pageSize = 10, query = null) => {
  const offset = (page - 1) * pageSize;
  const where = {};
  if (query) {
    where.name = { [Op.like]: `%${query}%` };
  }

  const { count, rows } = await Skill.findAndCountAll({
    where,
    limit: pageSize,
    offset: offset,
    order: [["name", "ASC"]],
  });

  return {
    data: rows,
    totalItems: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
};

const createSkill = async (data) => {
  try {
    const skill = await Skill.create({ name: data.name });
    return skill;
  } catch (error) {
    throw error;
  }
};

const updateSkill = async (id, data) => {
  try {
    const skill = await Skill.findByPk(id);
    if (!skill) return null;

    skill.name = data.name;
    await skill.save();
    return skill;
  } catch (error) {
    throw error;
  }
};

const deleteSkill = async (id) => {
  try {
    const skill = await Skill.findByPk(id);
    if (!skill) return false;

    await skill.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
