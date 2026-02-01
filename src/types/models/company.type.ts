// Company Model Types

export interface Company {
  id: number;
  name: string;
  avatar?: string;
  coverimage?: string;
  nationality?: string;
  website?: string;
  description?: string;
  foundedyear?: number;
  address?: string;
  hotline?: string;
  companyemail?: string;
  city?: string;
  country?: string;
  phone?: string;
  wardid?: number;
  wardName?: string;
  provinceName?: string;
  createdbyuserid?: number;
  createdat?: string;
  updatedat?: string;
  follows?: CompanyFollow[];
  members?: any[];
  membersCount?: number;
  jobs?: CompanyJob[];
  posts?: any[];
  reviews?: CompanyReview[];
}

export interface CompanyFollow {
  userid: number;
  companyid: number;
  createdat: string;
  updatedat: string;
}

export interface CompanyJob {
  id: number;
  companyid: number;
  title: string;
  description: string;
  type: string;
  quantity: number;
  deadline: string;
  status: string;
  createdat: string;
  updatedat: string;
}

export interface CompanyReview {
  id: number;
  userid: number;
  companyid: number;
  rating: number;
  comment: string;
  createdat: string;
  updatedat: string;
}

export interface PostCompany {
  id: number;
  name: string;
  avatar?: string;
  address?: string;
  hotline?: string;
  companyemail?: string;
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
