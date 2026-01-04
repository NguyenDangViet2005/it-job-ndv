// src/models/Application.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Application = sequelize.define(
  "Application",
  {
    jobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "job_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "user_id",
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "cv_url",
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cover_letter",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending",
    },
  },
  {
    tableName: "Applications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Application;
