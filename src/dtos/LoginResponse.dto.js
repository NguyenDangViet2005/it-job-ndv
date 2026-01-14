const UserResponse = require("./UserResponse.dto");

class LoginResponse {
  constructor(accessToken, refreshToken, user) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user ? new UserResponse(user) : null;
  }
}

module.exports = LoginResponse;
