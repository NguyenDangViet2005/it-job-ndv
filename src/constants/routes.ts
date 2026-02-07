/**
 * Application routes configuration
 * Centralized route definitions for easy maintenance
 */

export const ROUTES = {
  // Public routes
  WELCOME: "/" as string,
  HOME: "/home",
  ABOUT: "/about",
  CONTACT: "/contact",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_HR: "/register/hr",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ACCESS_DENIED: "/access-denied",

  // User routes
  PROFILE: (userid?: number | string) =>
    userid ? `/profile/${userid}` : "/profile",
  PROFILE_EDIT: "/profile/edit",

  // User Dashboard routes
  USER_DASHBOARD: "/dashboard",
  USER_RESUME: "/resume",
  USER_APPLIED_JOBS: "/applied-jobs",
  USER_SAVED_JOBS: "/saved-jobs",
  USER_MESSAGES: "/messages",
  USER_SETTINGS: "/settings",
  USER_MY_BLOGS: "/my-blogs",

  // Job routes
  JOBS: "/jobs",
  JOB_DETAIL: (jobid: number | string) => `/jobs/${jobid}`,
  JOB_SEARCH: "/jobs/search",

  // Company routes
  COMPANIES: "/companies",
  COMPANY_DETAIL: (companyid: number | string) => `/companies/${companyid}`,
  COMPANY_SEARCH: "/companies/search",

  // Blog routes
  BLOGS: "/blog",
  BLOG_DETAIL: (blogId: number | string) => `/blog/${blogId}`,
  BLOG_CREATE: "/blog/create",
  BLOG_EDIT: (blogId: number | string) => `/blog/${blogId}/edit`,

  // Community routes
  QA: "/QA",
  NOTIFICATIONS: "/notifications",

  // Social routes
  SOCIAL: "/social",
  POST_DETAIL: (postid: number | string) => `/social/posts/${postid}`,

  // HR/Employer routes
  HR: "/hr/company",
  HR_JOBS: "/hr/jobs",
  HR_JOB_CREATE: "/hr/jobs/create",
  HR_JOB_EDIT: (jobid: number | string) => `/hr/jobs/${jobid}/edit`,
  HR_CANDIDATES: "/hr/candidates",
  HR_COMPANY: "/hr/company",
  HR_BLOG: "/hr/blog",
  HR_SETTINGS: "/hr/settings",

  // Admin routes
  ADMIN: "/admin/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_COMPANIES: "/admin/company",
  ADMIN_JOBS: "/admin/jobs",
  ADMIN_BLOGS: "/admin/blog",
  ADMIN_SETTINGS: "/admin/settings",

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
