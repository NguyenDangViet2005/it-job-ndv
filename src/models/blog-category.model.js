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
    tableName: "BlogCategories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = BlogCategory;
