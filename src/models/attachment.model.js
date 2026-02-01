// src/models/Attachment.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Attachment = sequelize.define(
  "Attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    interactionid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    filetype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileurl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Attachment",
    timestamps: false,
  },
);

module.exports = Attachment;
