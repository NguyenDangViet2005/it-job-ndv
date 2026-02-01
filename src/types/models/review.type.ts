// Review Model Types

export interface Review {
  id: number;
  userid: number;
  userName?: string;
  userAvatar?: string;
  companyid: number;
  companyName?: string;
  rating: number;
  comment: string;
  createdat: string;
  updatedat: string;
}
