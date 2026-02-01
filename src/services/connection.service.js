const { Connection, User } = require("../models");
const { Op } = require("sequelize");
const ConnectionResponse = require("../dtos/ConnectionResponse.dto");

// Send connection request
const sendConnectionRequest = async (userid, connecteduserid) => {
  try {
    // Check if connection already exists
    const existing = await Connection.findOne({
      where: {
        [Op.or]: [
          { userid, connecteduserid },
          { userid: connecteduserid, connecteduserid: userid },
        ],
      },
    });

    if (existing) {
      throw new Error("Connection already exists");
    }

    const connection = await Connection.create({
      userid,
      connecteduserid,
      status: "pending",
    });

    return new ConnectionResponse(connection);
  } catch (error) {
    throw error;
  }
};

// Accept connection request
const acceptConnectionRequest = async (connectionId, userid) => {
  try {
    const connection = await Connection.findByPk(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Only the receiver can accept
    if (connection.connecteduserid !== userid) {
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
const rejectConnectionRequest = async (connectionId, userid) => {
  try {
    const connection = await Connection.findByPk(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Only the receiver can reject
    if (connection.connecteduserid !== userid) {
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
const removeConnection = async (connectionId, userid) => {
  try {
    const connection = await Connection.findByPk(connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Either user can remove the connection
    if (connection.userid !== userid && connection.connecteduserid !== userid) {
      throw new Error("Unauthorized to remove this connection");
    }

    await connection.destroy();
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Get user connections (accepted only)
const getUserConnections = async (userid, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Connection.findAndCountAll({
      where: {
        [Op.or]: [{ userid }, { connecteduserid: userid }],
        status: "accepted",
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "fullname", "avatar", "email"],
        },
        {
          model: User,
          as: "ConnectedUser",
          attributes: ["id", "fullname", "avatar", "email"],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["updatedat", "DESC"]],
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
const getPendingRequests = async (userid, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Connection.findAndCountAll({
      where: {
        connecteduserid: userid,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "fullname", "avatar", "email"],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["createdat", "DESC"]],
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
const getSentRequests = async (userid, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Connection.findAndCountAll({
      where: {
        userid,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "ConnectedUser",
          attributes: ["id", "fullname", "avatar", "email"],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["createdat", "DESC"]],
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
