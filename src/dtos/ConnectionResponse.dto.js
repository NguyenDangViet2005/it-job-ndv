class ConnectionResponse {
  constructor(connection) {
    this.id = connection.id;
    this.userid = connection.userid;
    this.connecteduserid = connection.connecteduserid;
    this.status = connection.status;
    this.createdat = connection.createdat;
    this.updatedat = connection.updatedat;

    // Include user details if available
    if (connection.User) {
      this.user = {
        id: connection.User.id,
        fullname: connection.User.fullname,
        avatar: connection.User.avatar,
        email: connection.User.email,
      };
    }

    if (connection.ConnectedUser) {
      this.connectedUser = {
        id: connection.ConnectedUser.id,
        fullname: connection.ConnectedUser.fullname,
        avatar: connection.ConnectedUser.avatar,
        email: connection.ConnectedUser.email,
      };
    }
  }
}

module.exports = ConnectionResponse;
