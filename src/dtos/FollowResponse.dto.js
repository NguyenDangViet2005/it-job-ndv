const CompanyResponse = require("./CompanyResponse.dto");
const UserResponse = require("./UserResponse.dto");

class FollowResponse {
  constructor(follow) {
    this.userid = follow.userid;
    this.companyid = follow.companyid;
    this.createdat = follow.createdat; // or create_at depending on model
    this.updatedat = follow.updatedat;

    if (follow.Company) {
      this.company = new CompanyResponse(follow.Company);
    }

    if (follow.User) {
      this.user = new UserResponse(follow.User);
    }
  }
}

module.exports = FollowResponse;
