const reviewService = require("../services/review.service");
const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const getCurrentUserId = (req) => {
  if (req.user) return req.user.id;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, env.jwt.accessSecret);
      return decoded.id;
    } catch (e) {}
  }
  return null;
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await reviewService.getReviewById(id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Review không tồn tại" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getByCompanyId = async (req, res, next) => {
  try {
    const companyid = parseInt(req.params.companyid);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await reviewService.getReviewsByCompanyId(
      companyid,
      page,
      pageSize,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const userid = parseInt(req.params.userid || getCurrentUserId(req));
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await reviewService.getReviewsByUserId(
      userid,
      page,
      pageSize,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    // Check auth
    const userid = getCurrentUserId(req);
    if (!userid) {
      return res
        .status(401)
        .json({ success: false, message: "Vui lòng đăng nhập" });
    }

    const result = await reviewService.createReview(userid, req.body);
    res
      .status(200)
      .json({ success: true, message: "Tạo review thành công", data: result });
  } catch (error) {
    next(error);
  }
};

const createTest = async (req, res, next) => {
  try {
    const userid = parseInt(req.query.userid) || 11;
    const result = await reviewService.createReview(userid, req.body);
    res
      .status(200)
      .json({ success: true, message: "Tạo review thành công", data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userid = getCurrentUserId(req);
    if (!userid) {
      return res
        .status(401)
        .json({ success: false, message: "Vui lòng đăng nhập" });
    }

    try {
      const result = await reviewService.updateReview(id, userid, req.body);
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Review không tồn tại" });
      }
      res.status(200).json({
        success: true,
        message: "Cập nhật review thành công",
        data: result,
      });
    } catch (err) {
      if (err.message === "Unauthorized") {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền chỉnh sửa review này",
        });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userid = getCurrentUserId(req);
    if (!userid) {
      return res
        .status(401)
        .json({ success: false, message: "Vui lòng đăng nhập" });
    }

    const result = await reviewService.getReviewById(id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Review không tồn tại" });
    }

    if (result.userid !== userid && req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await reviewService.deleteReview(id, userid);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getById,
  getByCompanyId,
  getByUserId,
  create,
  createTest,
  update,
  deleteReview,
};
