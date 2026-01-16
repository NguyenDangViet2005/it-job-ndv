// src/models/Application.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Application = sequelize.define(
  "Application",
  {
    jobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("GETDATE()"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("GETDATE()"),
    },
  },
  {
    tableName: "Application",
    timestamps: false, // Để database tự động xử lý với DEFAULT GETDATE()
  }
);

module.exports = Application;
