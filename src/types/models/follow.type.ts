// Follow Model Types

export interface Follow {
  id: number;
  userId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUser {
  id: number;
  fullName: string;
  avatar?: string;
  role?: string;
  company?: string;
}

export interface FollowCompany {
  id: number;
  name: string;
  avatar?: string;
  industry?: string;
  followers?: number;
}
