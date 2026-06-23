export interface Follow {
  id: number;
  userid: number;
  companyid: number;
  createdat: string;
  updatedat: string;
}

export interface FollowUser {
  id: number;
  fullname: string;
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
