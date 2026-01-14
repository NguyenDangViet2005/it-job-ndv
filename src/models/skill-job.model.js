// src/models/SkillJob.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const SkillJob = sequelize.define(
  "SkillJob",
  {
    skillId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "Skill_Job",
    timestamps: true,
  }
);

module.exports = SkillJob;
