/**
 * Feature flags configuration
 * Enable/disable features without code changes
 */

export const FEATURES = {
  // Social features
  social: {
    enabled: true,
    posts: {
      enabled: true,
      allowImages: true,
      allowVideos: true,
      maxImages: 5,
      maxVideos: 1,
    },
    comments: {
      enabled: true,
      allowAttachments: true,
      maxAttachments: 4,
    },
    likes: {
      enabled: true,
    },
    shares: {
      enabled: true,
    },
  },
  
  // Blog features
  blog: {
    enabled: true,
    allowUserBlogs: true,
    allowCompanyBlogs: true,
    requireApproval: false,
  },
  
  // Job features
  job: {
    enabled: true,
    allowSaveJobs: true,
    allowQuickApply: true,
    showSalary: true,
    showCompanyInfo: true,
  },
  
  // Company features
  company: {
    enabled: true,
    allowFollow: true,
    allowReviews: true,
    showRatings: true,
  },
  
  // Search features
  search: {
    enabled: true,
    advancedFilters: true,
    saveSearches: true,
    searchSuggestions: true,
  },
  
  // Notification features
  notifications: {
    enabled: true,
    email: true,
    push: false,
    inApp: true,
  },
  
  // Chat features
  chat: {
    enabled: false,
    directMessages: false,
    groupChats: false,
  },
  
  // Analytics
  analytics: {
    enabled: true,
    googleAnalytics: false,
    mixpanel: false,
  },
  
  // Payment features
  payment: {
    enabled: false,
    premiumJobs: false,
    featuredCompanies: false,
  },
  
  // Admin features
  admin: {
    enabled: true,
    userManagement: true,
    companyManagement: true,
    jobManagement: true,
    blogManagement: true,
    socialManagement: true,
    analytics: true,
  },
} as const;

// Helper function to check if feature is enabled
export const isFeatureEnabled = (featurePath: string): boolean => {
  const keys = featurePath.split(".");
  let current: any = FEATURES;
  
  for (const key of keys) {
    if (current[key] === undefined) return false;
    current = current[key];
  }
  
  return current === true;
};

// Examples:
// isFeatureEnabled("social.enabled") => true
// isFeatureEnabled("social.posts.allowVideos") => true
// isFeatureEnabled("chat.enabled") => false
