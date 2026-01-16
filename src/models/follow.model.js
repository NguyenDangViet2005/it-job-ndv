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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("GETDATE()"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("GETDATE()"),
    },
  },
  {
    tableName: "Follow",
    timestamps: false,
  }
);

module.exports = Follow;
