/**
 * API configuration
 */

export const API_CONFIG = {
  // Base endpoint
  baseUrl: process.env.NEXT_PUBLIC_BE_ENDPOINT || "https://localhost:7030",
  
  // Timeout settings (milliseconds)
  timeout: 30000, // 30 seconds
  
  // Retry settings
  retry: {
    maxAttempts: 3,
    delay: 1000, // 1 second
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },
  
  // File upload settings
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    allowedVideoTypes: ["video/mp4", "video/webm"],
    allowedDocumentTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    maxImagesPerPost: 5,
    maxVideosPerPost: 1,
  },
  
  // API endpoints
  endpoints: {
    // Auth
    auth: {
      login: "/api/auth/login",
      register: "/api/auth/register",
      logout: "/api/auth/logout",
      refresh: "/api/auth/refresh",
      forgotPassword: "/api/auth/forgot-password",
      resetPassword: "/api/auth/reset-password",
    },
    
    // User
    user: {
      profile: "/api/users",
      avatar: "/api/users/:id/avatar",
      coverImage: "/api/users/:id/cover-image",
      cv: "/api/users/:id/cv",
    },
    
    // Job
    job: {
      list: "/api/jobs",
      detail: "/api/jobs/:id",
      apply: "/api/jobs/:id/apply",
      save: "/api/jobs/:id/save",
    },
    
    // Company
    company: {
      list: "/api/companies",
      detail: "/api/companies/:id",
      follow: "/api/companies/:id/follow",
    },
    
    // Post (Social)
    post: {
      list: "/api/posts",
      detail: "/api/posts/:id",
      create: "/api/posts",
      update: "/api/posts/:id",
      delete: "/api/posts/:id",
      like: "/api/posts/:id/like",
      comment: "/api/posts/:id/comment",
    },
    
    // Blog
    blog: {
      list: "/api/blogs",
      detail: "/api/blogs/:id",
      create: "/api/blogs",
      update: "/api/blogs/:id",
      delete: "/api/blogs/:id",
    },
    
    // Application
    application: {
      list: "/api/applications",
      detail: "/api/applications/:id",
      update: "/api/applications/:id",
    },
    
    // Review
    review: {
      list: "/api/reviews",
      create: "/api/reviews",
    },
    
    // Search
    search: {
      jobs: "/api/search/jobs",
      companies: "/api/search/companies",
      users: "/api/search/users",
    },
    
    // Location
    location: {
      provinces: "/api/locations/provinces",
      districts: "/api/locations/districts",
    },
    
    // Skill
    skill: {
      list: "/api/skills",
    },
  },
} as const;
