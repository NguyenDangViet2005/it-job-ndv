// User Model Types

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  avatar?: string;
  coverImage?: string;
  address?: string;
  cvUrl?: string;
  role: "user" | "employer" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface PostUser {
  id: number;
  fullName: string;
  avatar?: string;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "employer" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
