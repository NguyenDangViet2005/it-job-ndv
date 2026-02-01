// Application Model Types

import type { Job } from "./job.type";
import type { User } from "./user.type";

export interface Application {
  id?: string;
  jobid: number;
  userid: number;
  cvurl?: string;
  coverletter?: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdat: string;
  updatedat: string;
  user?: Pick<User, "id" | "fullname" | "email" | "phone" | "avatar">;
  job?: Pick<Job, "id" | "title">;
  jobTitle?: string;
  companyName?: string;
  companyLogo?: string;
  userfullname?: string;
  userEmail?: string;
}
