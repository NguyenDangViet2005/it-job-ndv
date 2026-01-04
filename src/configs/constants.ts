/**
 * Application constants
 */

// User roles
export const USER_ROLES = {
  USER: "user",
  EMPLOYER: "employer",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Job status
export const JOB_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  CLOSED: "closed",
  DRAFT: "draft",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

// Application status
export const APPLICATION_STATUS = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  INTERVIEWED: "interviewed",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

// Job types
export const JOB_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

// Experience levels
export const EXPERIENCE_LEVELS = {
  INTERN: "intern",
  FRESHER: "fresher",
  JUNIOR: "junior",
  MIDDLE: "middle",
  SENIOR: "senior",
  LEAD: "lead",
} as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];

// Salary ranges (VND)
export const SALARY_RANGES = [
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
  { label: "30 - 50 triệu", min: 30000000, max: 50000000 },
  { label: "Trên 50 triệu", min: 50000000, max: 999999999 },
  { label: "Thỏa thuận", min: 0, max: 0 },
] as const;

// Post types
export const POST_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  LINK: "link",
} as const;

export type PostType = (typeof POST_TYPES)[keyof typeof POST_TYPES];

// File types
export const FILE_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  DOCUMENT: "document",
} as const;

export type FileType = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];

// Date formats
export const DATE_FORMATS = {
  FULL: "dd/MM/yyyy HH:mm:ss",
  DATE_ONLY: "dd/MM/yyyy",
  TIME_ONLY: "HH:mm:ss",
  MONTH_YEAR: "MM/yyyy",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_INFO: "userInfo",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  THEME: "theme",
  LANGUAGE: "language",
  RECENT_SEARCHES: "recentSearches",
  SAVED_JOBS: "savedJobs",
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: "Đăng nhập thành công!",
    REGISTER: "Đăng ký thành công!",
    UPDATE: "Cập nhật thành công!",
    DELETE: "Xóa thành công!",
    CREATE: "Tạo mới thành công!",
    SAVE: "Lưu thành công!",
    APPLY: "Ứng tuyển thành công!",
  },
  ERROR: {
    LOGIN: "Đăng nhập thất bại!",
    REGISTER: "Đăng ký thất bại!",
    UPDATE: "Cập nhật thất bại!",
    DELETE: "Xóa thất bại!",
    CREATE: "Tạo mới thất bại!",
    NETWORK: "Lỗi kết nối mạng!",
    UNAUTHORIZED: "Bạn không có quyền truy cập!",
    NOT_FOUND: "Không tìm thấy dữ liệu!",
    SERVER: "Lỗi máy chủ!",
  },
  WARNING: {
    UNSAVED_CHANGES: "Bạn có thay đổi chưa lưu!",
    CONFIRM_DELETE: "Bạn có chắc muốn xóa?",
  },
} as const;

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 50,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  POST_CONTENT_MAX_LENGTH: 5000,
  COMMENT_CONTENT_MAX_LENGTH: 1000,
  BIO_MAX_LENGTH: 500,
} as const;

// Default avatars
export const DEFAULT_AVATARS = {
  USER: "https://ui-avatars.com/api/?name=User&background=random&color=fff",
  COMPANY: "https://ui-avatars.com/api/?name=Company&background=random&color=fff",
} as const;

// Animation durations (milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Debounce delays (milliseconds)
export const DEBOUNCE = {
  SEARCH: 500,
  INPUT: 300,
  SCROLL: 100,
} as const;
