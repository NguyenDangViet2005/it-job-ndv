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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    connectedUserId: {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
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
        fields: ["userId", "connectedUserId"],
        name: "unique_connection",
      },
      {
        fields: ["userId"],
        name: "idx_userId",
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
        fields: ["userId", "status"],
        name: "idx_user_status",
      },
      {
        fields: ["connectedUserId", "status"],
        name: "idx_connected_user_status",
      },
    ],
  }
);

module.exports = Connection;
