// src/models/Follow.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Follow = sequelize.define(
  "Follow",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "user_id",
    },
    companyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "company_id",
    },
  },
  {
    tableName: "Follows",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Follow;
