const express = require("express");
const router = express.Router();
const connectionController = require("../controllers/connection.controller");

// Send connection request
router.post("/", connectionController.sendConnectionRequest);

// Accept connection request
router.put(
  "/:connectionId/accept",
  connectionController.acceptConnectionRequest,
);

// Reject connection request
router.put(
  "/:connectionId/reject",
  connectionController.rejectConnectionRequest,
);

// Remove connection
router.delete("/:connectionId", connectionController.removeConnection);

// Get user connections (accepted)
router.get("/user/:userid", connectionController.getUserConnections);

// Get pending requests (received)
router.get("/pending", connectionController.getPendingRequests);

// Get sent requests
router.get("/sent", connectionController.getSentRequests);

module.exports = router;
