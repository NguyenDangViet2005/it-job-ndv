// Page Props Types - Props for page components

import type { Company } from "./models/company.type"; 

// ============ User Pages ============
export interface ProfilePageProps {
  userId?: string;
}

export interface JobDetailPageProps {
  jobId: string;
}

export interface BlogDetailPageProps {
  id: string;
}

export interface CompanyDetailPageProps {
  company: Company;
}

// ============ Admin Pages ============
export interface SocialPlatform {
  name: string;
  icon: any;
  color: string;
  followers: number;
  engagement: number;
}

export interface SocialPost {
  id: number;
  platform: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
}
