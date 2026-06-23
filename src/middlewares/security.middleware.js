const cors = require("cors");
const helmet = require("helmet");
const env = require("../configs/env.config");

const corsOptions = {
  origin: env.client.url || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const securityMiddleware = [helmet(), cors(corsOptions)];

module.exports = securityMiddleware;
