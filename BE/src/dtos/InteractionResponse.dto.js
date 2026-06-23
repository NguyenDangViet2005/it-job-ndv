const AttachmentResponse = require("./AttachmentResponse.dto");

class PostUserResponse {
  constructor(user) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.avatar = user.avatar;
    // Include CompanyMembers if exists
    if (user.CompanyMembers && user.CompanyMembers.length > 0) {
      this.CompanyMembers = user.CompanyMembers.map((cm) => ({
        companyid: cm.companyid,
        status: cm.status,
        Company: cm.Company
          ? {
              id: cm.Company.id,
              name: cm.Company.name,
              avatar: cm.Company.avatar,
            }
          : null,
      }));
    }
  }
}

class CommentResponse {
  constructor(comment) {
    this.id = comment.id;
    this.user = comment.User ? new PostUserResponse(comment.User) : null;
    this.content = comment.content;
    this.isliked = comment.isliked || false; // Depends on if we calculate this per user
    this.createdat = comment.createdat;
    this.updatedat = comment.updatedat;
    this.attachments = comment.Attachments
      ? comment.Attachments.map((a) => new AttachmentResponse(a))
      : [];
  }
}

class InteractionResponse {
  constructor(data) {
    this.totalLikes = data.totalLikes || 0;
    this.totalComments = data.totalComments || 0;
    this.islikedByCurrentUser = data.islikedByCurrentUser || false;
    this.comments = data.comments
      ? data.comments.map((c) => new CommentResponse(c))
      : [];
  }
}

class LikeResponse {
  constructor(data) {
    this.postid = data.postid;
    this.userid = data.userid;
    this.isliked = data.isliked;
    this.totalLikes = data.totalLikes;
  }
}

module.exports = { InteractionResponse, CommentResponse, LikeResponse };
