import * as React from "react";
import { Calendar, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const QuickActions = () => {
  const actions = [
    {
      label: "Đăng lên công việc mới",
      icon: <Plus className="h-4 w-4" />,
      variant: "default" as const,
    },
    {
      label: "Lịch phỏng vấn",
      icon: <Calendar className="h-4 w-4" />,
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono">Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="justify-start font-mono"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default QuickActions;
