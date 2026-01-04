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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "post_id",
    },
    interactionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "interaction_id",
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "file_type",
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "file_url",
    },
  },
  {
    tableName: "Attachments",
    timestamps: false,
  }
);

module.exports = Attachment;
