// src/models/Application.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Application = sequelize.define(
  "Application",
  {
    jobid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    cvurl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverletter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending",
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "Application",
    timestamps: false, // Để database tự động xử lý với DEFAULT CURRENT_TIMESTAMP
  },
);

module.exports = Application;
