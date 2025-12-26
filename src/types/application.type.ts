// Application Types
export interface ApplicationRequest {
  jobId: number;
  userId: number;
  cvUrl: string;
  coverLetter: string;
}

export interface ApplicationResponse {
  $id?: string;
  jobId: number;
  userId: number;
  cvUrl: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  userFullName: string;
  userEmail: string;
}
