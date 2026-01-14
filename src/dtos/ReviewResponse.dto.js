class ReviewResponse {
  constructor(review) {
    this.id = review.id;
    this.userId = review.userId;
    this.userName = review.User ? review.User.fullName : null;
    this.userAvatar = review.User ? review.User.avatar : null;
    this.companyId = review.companyId;
    this.companyName = review.Company ? review.Company.name : null;
    this.rating = review.rating;
    this.comment = review.comment;
    this.createdAt = review.createdAt;
    this.updatedAt = review.updatedAt;
  }
}

module.exports = ReviewResponse;
