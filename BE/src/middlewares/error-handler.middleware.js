const env = require("../configs/env.config");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Lỗi hệ thống nội bộ. Vui lòng thử lại sau.";

  console.error(`[Lỗi Hệ Thống] ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    stack: env.app.env === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
