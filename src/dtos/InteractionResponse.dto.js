const { PostUserResponse } = require("./PostResponse.dto");
const AttachmentResponse = require("./AttachmentResponse.dto");

class CommentResponse {
  constructor(comment) {
    this.id = comment.id;
    this.user = comment.User ? new PostUserResponse(comment.User) : null;
    this.content = comment.content;
    this.isLiked = comment.isLiked || false; // Depends on if we calculate this per user
    this.createdAt = comment.createdAt;
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
