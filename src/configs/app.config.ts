/**
 * Application-wide configuration
 */

export const APP_CONFIG = {
  // App metadata
  name: "IT Job Portal",
  description: "Nền tảng tìm việc IT hàng đầu Việt Nam",
  version: "1.0.0",
  
  // Environment
  env: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  
  // URLs
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  
  // Social links
  social: {
    facebook: "https://facebook.com/itjob",
    twitter: "https://twitter.com/itjob",
    linkedin: "https://linkedin.com/company/itjob",
    github: "https://github.com/itjob",
  },
  
  // App stores
  appStores: {
    playStore: "https://play.google.com",
    appStore: "https://www.apple.com/app-store/",
  },
  
  // Contact
  contact: {
    email: "support@itjob.vn",
    phone: "+84 123 456 789",
    address: "Đà Nẵng, Việt Nam",
  },
} as const;
