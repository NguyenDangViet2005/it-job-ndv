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
import { useState, useEffect } from "react";
import ListDialog from "@/components/ui/customs/list-dialog";
import { followApi } from "@/apis";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner"; // Assuming toast is available, if not can use alert or console
import Link from "next/link";
import { ROUTES } from "@/configs";
import { Company } from "@/types";

export default function CompanyFollow({
  followList,
  followedCompanyIds = [],
}: {
  followList: any[];
  followedCompanyIds?: number[];
}) {
  const [followedCompanies, setFollowedCompanies] = useState<number[]>([]);
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    setFollowedCompanies(followedCompanyIds);
  }, [followedCompanyIds]);

  const handleFollow = async (id: number) => {
    if (!isAuthenticated || !user || !token) {
      // Redirect to login or show generic auth message (already handled ideally)
      return;
    }

    try {
      const response = await followApi.toggleFollow(user.id, id, token);
      if (response.followed) {
        setFollowedCompanies((prev) => [...prev, id]);
      } else {
        setFollowedCompanies((prev) => prev.filter((cId) => cId !== id));
      }
    } catch (error) {
      console.error("Failed to follow company:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };
  const suggestedCompanies = followList.slice(0, 4);

  return (
    <Card className="border-border/50 py-3">
      <CardHeader>
        <CardTitle className="text-xs flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          Công ty có thể quan tâm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {suggestedCompanies.map((company: Company) => (
          <div
            key={company.id}
            className="flex items-center justify-between gap-2"
          >
            <Link
              href={ROUTES.COMPANY_DETAIL(company.id)}
              key={company.id}
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-white p-1 flex-shrink-0">
                  <Image
                    src={
                      company.avatar ||
                      company.logo ||
                      "/images/placeholder_company.png"
                    }
                    alt={company.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">
                    {company.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {company.followers || 0} followers
                  </p>
                </div>
              </div>
            </Link>
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
                  Theo dõi
                </>
              )}
            </Button>
          </div>
        ))}

        <ListDialog title="Công ty có thể quan tâm">
          <div className="space-y-3">
            {followList.map((company: Company) => (
              <div
                key={company.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={() => {
                  // Navigate to company detail?
                }}
              >
                <Image
                  src={
                    company.avatar ||
                    company.logo ||
                    "/images/placeholder_company.png"
                  }
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/logo/logo_black_1.png";
                  }}
                  alt={company.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">
                    {company.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {company.followers || 0} followers
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(company.id);
                  }}
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
      <Button
        variant="ghost"
        className="w-full justify-center text-xs h-7 text-primary hover:bg-primary/10"
      >
        Xem thêm
        <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    </Card>
  );
}
