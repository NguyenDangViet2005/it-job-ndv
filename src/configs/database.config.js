// src/configs/database.config.js
const { Pool } = require("pg");
const env = require("./env.config");

// Cấu hình kết nối PostgreSQL
const config = {
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  ssl: env.db.ssl
    ? {
        rejectUnauthorized: false,
      }
    : false,
  max: 10,
  min: 0,
  idleTimeoutMillis: 30000,
};

// Tạo connection pool
const pool = new Pool(config);

const connectDatabase = pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL successfully!");
    client.release();
    return pool;
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  });

module.exports = {
  pool,
  connectDatabase,
};
