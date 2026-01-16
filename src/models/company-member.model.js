// src/models/CompanyMember.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const CompanyMember = sequelize.define(
  "CompanyMember",
  {
    companyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("GETDATE()"),
    },
  },
  {
    tableName: "CompanyMembers",
    timestamps: false,
  }
);

module.exports = CompanyMember;
