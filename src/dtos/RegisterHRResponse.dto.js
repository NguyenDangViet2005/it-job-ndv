const UserResponse = require("./UserResponse.dto");
const CompanyResponse = require("./CompanyResponse.dto");

class RegisterHRResponse {
  constructor(accesstoken, refreshtoken, user, company) {
    this.accesstoken = accesstoken;
    this.refreshtoken = refreshtoken;
    this.user = user ? new UserResponse(user) : null;
    this.company = company ? new CompanyResponse(company) : null;
  }
}

module.exports = RegisterHRResponse;
