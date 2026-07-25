import { createSlugWithId } from "@/utils/string";

/**
 * Application routes configuration
 * Centralized route definitions for easy maintenance
 */

export const ROUTES = {
  // Public routes
  WELCOME: "/" as string,
  HOME: "/trang-chu",
  ABOUT: "/about",
  CONTACT: "/contact",

  // Auth routes
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  REGISTER_HR: "/dang-ky/nha-tuyen-dung",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ACCESS_DENIED: "/access-denied",

  // User routes
  PROFILE: (userid?: number | string) =>
    userid ? `/profile/${userid}` : "/profile",
  PROFILE_EDIT: "/profile/edit",

  // User Dashboard routes
  // User Dashboard routes
  USER_DASHBOARD: "/tong-quan",
  USER_RESUME: "/ho-so-cv",
  USER_APPLIED_JOBS: "/cong-viec-da-ung-tuyen",
  USER_SAVED_JOBS: "/saved-jobs",
  USER_MESSAGES: "/tin-nhan",
  USER_SETTINGS: "/cai-dat",
  USER_MY_BLOGS: "/bai-viet-cua-toi",

  // Job routes
  JOBS: "/viec-lam",
  JOB_DETAIL: (jobid: number | string, title?: string) =>
    title ? `/viec-lam/${createSlugWithId(title, jobid)}` : `/viec-lam/${jobid}`,
  JOB_SEARCH: "/tim-kiem",

  // Company routes
  COMPANIES: "/cong-ty",
  COMPANY_DETAIL: (companyid: number | string, name?: string) =>
    name ? `/cong-ty/${createSlugWithId(name, companyid)}` : `/cong-ty/${companyid}`,
  COMPANY_SEARCH: "/cong-ty/tim-kiem",

  // Blog routes
  BLOGS: "/bai-viet",
  BLOG_DETAIL: (blogId: number | string, title?: string) =>
    title ? `/bai-viet/${createSlugWithId(title, blogId)}` : `/bai-viet/${blogId}`,
  BLOG_CREATE: "/bai-viet/create",
  BLOG_EDIT: (blogId: number | string) => `/bai-viet/${blogId}/edit`,

  // Community routes
  QA: "/hoi-dap",
  NOTIFICATIONS: "/notifications",

  // Social routes
  SOCIAL: "/social",
  POST_DETAIL: (postid: number | string) => `/social/posts/${postid}`,

  // HR/Employer routes
  HR: "/hr/cong-ty",
  HR_JOBS: "/hr/tin-tuyen-dung",
  HR_JOB_CREATE: "/hr/tin-tuyen-dung/create",
  HR_JOB_EDIT: (jobid: number | string) => `/hr/tin-tuyen-dung/${jobid}/edit`,
  HR_CANDIDATES: "/hr/ung-vien",
  HR_COMPANY: "/hr/cong-ty",
  HR_BLOG: "/hr/bai-viet",
  HR_SETTINGS: "/hr/cai-dat",

  // Admin routes
  ADMIN: "/admin/tong-quan",
  ADMIN_DASHBOARD: "/admin/tong-quan",
  ADMIN_USERS: "/admin/nguoi-dung",
  ADMIN_COMPANIES: "/admin/cong-ty",
  ADMIN_JOBS: "/admin/tin-tuyen-dung",
  ADMIN_BLOGS: "/admin/bai-viet",
  ADMIN_SETTINGS: "/admin/cai-dat",

  // Error routes
  NOT_FOUND: "/not-found",
  UNAUTHORIZED: "/401",
  SERVER_ERROR: "/500",
} as const;

// Route groups for authorization
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.WELCOME,
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.REGISTER_HR,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.JOBS,
    ROUTES.COMPANIES,
    ROUTES.BLOGS,
    ROUTES.QA,
  ],

  USER: [
    ROUTES.PROFILE(),
    ROUTES.PROFILE_EDIT,
    ROUTES.USER_DASHBOARD,
    ROUTES.USER_RESUME,
    ROUTES.USER_APPLIED_JOBS,
    ROUTES.USER_SAVED_JOBS,
    ROUTES.USER_MESSAGES,
    ROUTES.USER_SETTINGS,
    ROUTES.USER_MY_BLOGS,
    ROUTES.SOCIAL,
    ROUTES.NOTIFICATIONS,
  ],

  HR: [
    ROUTES.HR,
    ROUTES.HR_JOBS,
    ROUTES.HR_JOB_CREATE,
    ROUTES.HR_CANDIDATES,
    ROUTES.HR_COMPANY,
    ROUTES.HR_BLOG,
    ROUTES.HR_SETTINGS,
  ],

  ADMIN: [
    ROUTES.ADMIN,
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_COMPANIES,
    ROUTES.ADMIN_JOBS,
    ROUTES.ADMIN_BLOGS,
    ROUTES.ADMIN_SETTINGS,
  ],
} as const;

// Helper function to check if route requires authentication
export const isProtectedRoute = (pathname: string): boolean => {
  return !ROUTE_GROUPS.PUBLIC.some((route) => pathname.startsWith(route));
};

// Helper function to check if route is for specific role
export const isRouteForRole = (
  pathname: string,
  role: "user" | "employer" | "admin",
): boolean => {
  switch (role) {
    case "admin":
      return ROUTE_GROUPS.ADMIN.some((route) => pathname.startsWith(route));
    case "employer":
      return ROUTE_GROUPS.HR.some((route) => pathname.startsWith(route));
    case "user":
      return ROUTE_GROUPS.USER.some((route) => pathname.startsWith(route));
    default:
      return false;
  }
};
