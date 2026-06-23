const blogService = require("../services/blog.service");
const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const getCurrentUserId = (req) => {
  return req.user ? req.user.id : null;
};

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const categoryid = req.query.categoryid
      ? parseInt(req.query.categoryid)
      : null;

    const result = await blogService.getAllBlogs(page, pageSize, categoryid);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await blogService.getBlogById(id);
    if (!result) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const userid = parseInt(req.params.userid);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await blogService.getBlogsByUserId(userid, page, pageSize);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userid = getCurrentUserId(req);
    if (!userid) {
      if (!req.body.userid)
        return res.status(401).json({ message: "Unauthorized" });
    }

    const data = {
      ...req.body,
      userid: req.body.userid || userid,
    };

    const result = await blogService.createBlog(data, req.file);
    if (!result) {
      return res.status(400).json({ message: "Failed to create blog" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await blogService.updateBlog(id, req.body, req.file);
    if (!result) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await blogService.deleteBlog(id);
    if (!result) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  deleteBlog,
};
