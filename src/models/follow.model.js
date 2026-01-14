// src/models/Follow.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Follow = sequelize.define(
  "Follow",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "Follow",
    timestamps: true,
  }
);

module.exports = Follow;
