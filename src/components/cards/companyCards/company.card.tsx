import Image from "next/image";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import Link from "next/link";
import { Briefcase, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { Company } from "@/types";

export const CompanyCard = ({ company }: { company: Company }) => {
  const location = company.city || company.address || "Chưa cập nhật";

  return (
    <Link href={`/companies/${company.id}`} className="block group">
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-target hover:border-primary/50 overflow-hidden">
        {/* Cover Image */}
        <div className="relative w-full h-34 -mt-6">
          {company.coverimage && (
            <Image
              src={company.coverimage}
              alt={`${company.name} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        <CardContent className="px-6 pt-0">
          {/* Logo & Name - Overlapping */}
          <div className="flex items-start gap-4 mb-4 -mt-10">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border-4 border-background shadow-lg group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-300">
              <Image
                src={company.avatar || "/logo/default-company.png"}
                alt={company.name}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0 mt-4">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {company.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {company.nationality || "Việt Nam"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {company.description || "Chưa có mô tả"}
          </p>

          {/* Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
            {company.foundedyear && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span>Thành lập {company.foundedyear}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span>
                {company.jobs && company.jobs.length > 0
                  ? `Đang tuyển ${company.jobs.length} vị trí`
                  : "Chưa có vị trí tuyển dụng"}
              </span>
            </div>
          </div>

          {/* Reviews */}
          {company.reviews && company.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-medium">
                {(
                  company.reviews.reduce(
                    (acc: any, r: any) => acc + r.rating,
                    0,
                  ) / company.reviews.length
                ).toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({company.reviews.length} đánh giá)
              </span>
            </div>
          )}

          {/* CTA */}
          <Button
            variant="outline"
            className="w-full cursor-target dark:hover:bg-primary hover:bg-primary hover:text-background dark:hover:text-foreground transition-colors"
          >
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};
