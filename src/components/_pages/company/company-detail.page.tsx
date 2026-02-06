"use client";

import { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
import { Company } from "@/types/models/company.type";
import { companyApi } from "@/apis";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Globe,
  Calendar,
  Phone,
  Mail,
  Building2,
  Users,
  CheckCircle2,
  Briefcase,
  Star,
  UserPlus,
  Gift,
  TrendingUp,
  Heart,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants";
import Link from "next/link";

const CompanyDetailPage = ({companyid}: {companyid: string}) => {
  const router = useRouter();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyid) {
        setError("ID công ty không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await companyApi.getById(Number(companyid));
        setCompany(data);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Không thể tải thông tin công ty");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyid]);

  if (loading) {
    return <CompanyDetailSkeleton />;
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy công ty</h2>
            <p className="text-muted-foreground mb-4">{error || "Công ty không tồn tại"}</p>
            <Button onClick={() => router.push("/companies")}>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openJobs = company.jobs?.filter(job => job.status === 'open') || [];
  const totalMembers = company.memberCount ||  0;
  const totalFollowers = company.follows?.length || 0;
  const averageRating = company.reviews?.length 
    ? (company.reviews.reduce((sum, r) => sum + r.rating, 0) / company.reviews.length).toFixed(1)
    : null;

  // Mock benefits data
  const benefits = [
    { icon: Gift, title: "Lương thưởng hấp dẫn", desc: "Mức lương cạnh tranh, thưởng theo hiệu suất" },
    { icon: TrendingUp, title: "Cơ hội thăng tiến", desc: "Lộ trình phát triển nghề nghiệp rõ ràng" },
    { icon: Heart, title: "Chế độ phúc lợi", desc: "Bảo hiểm đầy đủ, du lịch hàng năm" },
    { icon: GraduationCap, title: "Đào tạo & Phát triển", desc: "Khóa học nâng cao kỹ năng chuyên môn" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      {/* Cover Image */}
      <div className="h-32 md:h-48 lg:h-64 w-full relative bg-muted overflow-hidden mb-8 lg:mb-12">
        {company.coverimage ? (
          <Image
            src={company.coverimage}
            alt={`${company.name} cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative -mt-16 md:-mt-20 lg:-mt-24 mb-6 lg:mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 lg:gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 border-4 border-background rounded-2xl shadow-xl bg-white">
              <AvatarImage
                src={company.avatar}
                alt={company.name}
                className="object-contain p-2"
              />
              <AvatarFallback className="rounded-2xl text-xl lg:text-3xl font-bold bg-primary/10 text-primary">
                {company.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pb-2 space-y-2 lg:space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-foreground">
                    {company.name}
                  </h1>
                  <Badge variant="secondary" className="h-5 lg:h-6 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-blue-500" />
                    Đã xác thực
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-muted-foreground text-xs lg:text-sm">
                  {company.address && (
                    <div className="flex items-center gap-1 lg:gap-1.5">
                      <MapPin className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" />
                      <span>{company.address}</span>
                    </div>
                  )}
                  {company.foundedyear && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Thành lập {company.foundedyear}</span>
                    </div>
                  )}
                  {company.nationality && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4 shrink-0" />
                      <span>{company.nationality}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="min-w-[120px]">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Theo dõi
                </Button>
                <Button variant="outline" className="min-w-[120px]">
                  <Star className="h-4 w-4 mr-2" />
                  Viết đánh giá
                </Button>
                {company.website && (
                  <Button variant="secondary" asChild>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Truy cập website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content - Single Card */}
          <div className="lg:col-span-2">
            <Card className="rounded-none">
              <CardContent className="p-6 space-y-6">
                {/* Giới thiệu */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Giới thiệu</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {company.description || "Chưa có thông tin giới thiệu về công ty này."}
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <benefit.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Vị trí đang tuyển */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Vị trí đang tuyển ({openJobs.length})
                      </h3>
                    </div>
                    {openJobs.length > 0 && (
                      <Button variant="link" className="text-primary p-0 h-auto">
                        Xem tất cả
                      </Button>
                    )}
                  </div>
                  
                  {openJobs.length > 0 ? (
                    <div className="space-y-3">
                      {openJobs.slice(0, 5).map((job) => (
                        <div key={job.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{job.title}</h4>
                              <div className="flex flex-wrap gap-2 text-sm">
                                <Badge variant="secondary" className="text-xs">
                                  {job.type === 'full-time' ? 'Toàn thời gian' : 'Bán thời gian'}
                                </Badge>
                                {job.salary && (
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    💰 {job.salary}
                                  </span>
                                )}
                                {job.deadline && (
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    📅 Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Link href={ROUTES.JOB_DETAIL(job.id)}><Button size="sm" className="shrink-0">Ứng tuyển</Button></Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed rounded-lg text-center bg-muted/30">
                      <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">Hiện tại chưa có vị trí tuyển dụng nào.</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Đánh giá */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">
                        Đánh giá ({company.reviews?.length || 0})
                      </h3>
                      {averageRating && (
                        <Badge variant="secondary" className="ml-2">
                          <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                          {averageRating}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Viết đánh giá
                    </Button>
                  </div>
                  
                  {company.reviews && company.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {company.reviews.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="text-sm">U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">Người dùng #{review.userid}</span>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm mb-1">
                                {review.comment}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.createdat).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed rounded-lg text-center bg-muted/30">
                      <Star className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">Chưa có đánh giá nào.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Single Card */}
          <div className="lg:col-span-1">
            <Card className="rounded-none sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Thông tin công ty</h3>
                
                <div className="space-y-4">
                  {company.hotline && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                          Hotline
                        </p>
                        <p className="text-sm font-medium">{company.hotline}</p>
                      </div>
                    </div>
                  )}

                  {company.companyemail && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                          Email
                        </p>
                        <p className="text-sm font-medium break-all">
                          {company.companyemail}
                        </p>
                      </div>
                    </div>
                  )}

                  {totalMembers > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                          Quy mô
                        </p>
                        <p className="text-sm font-medium">
                          {totalMembers} nhân viên
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                        Người theo dõi
                      </p>
                      <p className="text-sm font-medium">
                        {totalFollowers} người
                      </p>
                    </div>
                  </div>

                  {averageRating && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Star className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
                          Đánh giá
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{averageRating}</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.round(parseFloat(averageRating))
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({company.reviews?.length})
                          </span>
                        </div>
                      </div>
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

// Loading Skeleton Component
function CompanyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-48 md:h-64 w-full" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="relative -mt-20 mb-8">
          <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-2xl" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
