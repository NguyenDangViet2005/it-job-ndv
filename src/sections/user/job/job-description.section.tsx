import { Badge } from "@/components/ui/shadcn/badge";
import {
  FileText,
  Target,
  Users,
  Lightbulb,
  CheckCircle2,
  Code2,
} from "lucide-react";

interface JobDescriptionProps {
  description?: {
    overview: string;
    responsibilities: string[];
    teamWork: string[];
    impact: string[];
  };
}

const JobDescription = ({ description }: JobDescriptionProps) => {
  const defaultDescription = {
    overview:
      "Chúng tôi đang tìm kiếm một Flutter Mobile Apps Developer tài năng và đam mê để gia nhập đội ngũ phát triển di động của chúng tôi. Bạn sẽ chịu trách nhiệm thiết kế, phát triển và duy trì các ứng dụng di động chất lượng cao cho cả Android và iOS, sử dụng Flutter framework. Đây là cơ hội tuyệt vời để làm việc với các công nghệ tiên tiến và đóng góp vào sự phát triển của các sản phẩm có tác động lớn.",
    responsibilities: [
      "Phát triển và duy trì ứng dụng mobile sử dụng Flutter/Dart",
      "Thiết kế UI/UX responsive và tương tác mượt mà",
      "Tích hợp APIs và xử lý dữ liệu real-time",
      "Tối ưu hóa hiệu suất ứng dụng cho cả Android và iOS",
      "Viết unit tests và integration tests",
      "Collaborate với team Backend để thiết kế API",
      "Code review và maintain coding standards",
      "Troubleshoot và debug các vấn đề production",
    ],
    teamWork: [
      "Làm việc chặt chẽ với Product Manager và Designer",
      "Tham gia daily standups và sprint planning",
      "Chia sẻ kiến thức và mentor junior developers",
      "Đóng góp ý tưởng cho việc cải thiện quy trình development",
    ],
    impact: [
      "Ứng dụng được hàng triệu người dùng sử dụng",
      "Tác động trực tiếp đến trải nghiệm khách hàng",
      "Cơ hội làm việc với cutting-edge technologies",
      "Phát triển skills và advance career path",
    ],
  };

  const desc = description || defaultDescription;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Tổng quan công việc
        </h4>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {desc.overview}
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Trách nhiệm chính
        </h4>
        <div className="space-y-2">
          {desc.responsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm leading-relaxed">
                {responsibility}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Làm việc nhóm
          </h4>
          <div className="space-y-2">
            {desc.teamWork.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Tác động & Phát triển
          </h4>
          <div className="space-y-2">
            {desc.impact.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Code2 className="h-4 w-4" />
          Tech Stack chính
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "Flutter",
            "Dart",
            "Firebase",
            "REST API",
            "Provider/Bloc",
            "Git",
            "Android Studio",
            "Xcode",
          ].map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
