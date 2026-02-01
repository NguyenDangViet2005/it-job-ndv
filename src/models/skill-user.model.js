// src/models/SkillUser.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const SkillUser = sequelize.define(
  "Skill_User",
  {
    skillid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userid: {
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
    tableName: "Skill_User",
    timestamps: false,
  },
);

module.exports = SkillUser;
