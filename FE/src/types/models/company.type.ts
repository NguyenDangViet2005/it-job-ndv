import { Job } from "./job.type";

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
  wardname?: string;
  provincename?: string;
  createdbyuserid?: number;
  createdat?: string;
  updatedat?: string;
  follows?: CompanyFollow[];
  members?: CompanyMember[];
  membersCount?: number;
  jobs?: Job[];
  posts?: any[];
  reviews?: CompanyReview[];
}

export interface CompanyFollow {
  userid: number;
  companyid: number;
  createdat: string;
  updatedat: string;
}

export interface CompanyMember {
  companyid: number;
  userid: number;
  status: string;
  joinedat: string;
  createdat: string;
  updatedat?: string;
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
  avatar?: string;
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
