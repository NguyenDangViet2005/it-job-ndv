const Routes = {
  welcome: "/",
  home: "/home",
  about: "/about",
  contact: "/contact",
  login: "/login",
  register: "/register",
  registerHR: "/register/hr",
  accessDenied: "/access-denied",

  // User routes
  profile: (userId: string | number) => `/profile/${userId}`,
  profileEdit: "/profile/edit",

  // Dashboard routes (employee)
  dashboard: "/user",
  dashboardResume: "/user/resume",
  dashboardAppliedJobs: "/user/applied-jobs",
  dashboardSavedJobs: "/user/saved-jobs",
  dashboardMessages: "/user/messages",
  dashboardSettings: "/user/settings",
  dashboardMyBlogs: "/user/my-blogs",

  // HR routes (employer)
  hr: "/hr",
  hrDashboard: "/hr/dashboard",
  hrJobs: "/hr/jobs",
  hrJobCreate: "/hr/jobs/create",
  hrCandidates: "/hr/candidates",
  hrCompany: "/hr/company",
  hrBlog: "/hr/blog",
  hrSettings: "/hr/settings",

  // Admin routes
  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminCompanies: "/admin/companies",
  adminJobs: "/admin/jobs",
  adminSettings: "/admin/settings",

  // Job routes
  jobs: "/jobs",
  jobDetail: (id: string) => `/jobs/${id}`,

  // Community routes
  qa: "/QA",
  blog: "/blog",
  notifications: "/notifications",

  // Company routes
  companies: "/companies",
};

export default Routes;
