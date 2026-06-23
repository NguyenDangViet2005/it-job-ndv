const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Connection = sequelize.define("Connection", {
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
  },
  connecteduserid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    allowNull: false,
    defaultValue: "pending",
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
});

module.exports = Connection;
