// Review Model Types

export interface Review {
  id: number;
  userId: number;
  userName?: string;
  userAvatar?: string;
  companyId: number;
  companyName?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
