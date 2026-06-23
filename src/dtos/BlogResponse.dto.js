class BlogResponse {
  constructor(blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.excerpt = blog.excerpt;
    this.content = blog.content;
    this.readtime = blog.readtime;
    this.image = blog.image;
    this.author = blog.User ? blog.User.fullname : null;
    this.avatar = blog.User ? blog.User.avatar : null;
    this.category = blog.BlogCategory ? blog.BlogCategory.name : null;
    this.date = blog.created_at || blog.createdat;
    this.createdat = blog.createdat;
    this.updatedat = blog.updatedat;
  }
}

module.exports = BlogResponse;
