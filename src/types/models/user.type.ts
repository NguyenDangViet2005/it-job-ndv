// User Model Types

export interface User {
  id: number;
  fullname: string;
  email: string;
  phone?: string;
  gender?: string;
  dateofbirth?: string;
  avatar?: string;
  coverimage?: string;
  address?: string;
  cvurl?: string;
  role: "user" | "employer" | "admin";
  createdat?: string;
  updatedat?: string;
}

export interface PostUser {
  id: number;
  fullname: string;
  avatar?: string;
}

export interface AdminUser {
  id: number;
  fullname: string;
  email: string;
  phone?: string;
  role: "user" | "employer" | "admin";
  avatar?: string;
  createdat: string;
  updatedat: string;
}
