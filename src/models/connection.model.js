const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/sequelize.config");

const Connection = sequelize.define(
  "Connection",
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
      defaultValue: DataTypes.NOW,
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Connection",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userid", "connectedUserId"],
        name: "unique_connection",
      },
      {
        fields: ["userid"],
        name: "idx_userid",
      },
      {
        fields: ["connectedUserId"],
        name: "idx_connectedUserId",
      },
      {
        fields: ["status"],
        name: "idx_status",
      },
      {
        fields: ["userid", "status"],
        name: "idx_user_status",
      },
      {
        fields: ["connectedUserId", "status"],
        name: "idx_connected_user_status",
      },
    ],
  },
);

module.exports = Connection;
