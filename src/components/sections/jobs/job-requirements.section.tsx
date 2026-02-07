
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Code, GraduationCap, Users } from "lucide-react";

interface JobRequirementsProps {
  requirements?: {
    technical: string[];
    experience: string[];
    education: string[];
    soft: string[];
  };
}

const JobRequirements = ({ requirements }: JobRequirementsProps) => {
  const defaultRequirements = {
    technical: [
      "Lập trình Flutter/Dart",
      "Sử dụng thành thạo Android Studio & Xcode",
      "Tích hợp REST API",
      "Quản lý trạng thái (Provider, Bloc)",
      "Quản lý phiên bản bằng Git",
      "Các dịch vụ Firebase",
    ],
    experience: [
      "Trên 2 năm kinh nghiệm phát triển Flutter",
      "Có kinh nghiệm triển khai/đưa ứng dụng lên Store (App Store/Google Play)",
      "Phát triển ứng dụng đa nền tảng (Cross-platform)",
      "Làm việc theo quy trình Agile/Scrum",
    ],
    education: [
      "Cử nhân chuyên ngành Khoa học máy tính",
      "Chứng chỉ phát triển ứng dụng di động",
      "Các chuyên ngành kỹ thuật liên quan",
    ],
    soft: [
      "Kỹ năng giải quyết vấn đề",
      "Khả năng làm việc nhóm và phối hợp",
      "Giao tiếp tiếng Anh tốt",
      "Tỉ mỉ, chú trọng đến chi tiết",
      "Khả năng tự học và nghiên cứu",
    ],
  };


  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          Yêu cầu kỹ thuật
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {defaultRequirements.technical.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Kinh nghiệm & Kỹ năng mềm
        </h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
              Kinh nghiệm
            </h5>
            <div className="space-y-2">
              {defaultRequirements.experience.map((exp, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm">{exp}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
              Kỹ năng mềm
            </h5>
            <div className="flex flex-wrap gap-2">
              {defaultRequirements.soft.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          Học vấn
        </h4>
        <div className="space-y-2">
          {defaultRequirements.education.map((edu, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-sm">{edu}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobRequirements;
