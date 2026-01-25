const { Connection, User } = require("../models");
const { Op } = require("sequelize");
const ConnectionResponse = require("../dtos/ConnectionResponse.dto");

// Send connection request
const sendConnectionRequest = async (userId, connectedUserId) => {
  try {
    // Check if connection already exists
    const existing = await Connection.findOne({
      where: {
        [Op.or]: [
          { userId, connectedUserId },
          { userId: connectedUserId, connectedUserId: userId },
        ],
      },
    });

    if (existing) {
      throw new Error("Connection already exists");
    }

    const connection = await Connection.create({
      userId,
      connectedUserId,
      status: "pending",
    });

    return new ConnectionResponse(connection);
  } catch (error) {
    throw error;
  }
};

// Accept connection request
const acceptConnectionRequest = async (connectionId, userId) => {
  try {
    const connection = await Connection.findByPk(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Only the receiver can accept
    if (connection.connectedUserId !== userId) {
      throw new Error("Unauthorized to accept this connection");
    }

    if (connection.status !== "pending") {
      throw new Error("Connection is not pending");
    }

    connection.status = "accepted";
    await connection.save();

    return new ConnectionResponse(connection);
  } catch (error) {
    throw error;
  }
};

// Reject connection request
const rejectConnectionRequest = async (connectionId, userId) => {
  try {
    const connection = await Connection.findByPk(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Only the receiver can reject
    if (connection.connectedUserId !== userId) {
      throw new Error("Unauthorized to reject this connection");
    }

    connection.status = "rejected";
    await connection.save();

    return new ConnectionResponse(connection);
  } catch (error) {
    throw error;
  }
};

// Remove connection
const removeConnection = async (connectionId, userId) => {
  try {
    const connection = await Connection.findByPk(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Either user can remove the connection
    if (connection.userId !== userId && connection.connectedUserId !== userId) {
      throw new Error("Unauthorized to remove this connection");
    }

    await connection.destroy();
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Get user connections (accepted only)
const getUserConnections = async (userId, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Connection.findAndCountAll({
      where: {
        [Op.or]: [{ userId }, { connectedUserId: userId }],
        status: "accepted",
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "fullName", "avatar", "email"],
        },
        {
          model: User,
          as: "ConnectedUser",
          attributes: ["id", "fullName", "avatar", "email"],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["updatedAt", "DESC"]],
    });

    return {
      data: rows.map((c) => new ConnectionResponse(c)),
      totalItems: count,
      pageNumber: page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

// Get pending connection requests (received)
const getPendingRequests = async (userId, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Connection.findAndCountAll({
      where: {
        connectedUserId: userId,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "fullName", "avatar", "email"],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows.map((c) => new ConnectionResponse(c)),
      totalItems: count,
      pageNumber: page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

// Get sent connection requests
const getSentRequests = async (userId, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Connection.findAndCountAll({
      where: {
        userId,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "ConnectedUser",
          attributes: ["id", "fullName", "avatar", "email"],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows.map((c) => new ConnectionResponse(c)),
      totalItems: count,
      pageNumber: page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getUserConnections,
  getPendingRequests,
  getSentRequests,
};
