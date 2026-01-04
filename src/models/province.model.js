// src/models/Province.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Province = sequelize.define(
  "Province",
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
  },
  {
    tableName: "Provinces",
    timestamps: false,
  }
);

module.exports = Province;
