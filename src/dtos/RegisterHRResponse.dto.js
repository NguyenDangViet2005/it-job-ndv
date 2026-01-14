const UserResponse = require("./UserResponse.dto");
const CompanyResponse = require("./CompanyResponse.dto");

class RegisterHRResponse {
  constructor(accessToken, refreshToken, user, company) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user ? new UserResponse(user) : null;
    this.company = company ? new CompanyResponse(company) : null;
  }
}

module.exports = RegisterHRResponse;
