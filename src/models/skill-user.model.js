// src/models/SkillUser.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const SkillUser = sequelize.define(
  "SkillUser",
  {
    skillId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "skill_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "user_id",
    },
  },
  {
    tableName: "SkillUsers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = SkillUser;
