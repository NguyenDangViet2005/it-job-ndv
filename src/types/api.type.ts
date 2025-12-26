// API Response Types
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

// Auth Types
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
}

// Register HR Request (Nhà tuyển dụng)
export interface RegisterHRRequest {
  // User Info
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  avatar?: string;
  coverImage?: string;

  // Company Info
  companyName: string;
  companyAvatar?: string;
  companyCoverImage?: string;
  companyNationality?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyFoundedYear?: number;
  companyAddress?: string;
  provinceId: number;
  wardId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  avatar?: string;
  coverImage?: string;
  address?: string;
  cvUrl?: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

// Company Response
export interface CompanyResponse {
  id: number;
  name: string;
  avatar?: string;
  coverImage?: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  address?: string;
  wardId?: number;
  wardName?: string;
  provinceName?: string;
  createdByUserId?: number;
  createdAt: string;
  updatedAt: string;
}

// Register HR Response
export interface RegisterHRResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
  company: CompanyResponse;
}

// Location Types
export interface ProvinceResponse {
  id: number;
  name: string;
}

export interface WardResponse {
  id: number;
  provinceId: number;
  name: string;
}

// Job Types
export interface JobRequest {
  companyId: number;
  title: string;
  description: string;
  type: string;
  quantity: number;
  deadline: string;
  status: string;
}

export interface JobResponse {
  id: number;
  title: string;
  description?: string;
  type: string;
  status: string;
  quantity: number;
  deadline: string;
  createdAt: string;
  company?: {
    id: number;
    name: string;
    avatar?: string;
    website?: string;
    address?: string;
    city?: string;
  };
  skills?: Array<{
    id: number;
    name: string;
  }>;
}

// Company Types
export interface CompanyRequest {
  name: string;
  avatar?: string;
  coverImage?: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
}

// Company Update Request for HR
export interface CompanyUpdateRequest {
  name: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  address?: string;
  wardId?: number;
}

export interface Company {
  id: number;
  name: string;
  avatar?: string;
  coverImage?: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  follows?: Array<{
    userId: number;
    companyId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  jobs?: Array<{
    id: number;
    companyId: number;
    title: string;
    description: string;
    type: string;
    quantity: number;
    deadline: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  posts?: any[];
  reviews?: Array<{
    id: number;
    userId: number;
    companyId: number;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

// Application Types
export interface Application {
  id: number;
  userId: number;
  jobId: number;
  status: string;
  appliedAt: string;
}

// Blog Types
export interface BlogCategoryResponse {
  id: number;
  name: string;
  slug: string;
}

export interface BlogRequest {
  userId: number;
  categoryId: number;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  image?: string;
}

export interface BlogResponse {
  id: number;
  userId: number;
  categoryId: number;
  categoryName?: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  image?: string;
  author?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

// Follow Types
export interface FollowRequest {
  userId: number;
  companyId: number;
}

export interface Follow {
  id: number;
  userId: number;
  companyId: number;
  followedAt: string;
}

// Post Types
export interface PostRequest {
  content: string;
  userId?: number;
  companyId?: number;
}

export interface PostUser {
  id: number;
  fullName: string;
  avatar?: string;
}

export interface PostCompany {
  id: number;
  name: string;
  avatar?: string;
  address?: string;
}

export interface PostInteraction {
  id: number;
  totalLikes: number;
  totalComments: number;
}

export interface PostResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: PostUser;
  company?: PostCompany;
  interaction: PostInteraction;
}

// Review Types
export interface CreateReviewRequest {
  rating: number;
  comment: string;
  companyId: number;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  companyId: number;
  companyName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Skill Types
export interface SkillRequest {
  name: string;
}

export interface Skill {
  id: number;
  name: string;
}

// Attachment Types
export interface AttachmentResponse {
  id: number;
  fileUrl: string;
  fileType: string; // "image" or "video"
}

// Interaction/Comment Types
export interface CommentResponse {
  id: number;
  user: PostUser;
  content: string;
  isLiked: boolean;
  createdAt: string;
  attachments: AttachmentResponse[];
}

export interface LikeResponse {
  postId: number;
  userId: number;
  isLiked: boolean;
  totalLikes: number;
}

// Extended Post Response with full interaction data
export interface FullPostResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: PostUser;
  company?: PostCompany;
  attachments: AttachmentResponse[];
  interaction: {
    totalLikes: number;
    totalComments: number;
    isLikedByCurrentUser: boolean;
    comments: CommentResponse[];
  };
}
