const connectionService = require("../services/connection.service");
const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const getCurrentUserId = (req) => {
  if (req.user) return req.user.id;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, env.jwt.accessSecret);
      return decoded.id;
    } catch (e) {}
  }
  return null;
};

const sendConnectionRequest = async (req, res, next) => {
  try {
    const userId = req.body.userId || getCurrentUserId(req);
    const connectedUserId = req.body.connectedUserId;

    if (!userId || !connectedUserId) {
      return res
        .status(400)
        .json({ message: "UserId and ConnectedUserId are required" });
    }

    if (userId === connectedUserId) {
      return res
        .status(400)
        .json({ message: "Cannot connect to yourself" });
    }

    const result = await connectionService.sendConnectionRequest(
      userId,
      connectedUserId
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const acceptConnectionRequest = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const connectionId = parseInt(req.params.connectionId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await connectionService.acceptConnectionRequest(
      connectionId,
      userId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const rejectConnectionRequest = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const connectionId = parseInt(req.params.connectionId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await connectionService.rejectConnectionRequest(
      connectionId,
      userId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const removeConnection = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const connectionId = parseInt(req.params.connectionId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await connectionService.removeConnection(connectionId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserConnections = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId || getCurrentUserId(req));
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await connectionService.getUserConnections(
      userId,
      page,
      pageSize
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPendingRequests = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await connectionService.getPendingRequests(
      userId,
      page,
      pageSize
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getSentRequests = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await connectionService.getSentRequests(
      userId,
      page,
      pageSize
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
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
