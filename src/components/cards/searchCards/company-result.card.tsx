import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import { Briefcase, MapPin } from "lucide-react";
import { SearchCompany } from "@/apis/search.api";
import { Card } from "@/components/ui/shadcn/card";

export default function CompanyCard({ company }: { company: SearchCompany }) {
  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="rounded-lg transition-all p-5 border hover:border-primary/50 h-full">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-background border rounded-lg p-2 flex items-center justify-center">
              <img
                src={company.avatar}
                alt={company.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-1 hover:text-primary transition-colors line-clamp-1">
              {company.name}
            </h3>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{company.address}</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm  line-clamp-2">
          {company.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {company.jobCount} việc làm
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary hover:text-primary-foreground h-8 text-xs"
          >
            Xem chi tiết
          </Button>
        </div>
      </Card>
    </Link>
  );
}
