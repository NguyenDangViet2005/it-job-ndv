// src/models/User.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "full_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date_of_birth",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "cover_image",
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "cv_url",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "user",
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "refresh_token",
    },
  },
  {
    tableName: "Users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
