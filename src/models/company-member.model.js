// src/models/CompanyMember.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const CompanyMember = sequelize.define(
  "CompanyMembers",
  {
    companyid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joinedat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "CompanyMembers",
    timestamps: false,
  },
);

module.exports = CompanyMember;
