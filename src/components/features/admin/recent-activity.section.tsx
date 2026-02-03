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
    title: "New User Registration",
    description: "Nguyen Van A registered as a candidate",
    timestamp: "2 minutes ago",
    user: {
      name: "Nguyen Van A",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    status: "success"
  },
  {
    id: 2,
    type: "job",
    title: "Job Posted",
    description: "Senior Full Stack Developer position published",
    timestamp: "15 minutes ago",
    status: "success"
  },
  {
    id: 3,
    type: "application",
    title: "New Application",
    description: "Tran Thi B applied for Product Designer",
    timestamp: "1 hour ago",
    user: {
      name: "Tran Thi B",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
    },
    status: "pending"
  },
  {
    id: 4,
    type: "post",
    title: "Blog Post Published",
    description: "How to ace your technical interview",
    timestamp: "2 hours ago",
    status: "success"
  },
  {
    id: 5,
    type: "system",
    title: "System Update",
    description: "Database backup completed successfully",
    timestamp: "3 hours ago",
    status: "success"
  },
  {
    id: 6,
    type: "comment",
    title: "New Comment",
    description: "Le Van C commented on a blog post",
    timestamp: "4 hours ago",
    user: {
      name: "Le Van C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max"
    }
  },
  {
    id: 7,
    type: "job",
    title: "Job Closed",
    description: "DevOps Engineer position filled",
    timestamp: "5 hours ago",
    status: "success"
  },
  {
    id: 8,
    type: "user",
    title: "User Updated Profile",
    description: "Pham Thi D updated their profile information",
    timestamp: "6 hours ago",
    user: {
      name: "Pham Thi D",
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
    <Card className="h-full cursor-target">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-target"
            >
              <div className="flex-shrink-0">
                {activity.user ? (
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {getActivityIcon(activity.type)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  </div>
                  {activity.status && (
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
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
