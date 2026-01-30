// Job Model Types

export interface Job {
  id: number;
  companyId: number;
  title: string;
  description?: string;
  type: string;
  status: string;
  quantity: number;
  deadline: string;
  salary?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: number;
    name: string;
    avatar?: string;
    website?: string;
    address?: string;
    city?: string;
  };
  skills?: Skill[];
}

export interface Skill {
  id: number;
  name: string;
}
