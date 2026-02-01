import type {
  FullPostResponse,
  CommentResponse,
  AttachmentResponse,
} from "@/types/api.type";

// Legacy types for backward compatibility
export interface LegacyComment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface LegacyPost {
  id: number;
  author?: string;
  avatar?: string;
  role?: string;
  timestamp?: string;
  title?: string;
  content: string;
  image?: string;
  images?: string[];
  video?: string;
  attachments?: AttachmentResponse[];
  likes: number;
  liked: boolean;
  comments: LegacyComment[];
  totalComments?: number;
  showComments?: boolean;
  shares?: number;
  interaction?: {
    totalLikes: number;
    totalComments: number;
    islikedByCurrentUser?: boolean;
    comments?: any[];
  };
}

// Union type for both formats
export type PostType =
  | LegacyPost
  | (FullPostResponse & {
      showComments?: boolean;
      title?: string;
      images?: string[];
      video?: string;
      likes?: number;
      liked?: boolean;
      totalComments?: number;
      shares?: number;
    });

export interface PostCardProps {
  post: PostType;
  index?: number;
  currentUserAvatar?: string;
  currentUserName?: string;
  currentUserId?: number;
  isSaved?: boolean;
  onLikePost: (postid: number) => void;
  onToggleComments: (postid: number) => void;
  onAddComment: (postid: number, content: string, attachments?: File[]) => void;
  onEditComment?: (
    commentId: number,
    content: string,
    attachments?: File[],
  ) => void;
  onDeleteComment?: (commentId: number) => void;
  onLoadMoreComments?: (postid: number) => Promise<void>;
  onSavePost?: (postid: number) => void;
  onReportPost?: (postid: number) => void;
  onEditPost?: (postid: number) => void;
  onDeletePost?: (postid: number) => void;
  loadingComments?: boolean;
}

export interface NormalizedPost {
  id: number;
  userid?: number;
  author: string;
  avatar?: string;
  role?: string;
  timestamp: string;
  title?: string;
  content: string;
  image?: string;
  images: string[];
  video?: string;
  likes: number;
  liked: boolean;
  comments: Array<{
    id: number;
    userid?: number;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    attachments?: AttachmentResponse[];
  }>;
  totalComments: number;
  showComments: boolean;
  shares: number;
}

// Helper functions
export const getAttachmentsArray = (attachments: any): AttachmentResponse[] => {
  if (!attachments) return [];
  if (Array.isArray(attachments)) return attachments;
  if (attachments.$values && Array.isArray(attachments.$values)) {
    return attachments.$values;
  }
  return [];
};

export const getCommentsArray = (comments: any): CommentResponse[] => {
  if (!comments) return [];
  if (Array.isArray(comments)) return comments;
  if (comments.$values && Array.isArray(comments.$values)) {
    return comments.$values;
  }
  return [];
};

export const isApiPost = (
  p: PostType,
): p is FullPostResponse & { showComments?: boolean } => {
  return "interaction" in p || "user" in p || "attachments" in p;
};
