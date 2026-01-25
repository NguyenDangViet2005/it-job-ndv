// Application Model Types

import type { Job } from "./job.type";
import type { User } from "./user.type";

export interface Application {
  id?: string;
  jobId: number;
  userId: number;
  cvUrl?: string;
  coverLetter?: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, "id" | "fullName" | "email" | "phone" | "avatar">;
  job?: Pick<Job, "id" | "title">;
  jobTitle?: string;
  companyName?: string;
  companyLogo?: string;
  userFullName?: string;
  userEmail?: string;
}
