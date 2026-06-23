const { Sequelize } = require("sequelize");
const env = require("./env.config");

// Tạo Sequelize instance
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: "postgres",
  dialectOptions: {
    ssl: env.db.ssl
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false, // Tắt logging SQL
  define: {
    timestamps: false, // Models tự quản lý timestamps
    freezeTableName: true, // Không tự động plural table names
  },
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ Sequelize connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
