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
  },
  {
    tableName: "CompanyMembers",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = CompanyMember;
