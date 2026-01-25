// Post Model Types

import type { PostUser } from "./user.type";
import type { PostCompany } from "./company.type";

export interface Post {
  id: number;
  content: string;
  userId?: number;
  companyId?: number;
  createdAt: string;
  updatedAt: string;
  user?: PostUser;
  company?: PostCompany;
  attachments: Attachment[];
  interaction: PostInteraction;
}

export interface PostInteraction {
  totalLikes: number;
  totalComments: number;
  isLikedByCurrentUser?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  user: PostUser;
  content: string;
  isLiked: boolean;
  createdAt: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  fileUrl: string;
  fileType: "image" | "video" | "audio" | "file";
}

export interface Like {
  postId: number;
  userId: number;
  isLiked: boolean;
  totalLikes: number;
}
