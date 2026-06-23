const followService = require("../services/follow.service");
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

const toggleFollow = async (req, res, next) => {
  try {
    const userid = req.body.userid || getCurrentUserId(req);
    const companyid = req.body.companyid;

    if (!userid || !companyid) {
      return res
        .status(400)
        .json({ message: "UserId and CompanyId are required" });
    }

    const result = await followService.toggleFollow(userid, companyid);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getFollowsByCompany = async (req, res, next) => {
  try {
    const companyid = parseInt(req.params.companyid);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await followService.getFollowsByCompany(
      companyid,
      page,
      pageSize,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleFollow,
  getFollowsByCompany,
};
