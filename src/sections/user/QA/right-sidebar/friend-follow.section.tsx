"use client";

import { MessageCircleMore, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";

function FriendFollow({ connectionList }: { connectionList: any[] }) {
  // Get current user ID from the first connection if available
  const currentUserId = connectionList[0]?.userId || connectionList[0]?.connectedUserId;

  return (
    <Card className="border-border/50 h-[95%] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Kết nối</p>
            <p className="text-xs text-muted-foreground">
              {connectionList.length} kết nối
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-3 pt-0">
        {connectionList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Chưa có kết nối nào
          </div>
        ) : (
          <div className="space-y-1">
            {connectionList.map((connection: any) => {
              const isCurrentUserInitiator = connection.user?.id === currentUserId;
              const displayUser = isCurrentUserInitiator 
                ? connection.connectedUser 
                : connection.user;
              
              return (
                <div
                  key={connection.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <Image
                    src={displayUser?.avatar || "/logo/logo_black_1.png"}
                    alt={displayUser?.fullName || "User"}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {displayUser?.fullName || "User"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {displayUser?.email || ""}
                    </p>
                  </div>
                  <MessageCircleMore size={18}/>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FriendFollow;
