// src/models/SkillJob.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const SkillJob = sequelize.define(
  "Skill_Job",
  {
    skillid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    jobid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    tableName: "Skill_Job",
    timestamps: false,
  },
);

module.exports = SkillJob;
