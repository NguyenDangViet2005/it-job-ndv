class BlogCategoryResponse {
  constructor(category) {
    this.id = category.id;
    this.name = category.name;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}

module.exports = BlogCategoryResponse;
