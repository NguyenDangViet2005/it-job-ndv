class ReviewResponse {
  constructor(review) {
    this.id = review.id;
    this.userid = review.userid;
    this.userName = review.User ? review.User.fullname : null;
    this.userAvatar = review.User ? review.User.avatar : null;
    this.companyid = review.companyid;
    this.companyName = review.Company ? review.Company.name : null;
    this.rating = review.rating;
    this.comment = review.comment;
    this.createdat = review.createdat;
    this.updatedat = review.updatedat;
  }
}

module.exports = ReviewResponse;
