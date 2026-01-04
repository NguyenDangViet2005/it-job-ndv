// src/models/CompanyMember.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const CompanyMember = sequelize.define(
  "CompanyMember",
  {
    companyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "company_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "user_id",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "joined_at",
    },
  },
  {
    tableName: "CompanyMembers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = CompanyMember;
