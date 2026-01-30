"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { followApi } from "@/apis";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Briefcase,
  DollarSign,
  Clock,
  Heart,
  Star,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import type { Company } from "@/types/api.type";

interface CompanyDetailPageProps {
  company: Company;
}

const CompanyDetailPage = ({ company }: CompanyDetailPageProps) => {
  const { user, token } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Check if current user is following this company
  useEffect(() => {
    if (user && company.follows) {
      const isUserFollowing = company.follows.some(
        (follow) => follow.userId === user.id,
      );
      setIsFollowing(isUserFollowing);
    }
  }, [user, company.follows]);

  const handleFollow = async () => {
    if (!user || !token) {
      toast.error("Vui lòng đăng nhập để theo dõi công ty");
      return;
    }

    setIsFollowLoading(true);
    try {
      const response = await followApi.toggleFollow(user.id, company.id, token);
      setIsFollowing(response.followed);
      toast.success(
        response.followed
          ? "Đã theo dõi công ty thành công!"
          : "Đã hủy theo dõi công ty",
      );
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleLoadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3);
  };

  // Calculate stats
  const openJobsCount =
    company.jobs?.filter((job) => job.status === "open").length || 0;
  const followersCount = company.follows?.length || 0;
  const reviewsCount = company.reviews?.length || 0;
  const averageRating =
    reviewsCount > 0
      ? (
          company.reviews!.reduce((acc, r) => acc + r.rating, 0) / reviewsCount
        ).toFixed(1)
      : "0";

  const filteredJobs =
    selectedJobType === "all"
      ? company.jobs?.filter((job) => job.status === "open")
      : company.jobs?.filter(
          (job) => job.status === "open" && job.type === selectedJobType,
        );

  return (
    <div className="min-h-screen bg-background">
      {/* Cover & Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
          {company.coverImage && (
            <Image
              src={company.coverImage}
              alt={`${company.name} cover`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Company Header */}
        <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
          <Card className="rounded-none p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-white border-4 border-background shadow-lg">
                <Image
                  src={company.avatar || "/logo-company.jpg"}
                  alt={company.name}
                  fill
                  className="object-contain p-3"
                  sizes="128px"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {company.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="default" className="cursor-target">
                        {company.nationality || "Việt Nam"}
                      </Badge>
                      {reviewsCount > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{averageRating}</span>
                          <span className="text-muted-foreground">
                            ({reviewsCount} đánh giá)
                          </span>
                        </div>
                      )}
                      {followersCount > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {followersCount.toLocaleString()} người theo dõi
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      onClick={handleFollow}
                      disabled={isFollowLoading || !user}
                      className="cursor-target"
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          isFollowing ? "fill-current" : ""
                        }`}
                      />
                      {isFollowLoading
                        ? "Đang xử lý..."
                        : isFollowing
                          ? "Hủy theo dõi"
                          : "Theo dõi"}
                    </Button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {company.city || company.address || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{company.country || "Việt Nam"}</span>
                  </div>
                  {company.foundedYear && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Thành lập {company.foundedYear}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Briefcase className="h-4 w-4" />
                    <span>{openJobsCount} vị trí tuyển dụng</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Card className="rounded-none ">
              <CardContent className="p-6 space-y-8">
                {/* About */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                    <Building2 className="h-5 w-5" />
                    Giới thiệu công ty
                  </h3>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {company.description}
                  </div>
                </div>

                {/* Location */}
                {(company.address || company.city) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                        <MapPin className="h-5 w-5" />
                        Địa điểm làm việc
                      </h3>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">
                            {company.city || "Văn phòng chính"}
                          </div>
                          {company.address && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {company.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Jobs */}
                <Separator />
                <div id="jobs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-xl font-semibold">
                      <Briefcase className="h-5 w-5" />
                      Vị trí đang tuyển dụng ({openJobsCount})
                    </h3>
                  </div>

                  {/* Job Filter */}
                  <div className="mb-6">
                    <Tabs defaultValue="all" onValueChange={setSelectedJobType}>
                      <TabsList>
                        <TabsTrigger value="all" className="cursor-target">
                          Tất cả
                        </TabsTrigger>
                        <TabsTrigger
                          value="full-time"
                          className="cursor-target"
                        >
                          Full-time
                        </TabsTrigger>
                        <TabsTrigger
                          value="part-time"
                          className="cursor-target"
                        >
                          Part-time
                        </TabsTrigger>
                        <TabsTrigger value="contract" className="cursor-target">
                          Contract
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Job List */}
                  {filteredJobs && filteredJobs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          companyName={company.name}
                          companyLogo={company.avatar || "/logo-company.jpg"}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Không có vị trí tuyển dụng phù hợp
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <Card className="rounded-none ">
              <CardContent className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-3">
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors cursor-target group"
                      >
                        <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="line-clamp-1">{company.website}</span>
                      </a>
                    )}
                    {company.hotline && (
                      <a
                        href={`tel:${company.hotline}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors cursor-target group"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span>{company.hotline}</span>
                      </a>
                    )}
                    {company.address && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="line-clamp-2">{company.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div>
                  <Button
                    className="w-full mb-3 cursor-target"
                    onClick={() => {
                      document
                        .getElementById("jobs")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Xem tất cả việc làm
                  </Button>
                </div>

                <Separator />

                {/* Company Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Vị trí tuyển dụng
                      </span>
                      <span className="font-semibold">{openJobsCount}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Người theo dõi
                      </span>
                      <span className="font-semibold">
                        {followersCount.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Đánh giá
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Reviews */}
                <div id="reviews">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <MessageSquare className="h-5 w-5" />
                    Đánh giá ({reviewsCount})
                  </h3>
                  {company.reviews && company.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {company.reviews
                        .slice(0, visibleReviews)
                        .map((review) => (
                          <div key={review.id} className="flex gap-3">
                            <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                                {review.userId.toString().charAt(0)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm">
                                  User #{review.userId}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground/30"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        ))}

                      {company.reviews.length > visibleReviews && (
                        <Button
                          variant="outline"
                          className="w-full text-sm cursor-target"
                          onClick={handleLoadMoreReviews}
                        >
                          Xem thêm đánh giá
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Chưa có đánh giá nào
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({
  job,
  companyName,
  companyLogo,
}: {
  job: {
    id: number;
    companyId: number;
    title: string;
    description: string;
    type: string;
    quantity: number;
    deadline: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  companyName: string;
  companyLogo: string;
}) => {
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    // Calculate on client-side only to avoid hydration mismatch
    const days = Math.ceil(
      (new Date(job.deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    setDaysLeft(days);
  }, [job.deadline]);

  return (
    <Link href={`/jobs/${job.id}`} className="block group cursor-target">
      <Card className=" hover:shadow-md hover:border-primary/50 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white border">
              <Image
                src={companyLogo}
                alt={companyName}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{job.quantity} vị trí</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span
                    className={daysLeft < 7 ? "text-red-500 font-medium" : ""}
                  >
                    {daysLeft > 0 ? `Còn ${daysLeft} ngày` : "Hết hạn"}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {job.description}
              </p>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {job.status === "open" ? "Đang tuyển" : "Đã đóng"}
                </Badge>

                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompanyDetailPage;
