const express = require("express");
const authRoutes = require("./auth.route");
const companyRoutes = require("./company.route");
const jobRoutes = require("./job.route");
const applicationRoutes = require("./application.route");
const postRoutes = require("./post.route");
const skillRoutes = require("./skill.route");
const locationRoutes = require("./location.route");
const blogCategoryRoutes = require("./blog-category.route");
const blogRoutes = require("./blog.route");
const reviewRoutes = require("./review.route");
const followRoutes = require("./follow.route");
const searchRoutes = require("./search.route");
const userRoutes = require("./user.route");

const Router = express.Router();

Router.use("auth", authRoutes);
Router.use("company", companyRoutes);
Router.use("job", jobRoutes);
Router.use("application", applicationRoutes);
Router.use("post", postRoutes);
Router.use("skills", skillRoutes);
Router.use("locations", locationRoutes);
Router.use("blogcategory", blogCategoryRoutes);
Router.use("blog", blogRoutes);
Router.use("review", reviewRoutes);
Router.use("follows", followRoutes);
Router.use("search", searchRoutes);
Router.use("user", userRoutes);

const apiRouter = {
  Router,
};

module.exports = { apiRouter };
