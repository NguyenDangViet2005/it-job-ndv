// src/models/index.js - Export tất cả models và setup relationships

const User = require("./user.model");
const Company = require("./company.model");
const Job = require("./job.model");
const Application = require("./application.model");
const Blog = require("./blog.model");
const BlogCategory = require("./blog-category.model");
const Post = require("./post.model");
const Skill = require("./skill.model");
const SkillJob = require("./skill-job.model");
const SkillUser = require("./skill-user.model");
const Review = require("./review.model");
const Follow = require("./follow.model");
const Province = require("./province.model");
const Ward = require("./ward.model");
const Attachment = require("./attachment.model");
const Interaction = require("./interaction.model");
const CompanyMember = require("./company-member.model");

// ========== RELATIONSHIPS ==========

// User relationships
User.hasMany(Application, { foreignKey: "userId" });
User.hasMany(Blog, { foreignKey: "userId" });
User.hasMany(Company, { foreignKey: "createdByUserId" });
User.hasMany(CompanyMember, { foreignKey: "userId" });
User.hasMany(Follow, { foreignKey: "userId" });
User.hasMany(Interaction, { foreignKey: "userId" });
User.hasMany(Post, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });
User.hasMany(SkillUser, { foreignKey: "userId" });

// Company relationships
Company.belongsTo(User, { foreignKey: "createdByUserId" });
Company.belongsTo(Ward, { foreignKey: "wardId" });
Company.hasMany(CompanyMember, { foreignKey: "companyId" });
Company.hasMany(Follow, { foreignKey: "companyId" });
Company.hasMany(Job, { foreignKey: "companyId" });
Company.hasMany(Post, { foreignKey: "companyId" });
Company.hasMany(Review, { foreignKey: "companyId" });

// Job relationships
Job.belongsTo(Company, { foreignKey: "companyId" });
Job.hasMany(Application, { foreignKey: "jobId" });
Job.hasMany(SkillJob, { foreignKey: "jobId" });
Job.belongsToMany(Skill, {
  through: SkillJob,
  foreignKey: "jobId",
  otherKey: "skillId",
});

// Application relationships
Application.belongsTo(Job, { foreignKey: "jobId" });
Application.belongsTo(User, { foreignKey: "userId" });

// Blog relationships
Blog.belongsTo(User, { foreignKey: "userId" });
Blog.belongsTo(BlogCategory, { foreignKey: "categoryId" });

// BlogCategory relationships
BlogCategory.hasMany(Blog, { foreignKey: "categoryId" });

// Post relationships
Post.belongsTo(User, { foreignKey: "userId" });
Post.belongsTo(Company, { foreignKey: "companyId" });
Post.hasMany(Attachment, { foreignKey: "postId" });
Post.hasMany(Interaction, { foreignKey: "postId" });

// Skill relationships
Skill.hasMany(SkillJob, { foreignKey: "skillId" });
Skill.hasMany(SkillUser, { foreignKey: "skillId" });
Skill.belongsToMany(Job, {
  through: SkillJob,
  foreignKey: "skillId",
  otherKey: "jobId",
});

// SkillJob relationships
SkillJob.belongsTo(Skill, { foreignKey: "skillId" });
SkillJob.belongsTo(Job, { foreignKey: "jobId" });

// SkillUser relationships
SkillUser.belongsTo(Skill, { foreignKey: "skillId" });
SkillUser.belongsTo(User, { foreignKey: "userId" });

// Review relationships
Review.belongsTo(User, { foreignKey: "userId" });
Review.belongsTo(Company, { foreignKey: "companyId" });

// Follow relationships
Follow.belongsTo(User, { foreignKey: "userId" });
Follow.belongsTo(Company, { foreignKey: "companyId" });

// Province relationships
Province.hasMany(Ward, { foreignKey: "provinceId" });

// Ward relationships
Ward.belongsTo(Province, { foreignKey: "provinceId" });
Ward.hasMany(Company, { foreignKey: "wardId" });

// Attachment relationships
Attachment.belongsTo(Post, { foreignKey: "postId" });
Attachment.belongsTo(Interaction, { foreignKey: "interactionId" });

// Interaction relationships
Interaction.belongsTo(Post, { foreignKey: "postId" });
Interaction.belongsTo(User, { foreignKey: "userId" });
Interaction.hasMany(Attachment, { foreignKey: "interactionId" });

// CompanyMember relationships
CompanyMember.belongsTo(Company, { foreignKey: "companyId" });
CompanyMember.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Company,
  Job,
  Application,
  Blog,
  BlogCategory,
  Post,
  Skill,
  SkillJob,
  SkillUser,
  Review,
  Follow,
  Province,
  Ward,
  Attachment,
  Interaction,
  CompanyMember,
};
