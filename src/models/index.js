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
const Connection = require("./connection.model");
const Province = require("./province.model");
const Ward = require("./ward.model");
const Attachment = require("./attachment.model");
const Interaction = require("./interaction.model");
const CompanyMember = require("./company-member.model");
const SessionLogin = require("./session-login.model");

// ========== RELATIONSHIPS ==========

// User relationships
User.hasMany(Application, { foreignKey: "userid" });
User.hasMany(Blog, { foreignKey: "userid" });
User.hasMany(Company, { foreignKey: "createdbyuserid" });
User.hasMany(CompanyMember, { foreignKey: "userid" });
User.hasMany(Follow, { foreignKey: "userid" });
User.hasMany(Interaction, { foreignKey: "userid" });
User.hasMany(Post, { foreignKey: "userid" });
User.hasMany(Review, { foreignKey: "userid" });
User.hasMany(SkillUser, { foreignKey: "userid" });
User.hasMany(Connection, { foreignKey: "userid", as: "SentConnections" });
User.hasMany(Connection, {
  foreignKey: "connecteduserid",
  as: "ReceivedConnections",
});
User.hasMany(SessionLogin, { foreignKey: "userid" });

// Company relationships
Company.belongsTo(User, { foreignKey: "createdbyuserid" });
Company.belongsTo(Ward, { foreignKey: "wardid" });
Company.hasMany(CompanyMember, { foreignKey: "companyid" });
Company.hasMany(Follow, { foreignKey: "companyid" });
Company.hasMany(Job, { foreignKey: "companyid" });
Company.hasMany(Post, { foreignKey: "companyid" });
Company.hasMany(Review, { foreignKey: "companyid" });

// Job relationships
Job.belongsTo(Company, { foreignKey: "companyid" });
Job.hasMany(Application, { foreignKey: "jobid" });
Job.hasMany(SkillJob, { foreignKey: "jobid" });
Job.belongsToMany(Skill, {
  through: SkillJob,
  foreignKey: "jobid",
  otherKey: "skillid",
});

// Application relationships
Application.belongsTo(Job, { foreignKey: "jobid" });
Application.belongsTo(User, { foreignKey: "userid" });

// Blog relationships
Blog.belongsTo(User, { foreignKey: "userid" });
Blog.belongsTo(BlogCategory, { foreignKey: "categoryid" });

// BlogCategory relationships
BlogCategory.hasMany(Blog, { foreignKey: "categoryid" });

// Post relationships
Post.belongsTo(User, { foreignKey: "userid" });
Post.belongsTo(Company, { foreignKey: "companyid" });
Post.hasMany(Attachment, { foreignKey: "postid" });
Attachment.belongsTo(Post, { foreignKey: "postid" });
Post.hasMany(Interaction, { foreignKey: "postid" });

// Skill relationships
Skill.hasMany(SkillJob, { foreignKey: "skillid" });
Skill.hasMany(SkillUser, { foreignKey: "skillid" });
Skill.belongsToMany(Job, {
  through: SkillJob,
  foreignKey: "skillid",
  otherKey: "jobid",
});

// SkillJob relationships
SkillJob.belongsTo(Skill, { foreignKey: "skillid" });
SkillJob.belongsTo(Job, { foreignKey: "jobid" });

// SkillUser relationships
SkillUser.belongsTo(Skill, { foreignKey: "skillid" });
SkillUser.belongsTo(User, { foreignKey: "userid" });

// Review relationships
Review.belongsTo(User, { foreignKey: "userid" });
Review.belongsTo(Company, { foreignKey: "companyid" });

// Follow relationships
Follow.belongsTo(User, { foreignKey: "userid" });
Follow.belongsTo(Company, { foreignKey: "companyid" });

// Province relationships
Province.hasMany(Ward, { foreignKey: "provinceid" });

// Ward relationships
Ward.belongsTo(Province, { foreignKey: "provinceid" });
Ward.hasMany(Company, { foreignKey: "wardid" });

// Attachment relationships
Attachment.belongsTo(Post, { foreignKey: "postid" });
Attachment.belongsTo(Interaction, { foreignKey: "interactionid" });

// Interaction relationships
Interaction.belongsTo(Post, { foreignKey: "postid" });
Interaction.belongsTo(User, { foreignKey: "userid" });
Interaction.hasMany(Attachment, { foreignKey: "interactionid" });

// CompanyMember relationships
CompanyMember.belongsTo(Company, { foreignKey: "companyid" });
CompanyMember.belongsTo(User, { foreignKey: "userid" });

// Connection relationships
Connection.belongsTo(User, { foreignKey: "userid", as: "User" });
Connection.belongsTo(User, {
  foreignKey: "connecteduserid",
  as: "ConnectedUser",
});

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
  Connection,
  Province,
  Ward,
  Attachment,
  Interaction,
  CompanyMember,
  SessionLogin,
};
