const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("./configs/env.config");
const { testConnection } = require("./configs/sequelize.config");
const { apiRouter } = require("./routes/index.route");
const { corsOptions } = require("./configs/cors.config");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//CORS
app.use(cors(corsOptions));

// Routes
app.use("/api", apiRouter.Router);

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
