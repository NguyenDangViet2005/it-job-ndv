const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const env = require("./configs/env.config");
const { sequelize, testConnection } = require("./configs/sequelize.config");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

(async () => {
  try {
    await testConnection();

    app.listen(env.app.port, () => {
      console.log(`🚀 ${env.app.name} running on port ${env.app.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

module.exports = app;
