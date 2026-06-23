export interface Blog {
  id: number;
  userid: number;
  categoryid: number;
  title: string;
  excerpt?: string;
  content: string;
  readtime?: string;
  image?: string;
  avatar?: string;
  category?: string;
  author?: string;
  views?: number;
  createdat: string;
  updatedat: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug?: string;
}
