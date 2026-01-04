// src/configs/database.config.js
const sql = require("mssql");
const env = require("./env.config");

// Cấu hình kết nối SQL Server
const config = {
  server: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  options: {
    encrypt: env.db.encrypt, // false cho local
    trustServerCertificate: env.db.trustServerCertificate, // true cho local
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Tạo connection pool
const connectDatabase = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to SQL Server successfully!");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  });

module.exports = {
  sql,
  connectDatabase,
};
