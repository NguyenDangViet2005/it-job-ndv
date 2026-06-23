const UserResponse = require("./UserResponse.dto");

class LoginResponse {
  constructor(accesstoken, refreshtoken, user) {
    this.accesstoken = accesstoken;
    this.refreshtoken = refreshtoken;
    this.user = user ? new UserResponse(user) : null;
  }
}

module.exports = LoginResponse;
