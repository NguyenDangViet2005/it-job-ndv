// src/models/Post.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "company_id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Post;
