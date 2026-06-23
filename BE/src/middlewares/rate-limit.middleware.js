const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Rate limiter riêng cho search endpoint - chặt chẽ hơn
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 30, // Giới hạn 30 requests mỗi phút (trung bình 2 giây/request)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message:
      "Quá nhiều yêu cầu tìm kiếm. Vui lòng thử lại sau 1 phút",
  },
  // Skip successful requests để không đếm vào limit
  skipSuccessfulRequests: false,
  // Skip failed requests
  skipFailedRequests: true,
});

module.exports = { limiter, searchLimiter };
