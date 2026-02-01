// src/models/Follow.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Follow = sequelize.define(
  "Follow",
  {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    companyid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "Follow",
    timestamps: false,
  },
);

module.exports = Follow;
