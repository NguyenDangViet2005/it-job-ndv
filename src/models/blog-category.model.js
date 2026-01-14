// src/models/BlogCategory.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const BlogCategory = sequelize.define(
  "BlogCategory",
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
    tableName: "BlogCategory",
    timestamps: true,
  }
);

module.exports = BlogCategory;
