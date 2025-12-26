"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Building2, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import ListDialog from "@/components/ui/customs/list-dialog";

export default function CompanyFollow({ followList }: { followList: any[] }) {
  const [followedCompanies, setFollowedCompanies] = useState<number[]>([]);

  const handleFollow = (id: number) => {
    setFollowedCompanies((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  // Lấy 2 công ty đầu tiên để hiển thị
  const suggestedCompanies = followList.slice(0, 2);

  const trigger = (
    <Button
      variant="ghost"
      className="w-full justify-center text-xs h-7 text-primary hover:bg-primary/10 mt-1"
    >
      Xem thêm
      <ArrowRight className="h-3 w-3 ml-1" />
    </Button>
  );

  return (
    <Card className="border-border/50">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-xs flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          Công ty có thể quan tâm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {suggestedCompanies.map((company: any) => (
          <div key={company.id} className="flex items-center gap-2">
            <Image
              src={company.logo}
              alt={company.name}
              width={32}
              height={32}
              className="rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium line-clamp-1">
                {company.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {company.followers || "1.2K"} followers
              </p>
            </div>
            <Button
              size="sm"
              variant={
                followedCompanies.includes(company.id) ? "outline" : "default"
              }
              className="h-6 text-[10px] px-2 flex-shrink-0"
              onClick={() => handleFollow(company.id)}
            >
              {followedCompanies.includes(company.id) ? (
                "Following"
              ) : (
                <>
                  <Plus className="h-3 w-3 mr-0.5" />
                  Follow
                </>
              )}
            </Button>
          </div>
        ))}

        <ListDialog trigger={trigger} title="Công ty có thể quan tâm">
          <div className="space-y-3">
            {followList.map((company: any) => (
              <div
                key={company.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">
                    {company.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {company.followers || "1.2K"} followers
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={
                    followedCompanies.includes(company.id)
                      ? "outline"
                      : "default"
                  }
                  className="h-7 text-xs px-3"
                  onClick={() => handleFollow(company.id)}
                >
                  {followedCompanies.includes(company.id) ? (
                    "Following"
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </ListDialog>
      </CardContent>
    </Card>
  );
}
