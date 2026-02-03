"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  TrendingUp,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Calendar,
  Plus,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialPlatform {
  name: string;
  icon: any;
  color: string;
  followers: string;
  engagement: string;
  posts: number;
  growth: string;
}

interface SocialPost {
  id: number;
  platform: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

const SocialMedia = () => {
  const platforms: SocialPlatform[] = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      followers: "45.2K",
      engagement: "4.8%",
      posts: 234,
      growth: "+12%"
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-sky-500",
      followers: "28.5K",
      engagement: "3.2%",
      posts: 456,
      growth: "+8%"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
      followers: "67.8K",
      engagement: "6.1%",
      posts: 189,
      growth: "+15%"
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
      followers: "32.1K",
      engagement: "5.4%",
      posts: 312,
      growth: "+10%"
    },
    {
      name: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      followers: "12.4K",
      engagement: "7.2%",
      posts: 45,
      growth: "+18%"
    },
  ];

  const recentPosts: SocialPost[] = [
    {
      id: 1,
      platform: "LinkedIn",
      content: "We're hiring! Join our team as a Senior Full Stack Developer. Apply now!",
      timestamp: "2 hours ago",
      likes: 234,
      comments: 45,
      shares: 67,
      reach: 12500
    },
    {
      id: 2,
      platform: "Facebook",
      content: "Check out our latest blog post: How to Ace Your Technical Interview",
      timestamp: "5 hours ago",
      likes: 189,
      comments: 23,
      shares: 34,
      reach: 8900
    },
    {
      id: 3,
      platform: "Twitter",
      content: "Top 10 Programming Languages in 2025 - What's your favorite? 🚀",
      timestamp: "1 day ago",
      likes: 456,
      comments: 89,
      shares: 123,
      reach: 15600
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case "Twitter":
        return <Twitter className="h-4 w-4 text-sky-500" />;
      case "LinkedIn":
        return <Linkedin className="h-4 w-4 text-blue-700" />;
      case "Instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "YouTube":
        return <Youtube className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Social Media Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your social media presence across platforms
          </p>
        </div>
        <Button className="gap-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {platforms.map((platform, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <platform.icon className={cn("h-5 w-5", platform.color)} />
                </div>
                <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  {platform.growth}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1 text-slate-900 dark:text-slate-100">{platform.name}</h3>
              <p className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{platform.followers}</p>
              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Engagement</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{platform.engagement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Posts</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{platform.posts}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 gap-2 text-xs h-8 border-slate-200 dark:border-slate-700">
                <ExternalLink className="h-3 w-3" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Total Reach
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">186K</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Engagement
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12.4K</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Heart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  New Followers
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">+2.8K</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Avg. Growth
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">+12.6%</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-700">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {post.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{post.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.reach.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        <span>{post.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">Schedule Posts</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Plan and schedule your social media content
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">Analytics</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              View detailed analytics and insights
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">Audience</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Understand your audience demographics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMedia;
