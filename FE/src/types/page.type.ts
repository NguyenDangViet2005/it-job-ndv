export interface SocialPlatform {
  name: string;
  icon: any;
  color: string;
  followers: number;
  engagement: number;
}

export interface SocialPost {
  id: number;
  platform: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
}
