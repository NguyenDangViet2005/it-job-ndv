// src/models/SkillJob.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const SkillJob = sequelize.define(
  "SkillJob",
  {
    skillId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "skill_id",
    },
    jobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "job_id",
    },
  },
  {
    tableName: "SkillJobs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = SkillJob;
