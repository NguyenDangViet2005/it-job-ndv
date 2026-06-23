export interface Job {
  id: number;
  companyid: number;
  title: string;
  description?: string;
  type: string;
  status: string;
  quantity: number;
  deadline: string;
  salary?: string;
  location?: string;
  createdat: string;
  updatedat: string;
  applicationCount: number,
  company?: {
    id: number;
    name: string;
    avatar?: string;
    website?: string;
    address?: string;
    city?: string;
    memberCount?: number
  };
  skills?: Skill[];
}

export interface Skill {
  id: number;
  name: string;
}
