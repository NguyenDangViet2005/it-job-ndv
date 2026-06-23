const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const SessionLogin = sequelize.define(
  "SessionLogins",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    accesstoken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshtoken: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
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
    tableName: "SessionLogins",
    timestamps: false,
  },
);

module.exports = SessionLogin;
