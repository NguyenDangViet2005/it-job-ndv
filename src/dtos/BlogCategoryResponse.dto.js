class BlogCategoryResponse {
  constructor(category) {
    this.id = category.id;
    this.name = category.name;
    this.createdat = category.createdat;
    this.updatedat = category.updatedat;
  }
}

module.exports = BlogCategoryResponse;
