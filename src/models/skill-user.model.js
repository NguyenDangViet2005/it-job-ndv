// src/models/SkillUser.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const SkillUser = sequelize.define(
  "SkillUser",
  {
    skillId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "Skill_User",
    timestamps: false,
  }
);

module.exports = SkillUser;
