// Blog Model Types

export interface Blog {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  excerpt?: string;
  content: string;
  readTime?: string;
  image?: string;
  category?: string;
  author?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug?: string;
}
