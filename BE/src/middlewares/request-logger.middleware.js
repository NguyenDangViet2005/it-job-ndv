const morgan = require("morgan");
const env = require("../configs/env.config");

const logger = morgan(env.app.env === "development" ? "dev" : "combined");

module.exports = logger;
