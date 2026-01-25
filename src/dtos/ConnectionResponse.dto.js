class ConnectionResponse {
  constructor(connection) {
    this.id = connection.id;
    this.userId = connection.userId;
    this.connectedUserId = connection.connectedUserId;
    this.status = connection.status;
    this.createdAt = connection.createdAt;
    this.updatedAt = connection.updatedAt;

    // Include user details if available
    if (connection.User) {
      this.user = {
        id: connection.User.id,
        fullName: connection.User.fullName,
        avatar: connection.User.avatar,
        email: connection.User.email,
      };
    }

    if (connection.ConnectedUser) {
      this.connectedUser = {
        id: connection.ConnectedUser.id,
        fullName: connection.ConnectedUser.fullName,
        avatar: connection.ConnectedUser.avatar,
        email: connection.ConnectedUser.email,
      };
    }
  }
}

module.exports = ConnectionResponse;
