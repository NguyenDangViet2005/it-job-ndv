"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Social Media Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your social media presence across platforms
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {platforms.map((platform, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl bg-opacity-10", `bg-${platform.color}`)}>
                  <platform.icon className={cn("h-6 w-6", platform.color)} />
                </div>
                <Badge variant="outline" className="font-mono text-green-600">
                  {platform.growth}
                </Badge>
              </div>
              <h3 className="font-bold text-lg mb-1">{platform.name}</h3>
              <p className="text-2xl font-bold mb-2">{platform.followers}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Engagement</span>
                  <span className="font-semibold">{platform.engagement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Posts</span>
                  <span className="font-semibold">{platform.posts}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                <ExternalLink className="h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Total Reach
                </p>
                <p className="text-3xl font-bold mt-2">186K</p>
              </div>
              <Eye className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Engagement
                </p>
                <p className="text-3xl font-bold mt-2">12.4K</p>
              </div>
              <Heart className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  New Followers
                </p>
                <p className="text-3xl font-bold mt-2">+2.8K</p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Avg. Growth
                </p>
                <p className="text-3xl font-bold mt-2">+12.6%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono">
                            {post.platform}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {post.timestamp}
                          </span>
                        </div>
                        <p className="text-sm">{post.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{post.reach.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Share2 className="h-4 w-4" />
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
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Schedule Posts</h3>
            <p className="text-sm text-muted-foreground">
              Plan and schedule your social media content
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              View detailed analytics and insights
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Audience</h3>
            <p className="text-sm text-muted-foreground">
              Understand your audience demographics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMedia;
