import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Gift,
  Heart,
  Clock,
  Car,
  GraduationCap,
  Shield,
  Coffee,
  DollarSign,
  Users2,
} from "lucide-react";

interface JobBenefitsProps {
  benefits?: {
    salary: string[];
    welfare: string[];
    growth: string[];
    environment: string[];
  };
}

const JobBenefits = ({ benefits }: JobBenefitsProps) => {
  const defaultBenefits = {
    salary: [
      "Lương cạnh tranh: 15-25 triệu VND",
      "Thưởng hiệu suất hàng quý",
      "Tăng lương định kỳ 6 tháng",
      "Thưởng dự án hoàn thành",
    ],
    welfare: [
      "Bảo hiểm sức khỏe cao cấp",
      "Du lịch công ty hàng năm",
      "Hỗ trợ ăn trưa và đi lại",
      "Nghỉ phép có lương 15 ngày",
      "Làm việc hybrid 2-3 ngày/tuần",
    ],
    growth: [
      "Đào tạo kỹ năng chuyên môn",
      "Tham gia hội thảo công nghệ",
      "Cơ hội thăng tiến rõ ràng",
      "Mentoring từ senior developers",
      "Ngân sách học tập cá nhân",
    ],
    environment: [
      "Văn phòng hiện đại, thoáng mát",
      "Trang thiết bị làm việc đầy đủ",
      "Team trẻ, năng động",
      "Văn hóa học hỏi và chia sẻ",
      "Game room và khu nghỉ ngơi",
    ],
  };

  const benef = benefits || defaultBenefits;

  const benefitSections = [
    {
      title: "Lương & Thưởng",
      icon: DollarSign,
      items: benef.salary,
      color: "text-green-500",
    },
    {
      title: "Phúc lợi",
      icon: Heart,
      items: benef.welfare,
      color: "text-red-500",
    },
    {
      title: "Phát triển",
      icon: GraduationCap,
      items: benef.growth,
      color: "text-blue-500",
    },
    {
      title: "Môi trường",
      icon: Coffee,
      items: benef.environment,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefitSections.map((section, index) => (
          <div key={index}>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <section.icon className={`h-4 w-4 ${section.color}`} />
              {section.title}
            </h4>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${section.color.replace(
                      "text-",
                      "bg-"
                    )} mt-2 flex-shrink-0`}
                  />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Benefits Highlights */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          Đặc quyền nổi bật
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">Flexible Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <span className="text-sm">Parking Free</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm">Job Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-primary" />
            <span className="text-sm">Team Building</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBenefits;
