class BlogResponse {
  constructor(blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.excerpt = blog.excerpt;
    this.content = blog.content;
    this.readTime = blog.readTime;
    this.image = blog.image;
    this.author = blog.User ? blog.User.fullName : null;
    this.category =
      blog.Category || blog.BlogCategory
        ? (blog.Category || blog.BlogCategory).name
        : null;
    this.date = blog.created_at || blog.createdAt; // Assuming date maps to created_at if not present
    this.createdAt = blog.createdAt;
    this.updatedAt = blog.updatedAt;
  }
}

module.exports = BlogResponse;
