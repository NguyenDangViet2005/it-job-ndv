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
    tableName: "Skill_Job",
    timestamps: false,
  }
);

module.exports = SkillJob;
