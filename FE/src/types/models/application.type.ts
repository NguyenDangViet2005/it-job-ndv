import type { Job } from "./job.type";
import type { User } from "./user.type";

export interface Application {
  id: string;
  jobid: number;
  userid: number;
  cvurl: string;
  coverletter: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdat: string;
  updatedat: string;
  job?: Pick<Job, "id" | "title">;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  userfullname: string;
  userEmail: string;
  userAvatar: string;
}
