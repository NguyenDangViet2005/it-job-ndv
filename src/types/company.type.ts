
export interface CompanyJob {
  id: string;
  slug: string;
  title: string;
  level:
    | "Intern"
    | "Fresher"
    | "Junior"
    | "Mid"
    | "Senior"
    | "Lead"
    | "Manager";
  salary: string;
  workType:
    | "Full-time"
    | "Part-time"
    | "Remote"
    | "Hybrid"
    | "Contract"
    | "Freelance";
  location: string;
  techStack: string[];
  createdAt: string;
  applications?: number;
  description?: string;
}

export interface CompanyLocation {
  id: string;
  address: string;
  city: string;
  country: string;
  isPrimary?: boolean;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  coverUrl?: string;
  shortDescription: string;
  description: string;

  // Basic Info
  type: "Product" | "Outsourcing" | "Startup" | "Corporation" | "Agency";
  size: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  foundedAt?: string;

  // Contact
  website?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  linkedin?: string;

  // Tech & Jobs
  techStack: string[];
  openJobsCount: number;
  jobs?: CompanyJob[];

  // Locations
  location: string; // Primary location
  locations?: CompanyLocation[];

  // Social
  followers?: number;
  isFollowing?: boolean;

  // Gallery
  images?: string[];

  // Stats
  rating?: number;
  reviews?: number;
  reviewList?: Review[];
}

export interface Review {
  id: number;
  userId: number;
  userName: string; // Joined from User table
  userAvatar?: string; // Joined from User table
  companyId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFilters {
  search?: string;
  location?: string;
  size?: string;
  type?: string;
  techStack?: string[];
}
