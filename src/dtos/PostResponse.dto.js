const { InteractionResponse } = require("./InteractionResponse.dto");
const AttachmentResponse = require("./AttachmentResponse.dto");

class PostUserResponse {
  constructor(user) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.avatar = user.avatar;
  }
}

class PostCompanyResponse {
  constructor(company) {
    this.id = company.id;
    this.name = company.name;
    this.avatar = company.avatar;
    this.address = company.address;
    this.hotline = company.hotline;
    this.companyEmail = company.companyEmail;
  }
}

class PostResponse {
  constructor(post) {
    this.id = post.id;
    this.content = post.content;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;

    this.user = post.user
      ? new PostUserResponse(post.user)
      : post.User
        ? new PostUserResponse(post.User)
        : null;
    this.company = post.company
      ? new PostCompanyResponse(post.company)
      : post.Company
        ? new PostCompanyResponse(post.Company)
        : null;

    // Handle Interaction
    // If post.interaction is already an object (from specific service format) or if it's a model
    if (post.interaction) {
      this.interaction = new InteractionResponse(post.interaction);
    } else if (post.Interaction) {
      this.interaction = new InteractionResponse(post.Interaction);
    } else {
      this.interaction = null;
    }

    // Handle Attachments
    if (post.attachments && Array.isArray(post.attachments)) {
      this.attachments = post.attachments.map((a) => new AttachmentResponse(a));
    } else if (post.Attachments && Array.isArray(post.Attachments)) {
      this.attachments = post.Attachments.map((a) => new AttachmentResponse(a));
    } else {
      this.attachments = [];
    }
  }
}

module.exports = { PostResponse, PostUserResponse, PostCompanyResponse };
