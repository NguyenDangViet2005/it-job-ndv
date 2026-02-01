// API Request & Response Types Only

import type { User } from "./models/user.type";
import type { Company } from "./models/company.type";
import type { Job } from "./models/job.type";
import type { Blog, BlogCategory } from "./models/blog.type";
import type { Post, Comment, Attachment, Like } from "./models/post.type";
import type { Review } from "./models/review.type";
import type { Application } from "./models/application.type";
import type { Province, Ward } from "./models/location.type";
import type { Follow } from "./models/follow.type";
import type { Skill } from "./models/job.type";

// Re-export commonly used types
export type { Company, Skill, Application };

// ============ Generic API Response Types ============
export interface ResponseData<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============ Auth Requests ============
export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
  phone: string;
  gender?: string;
  dateofbirth?: string;
}

export interface RegisterHRRequest {
  // User Info
  fullname: string;
  email: string;
  password: string;
  phone: string;
  gender?: string;
  dateofbirth?: string;
  avatar?: string;
  coverimage?: string;
  // Company Info
  companyName: string;
  companyAvatar?: string;
  companyCoverImage?: string;
  companyNationality?: string;
  companyWebsite?: string;
  companyHotline?: string;
  companyemail?: string;
  companyDescription?: string;
  companyFoundedYear?: number;
  companyAddress?: string;
  provinceid: number;
  wardid: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshtoken: string;
}

// ============ Auth Responses ============
export interface LoginResponse {
  accesstoken: string;
  refreshtoken: string;
  user: User;
}

export interface RegisterHRResponse {
  accesstoken: string;
  refreshtoken: string;
  user: User;
  company: Company;
}

// ============ User Responses ============
export type UserResponse = User;

// ============ Company Requests ============
export interface CompanyRequest {
  name: string;
  avatar?: string;
  coverimage?: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedyear?: number;
}

export interface CompanyUpdateRequest {
  name: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedyear?: number;
  address?: string;
  wardid?: number;
}

// ============ Company Responses ============
export type CompanyResponse = Company;

// ============ Job Requests ============
export interface JobRequest {
  companyid: number;
  title: string;
  description: string;
  type: string;
  quantity: number;
  deadline: string;
  salary?: string;
  status: string;
}

// ============ Job Responses ============
export type JobResponse = Job;

// ============ Blog Requests ============
export interface BlogRequest {
  userid: number;
  categoryid: number;
  title: string;
  excerpt: string;
  content: string;
  readtime: string;
  image?: string;
}

// ============ Blog Responses ============
export type BlogResponse = Blog;
export type BlogCategoryResponse = BlogCategory;

// ============ Post Requests ============
export interface PostRequest {
  content: string;
  userid?: number;
  companyid?: number;
}

// ============ Post Responses ============
export type PostResponse = Post;
export type FullPostResponse = Post;
export type CommentResponse = Comment;
export type AttachmentResponse = Attachment;
export type LikeResponse = Like;

// ============ Review Requests ============
export interface CreateReviewRequest {
  rating: number;
  comment: string;
  companyid: number;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

// ============ Review Responses ============
export type ReviewResponse = Review;

// ============ Application Requests ============
export interface ApplicationRequest {
  jobid: number;
  userid: number;
  cvurl: string;
  coverletter: string;
}

// ============ Application Responses ============
export type ApplicationResponse = Application;

// ============ Location Responses ============
export type ProvinceResponse = Province;
export type WardResponse = Ward;

// ============ Follow Requests ============
export interface FollowRequest {
  userid: number;
  companyid: number;
}

// ============ Follow Responses ============
export type FollowResponse = Follow;

// ============ Skill Requests ============
export interface SkillRequest {
  name: string;
}

// ============ Skill Responses ============
export type SkillResponse = Skill;
