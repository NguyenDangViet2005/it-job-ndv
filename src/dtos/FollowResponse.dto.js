const CompanyResponse = require("./CompanyResponse.dto");
const UserResponse = require("./UserResponse.dto");

class FollowResponse {
  constructor(follow) {
    this.userId = follow.userId;
    this.companyId = follow.companyId;
    this.createdAt = follow.createdAt; // or create_at depending on model
    this.updatedAt = follow.updatedAt;

    if (follow.Company) {
      this.company = new CompanyResponse(follow.Company);
    }

    if (follow.User) {
      this.user = new UserResponse(follow.User);
    }
  }
}

module.exports = FollowResponse;
