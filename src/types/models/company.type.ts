// Company Model Types

export interface Company {
  id: number;
  name: string;
  avatar?: string;
  coverImage?: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  address?: string;
  hotline?: string;
  companyEmail?: string;
  city?: string;
  country?: string;
  phone?: string;
  wardId?: number;
  wardName?: string;
  provinceName?: string;
  createdByUserId?: number;
  createdAt?: string;
  updatedAt?: string;
  follows?: CompanyFollow[];
  members?: any[];
  membersCount?: number;
  jobs?: CompanyJob[];
  posts?: any[];
  reviews?: CompanyReview[];
}

export interface CompanyFollow {
  userId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyJob {
  id: number;
  companyId: number;
  title: string;
  description: string;
  type: string;
  quantity: number;
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyReview {
  id: number;
  userId: number;
  companyId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostCompany {
  id: number;
  name: string;
  avatar?: string;
  address?: string;
  hotline?: string;
  companyEmail?: string;
}

export interface CompanyLogo {
  id: number;
  name: string;
  avatar: string;
}

export interface CompanyLocation {
  id: string;
  address: string;
  city: string;
  country: string;
  isPrimary?: boolean;
}

export interface CompanyFilters {
  search?: string;
  location?: string;
  size?: string;
  type?: string;
  techStack?: string[];
}
