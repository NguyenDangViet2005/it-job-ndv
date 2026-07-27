const rateLimit = require("express-rate-limit");
const env = require("../configs/env.config");

const createRateLimitHandler = (defaultMessage) => (req, res, next, options) => {
  const message = defaultMessage || "Quá nhiều yêu cầu từ địa chỉ IP này. Vui lòng thử lại sau.";
  
  // Nếu điều hướng trực tiếp bằng trình duyệt (GET request hoặc nhận HTML như OAuth Google/Facebook)
  if (req.method === "GET" || (req.headers.accept && req.headers.accept.includes("text/html"))) {
    const clientUrl = env.client.url || "http://localhost:3000";
    return res.redirect(`${clientUrl}/security-blocked?message=${encodeURIComponent(message)}`);
  }

  return res.status(429).json({
    success: false,
    status: 429,
    statusCode: 429,
    message: message,
  });
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler("Quá nhiều yêu cầu từ địa chỉ IP này, vui lòng thử lại sau 15 phút."),
});

// Strict Rate Limiter cho các endpoint xác thực (login, register, OAuth, change-password...)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 lần thử trong 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler("Bạn đã thực hiện quá 5 lần thử xác thực. Vui lòng thử lại sau 15 phút để bảo đảm an toàn."),
});

// Rate limiter riêng cho search endpoint - chặt chẽ hơn
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 30, // Giới hạn 30 requests mỗi phút
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: true,
  handler: createRateLimitHandler("Quá nhiều yêu cầu tìm kiếm. Vui lòng thử lại sau 1 phút."),
});

module.exports = { limiter, authLimiter, searchLimiter };


