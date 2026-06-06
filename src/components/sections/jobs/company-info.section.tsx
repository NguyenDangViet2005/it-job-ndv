"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Calendar,
  Building2,
  Globe,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import ApplicationModal from "@/components/common/modals/jobs/application.modal";
import { ROUTES } from "@/constants";
import { Company } from "@/types";

const CompanyInfo = ({
  jobid,
  jobTitle,
  company,
}: {
  jobid?: number;
  jobTitle?: string;
  company?: Company;
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để ứng tuyển");
      return;
    }
    setIsApplicationModalOpen(true);
  };

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu công việc");
      router.push(ROUTES.LOGIN);
      return;
    }

    // TODO: Implement save job functionality
    toast.success("Đã lưu công việc");
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image
              src={company?.avatar || "/logo/default-company.png"}
              alt={company?.name || "Company Logo"}
              width={80}
              height={80}
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{company?.name}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            Công nghệ
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {company?.membersCount
              ? `${company.membersCount} nhân viên`
              : "Chưa cập nhật"}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{company?.address}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Thành lập năm {company?.foundedyear || "Chưa cập nhật"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={company?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Website công ty
              <ExternalLink className="h-3 w-3 ml-1 inline" />
            </a>
          </div>
        </div>

        <hr className="border-border" />

        <div>
          <h4 className="font-medium mb-2">Về công ty</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {company?.description}
          </p>
        </div>

        <hr className="border-border" />

        <div className="space-y-2">
          <h4 className="font-medium">Thông tin liên hệ</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${company?.companyemail}`}
                className="text-primary hover:underline"
              >
                {company?.companyemail}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${company?.hotline}`}
                className="text-primary hover:underline"
              >
                {company?.hotline}
              </a>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleApply}
          disabled={!jobid}
        >
          Ứng tuyển ngay
        </Button>

        <Button variant="outline" className="w-full" onClick={handleSaveJob}>
          Lưu việc làm
        </Button>
      </div>

      {/* Application Modal */}
      {jobid && (
        <ApplicationModal
          open={isApplicationModalOpen}
          onOpenChange={setIsApplicationModalOpen}
          jobid={jobid}
          jobTitle={jobTitle || "Vị trí tuyển dụng"}
          companyName={company?.name || ""}
        />
      )}
    </>
  );
};

export default CompanyInfo;
