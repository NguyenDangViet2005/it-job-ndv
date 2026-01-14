const { Sequelize } = require("sequelize");
const env = require("./env.config");

// Tạo Sequelize instance
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: "mssql",
  dialectOptions: {
    encrypt: env.db.encrypt,
    trustServerCertificate: env.db.trustServerCertificate,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false, // Tắt logging SQL
  define: {
    timestamps: true,
    underscored: false, // Dùng camelCase cho DB
    freezeTableName: true, // Không tự động plural table names
  },
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected to SQL Server successfully!");
  } catch (error) {
    console.error("❌ Sequelize connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
