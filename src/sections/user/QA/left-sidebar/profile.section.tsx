"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { Users, Bookmark, TrendingUp, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth.provider";
import Link from "next/link";

export default function ProfileSection() {
  const { user, loading } = useAuth();

  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border-border/50">
        <div className="h-14 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <CardContent className="p-4 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/50">
      {/* Cover Image */}
      <div
        className="h-14 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent bg-cover bg-center"
        style={{
          backgroundImage: user?.coverImage
            ? `url(${user.coverImage})`
            : undefined,
        }}
      />

      <CardContent className="p-0">
        {/* Avatar & Info */}
        <div className="px-4 -mt-7 pb-3">
          <Link href={`/profile/${user?.id}`} className="cursor-target">
            <Avatar className="h-14 w-14 ring-4 ring-background border border-border/50 cursor-target hover:ring-primary/50 transition-all">
              <AvatarImage
                src={user?.avatar || "/default-avatar.png"}
                alt={user?.fullName || "User"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <Link href={`/profile/${user?.id}`} className="cursor-target hover:underline">
            <h3 className="font-semibold text-sm mt-2">
              {user?.fullName || "Người dùng"}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground">
            {user?.email || "Chưa cập nhật email"}
          </p>
        </div>

        <Separator />

        {/* Stats - Compact */}
        <div className="px-4 py-2 space-y-1">
          <button className="cursor-target w-full flex items-center justify-between hover:bg-accent/50 px-2 py-1.5 rounded-md transition-colors text-xs group">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Connections
            </span>
            <span className="font-semibold text-primary group-hover:underline">
              245
            </span>
          </button>

          <button className="cursor-target w-full flex items-center justify-between hover:bg-accent/50 px-2 py-1.5 rounded-md transition-colors text-xs group">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Profile views
            </span>
            <span className="font-semibold text-primary group-hover:underline">
              1.2K
            </span>
          </button>

          <button className="cursor-target w-full flex items-center justify-between hover:bg-accent/50 px-2 py-1.5 rounded-md transition-colors text-xs group">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Post impressions
            </span>
            <span className="font-semibold text-primary group-hover:underline">
              5.6K
            </span>
          </button>
        </div>

        <Separator />

        {/* Quick Access */}
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            className="cursor-target w-full justify-start text-xs h-8 hover:bg-accent/50"
          >
            <Bookmark className="h-3.5 w-3.5 mr-2" />
            Saved items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
