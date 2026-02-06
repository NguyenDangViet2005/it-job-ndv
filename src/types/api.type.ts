// API Request & Response Types Only

import type { User } from "./models/user.type";
import type { Company } from "./models/company.type";


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

// ============ Post Requests ============
export interface PostRequest {
  content: string;
  userid?: number;
  companyid?: number;
}

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


// ============ Application Requests ============
export interface ApplicationRequest {
  jobid: number;
  userid: number;
  cvurl: string;
  coverletter: string;
}


// ============ Follow Requests ============
export interface FollowRequest {
  userid: number;
  companyid: number;
}


// ============ Skill Requests ============
export interface SkillRequest {
  name: string;
}

