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
    tableName: "BlogCategory",
    timestamps: false, // Để database tự động xử lý với DEFAULT GETDATE()
  }
);

module.exports = BlogCategory;
