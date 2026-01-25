const AttachmentResponse = require("./AttachmentResponse.dto");

class PostUserResponse {
  constructor(user) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.avatar = user.avatar;
    // Include CompanyMembers if exists
    if (user.CompanyMembers && user.CompanyMembers.length > 0) {
      this.CompanyMembers = user.CompanyMembers.map(cm => ({
        companyId: cm.companyId,
        status: cm.status,
        Company: cm.Company ? {
          id: cm.Company.id,
          name: cm.Company.name,
          avatar: cm.Company.avatar,
        } : null
      }));
    }
  }
}

class CommentResponse {
  constructor(comment) {
    this.id = comment.id;
    this.user = comment.User ? new PostUserResponse(comment.User) : null;
    this.content = comment.content;
    this.isLiked = comment.isLiked || false; // Depends on if we calculate this per user
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.attachments = comment.Attachments
      ? comment.Attachments.map((a) => new AttachmentResponse(a))
      : [];
  }
}

class InteractionResponse {
  constructor(data) {
    this.totalLikes = data.totalLikes || 0;
    this.totalComments = data.totalComments || 0;
    this.isLikedByCurrentUser = data.isLikedByCurrentUser || false;
    this.comments = data.comments
      ? data.comments.map((c) => new CommentResponse(c))
      : [];
  }
}

class LikeResponse {
  constructor(data) {
    this.postId = data.postId;
    this.userId = data.userId;
    this.isLiked = data.isLiked;
    this.totalLikes = data.totalLikes;
  }
}

module.exports = { InteractionResponse, CommentResponse, LikeResponse };
