import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="cursor-target h-5 w-5 text-primary" />
            Tổng quan công việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {desc.overview}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="cursor-target h-5 w-5 text-primary" />
            Trách nhiệm chính
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {desc.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="cursor-target h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  {responsibility}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="cursor-target h-5 w-5 text-primary" />
              Làm việc nhóm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {desc.teamWork.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="cursor-target h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="cursor-target h-5 w-5 text-primary" />
              Tác động & Phát triển
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {desc.impact.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="cursor-target h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Code2 className="cursor-target h-5 w-5" />
            Tech Stack chính
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                className="cursor-target bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDescription;
