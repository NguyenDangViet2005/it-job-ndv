"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import ListDialog from "@/components/ui/customs/list-dialog";

function FriendFollow({ friendList }: { friendList: any[] }) {
  const trigger = (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-accent/50 h-auto py-2"
    >
      <Users className="h-4 w-4 mr-2 text-primary" />
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">Bạn bè</p>
        <p className="text-xs text-muted-foreground">
          {friendList.length} kết nối
        </p>
      </div>
    </Button>
  );

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <ListDialog trigger={trigger} title="Danh sách bạn bè">
          <div className="space-y-3">
            {friendList.map((f: any) => (
              <div
                key={f.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Image
                  src={f.logo}
                  alt={f.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.title || "Developer"}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Message
                </Button>
              </div>
            ))}
          </div>
        </ListDialog>
      </CardContent>
    </Card>
  );
}

export default FriendFollow;
