// src/models/Company.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "founded_year",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wardId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ward_id",
    },
    createdByUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "created_by_user_id",
    },
  },
  {
    tableName: "Companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Company;
