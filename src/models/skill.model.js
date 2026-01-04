// src/models/Skill.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Skills",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Skill;
