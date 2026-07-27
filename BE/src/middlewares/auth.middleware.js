const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Thiếu thông tin xác thực (Authorization header)."
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Token xác thực không hợp lệ hoặc bị thiếu."
      });
    }

    const decoded = jwt.verify(token, env.jwt.accessSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
    });
  }
};

module.exports = {
  verifyToken,
};
