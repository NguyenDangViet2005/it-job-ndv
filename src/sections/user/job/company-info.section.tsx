"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
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
import { useAuth } from "@/providers/auth.provider";
import ApplicationModal from "@/components/modals/application.modal";

interface CompanyInfoProps {
  jobId?: number;
  jobTitle?: string;
  company?: {
    name: string;
    logo: string;
    size: string;
    founded: string;
    industry: string;
    website: string;
    location: string;
    email: string;
    phone: string;
    description: string;
  };
}

const CompanyInfo = ({ jobId, jobTitle, company }: CompanyInfoProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const defaultCompany = {
    name: "CÔNG TY TNHH L.C.S",
    logo: "/logo-company.jpg",
    size: "50-100 nhân viên",
    founded: "2015",
    industry: "Công nghệ thông tin",
    website: "https://lcs.com.vn",
    location: "Đà Nẵng, Việt Nam",
    email: "hr@lcs.com.vn",
    phone: "+84 236 123 4567",
    description:
      "Chúng tôi là công ty công nghệ hàng đầu chuyên phát triển các giải pháp di động và web cho doanh nghiệp. Với đội ngũ kỹ sư giàu kinh nghiệm và môi trường làm việc năng động, chúng tôi cam kết mang đến những sản phẩm chất lượng cao và cơ hội phát triển tốt nhất cho nhân viên.",
  };

  const comp = company || defaultCompany;
  
  const handleApply = () => {
     setIsApplicationModalOpen(true); 
  };

  const handleSaveJob = () => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken && !isAuthenticated) {
      alert("Vui lòng đăng nhập để lưu công việc");
      router.push("/login");
      return;
    }

    // TODO: Implement save job functionality
    alert("Đã lưu công việc");
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image
              src={comp.logo}
              alt={comp.name}
              width={80}
              height={80}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{comp.name}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {comp.industry}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {comp.size}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{comp.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Thành lập năm {comp.founded}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={comp.website}
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
            {comp.description}
          </p>
        </div>

        <hr className="border-border" />

        <div className="space-y-2">
          <h4 className="font-medium">Thông tin liên hệ</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${comp.email}`}
                className="text-primary hover:underline"
              >
                {comp.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${comp.phone}`}
                className="text-primary hover:underline"
              >
                {comp.phone}
              </a>
            </div>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={handleApply}
          disabled={!jobId}
        >
          Ứng tuyển ngay
        </Button>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleSaveJob}
        >
          Lưu việc làm
        </Button>
      </div>

      {/* Application Modal */}
      {jobId && (
        <ApplicationModal
          open={isApplicationModalOpen}
          onOpenChange={setIsApplicationModalOpen}
          jobId={jobId}
          jobTitle={jobTitle || "Vị trí tuyển dụng"}
          companyName={comp.name}
        />
      )}
    </>
  );
};

export default CompanyInfo;
