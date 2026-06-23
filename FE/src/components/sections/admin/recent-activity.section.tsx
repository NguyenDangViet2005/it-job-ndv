"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Briefcase, 
  FileText, 
  Settings, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  type: "user" | "job" | "post" | "system" | "comment" | "application";
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: "success" | "error" | "pending";
}

const activities: Activity[] = [
  {
    id: 1,
    type: "user",
    title: "Đăng Ký Người Dùng Mới",
    description: "Nguyễn Văn A đăng ký làm ứng viên",
    timestamp: "2 phút trước",
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    status: "success"
  },
  {
    id: 2,
    type: "job",
    title: "Đăng Công Việc",
    description: "Vị trí Senior Full Stack Developer được đăng",
    timestamp: "15 phút trước",
    status: "success"
  },
  {
    id: 3,
    type: "application",
    title: "Đơn Ứng Tuyển Mới",
    description: "Trần Thị B ứng tuyển vị trí Product Designer",
    timestamp: "1 giờ trước",
    user: {
      name: "Trần Thị B",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
    },
    status: "pending"
  },
  {
    id: 4,
    type: "post",
    title: "Xuất Bản Bài Viết",
    description: "Cách vượt qua phỏng vấn kỹ thuật",
    timestamp: "2 giờ trước",
    status: "success"
  },
  {
    id: 5,
    type: "system",
    title: "Cập Nhật Hệ Thống",
    description: "Sao lưu cơ sở dữ liệu hoàn tất",
    timestamp: "3 giờ trước",
    status: "success"
  },
  {
    id: 6,
    type: "comment",
    title: "Bình Luận Mới",
    description: "Lê Văn C bình luận trên bài viết",
    timestamp: "4 giờ trước",
    user: {
      name: "Lê Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max"
    }
  },
  {
    id: 7,
    type: "job",
    title: "Đóng Công Việc",
    description: "Vị trí DevOps Engineer đã tuyển đủ",
    timestamp: "5 giờ trước",
    status: "success"
  },
  {
    id: 8,
    type: "user",
    title: "Cập Nhật Hồ Sơ",
    description: "Phạm Thị D cập nhật thông tin hồ sơ",
    timestamp: "6 giờ trước",
    user: {
      name: "Phạm Thị D",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    }
  }
];

const getActivityIcon = (type: Activity["type"]) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "user":
      return <UserPlus className={iconClass} />;
    case "job":
      return <Briefcase className={iconClass} />;
    case "post":
      return <FileText className={iconClass} />;
    case "system":
      return <Settings className={iconClass} />;
    case "comment":
      return <MessageSquare className={iconClass} />;
    case "application":
      return <CheckCircle className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
};

const getStatusIcon = (status?: Activity["status"]) => {
  if (!status) return null;
  const iconClass = "h-4 w-4";
  switch (status) {
    case "success":
      return <CheckCircle className={cn(iconClass, "text-green-500")} />;
    case "error":
      return <XCircle className={cn(iconClass, "text-red-500")} />;
    case "pending":
      return <Clock className={cn(iconClass, "text-yellow-500")} />;
  }
};

const RecentActivity = () => {
  return (
    <Card className="h-full cursor-target flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Hoạt Động Gần Đây
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group cursor-target"
            >
              <div className="flex-shrink-0">
                {activity.user ? (
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {getActivityIcon(activity.type)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {activity.description}
                    </p>
                  </div>
                  {activity.status && (
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px] sm:text-xs font-mono">
                    {activity.type}
                  </Badge>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
