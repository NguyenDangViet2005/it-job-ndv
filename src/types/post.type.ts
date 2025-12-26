// Post Card Types
export interface PostCardData {
  id: number;
  author: string;
  avatar: string;
  role: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

export interface LikeState {
  [postId: number]: boolean;
}

export interface PostCardProps {
  post: PostCardData;
  toggleLike: (postId: number) => void;
  likeState: LikeState;
}
