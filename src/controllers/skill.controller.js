const skillService = require("../services/skill.service");

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await skillService.getAllSkills(page, pageSize);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const result = await skillService.createSkill(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await skillService.updateSkill(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await skillService.deleteSkill(id);
    if (!result) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  update,
  deleteSkill,
};
