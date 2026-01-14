/**
 * API configuration
 */

export const API_CONFIG = {
  // Base endpoint
  baseUrl: process.env.NEXT_PUBLIC_BE_ENDPOINT || "https://localhost:8081",
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
    allowedDocumentTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxImagesPerPost: 5,
    maxVideosPerPost: 1,
  },
};
