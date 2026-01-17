class BlogResponse {
  constructor(blog) {
    this.id = blog.id;
    this.userId = blog.userId;
    this.categoryId = blog.categoryId;
    this.title = blog.title;
    this.excerpt = blog.excerpt;
    this.content = blog.content;
    this.readTime = blog.readTime;
    this.image = blog.image;
    this.author = blog.User ? blog.User.fullName : null;
    this.category = blog.BlogCategory ? blog.BlogCategory.name : null;
    this.date = blog.created_at || blog.createdAt;
    this.createdAt = blog.createdAt;
    this.updatedAt = blog.updatedAt;

  }
}

module.exports = BlogResponse;
