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
    tableName: "Skill_User",
    timestamps: false,
  }
);

module.exports = SkillUser;
