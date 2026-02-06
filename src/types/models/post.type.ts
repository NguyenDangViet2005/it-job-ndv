import type { PostUser } from "./user.type";
import type { PostCompany } from "./company.type";

export interface Post {
  id: number;
  content: string;
  userid?: number;
  companyid?: number;
  createdat: string;
  updatedat: string;
  user?: PostUser;
  company?: PostCompany;
  attachments: Attachment[];
  interaction: PostInteraction;
}

export interface PostInteraction {
  totalLikes: number;
  totalComments: number;
  islikedByCurrentUser?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  user: PostUser;
  content: string;
  isliked: boolean;
  createdat: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  fileurl: string;
  filetype: "image" | "video" | "audio" | "file";
}

export interface Like {
  postid: number;
  userid: number;
  isliked: boolean;
  totalLikes: number;
}
