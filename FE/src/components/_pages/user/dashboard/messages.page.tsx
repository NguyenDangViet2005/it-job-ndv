"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-8 max-w-5xl">
      <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">Tin nhắn</h1>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-sm sm:text-lg">Hộp thư</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="flex flex-col items-center justify-center py-6 sm:py-12 text-center">
            <MessageSquare className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground mb-2 sm:mb-4" />
            <h3 className="text-sm sm:text-lg font-semibold mb-1">Chưa có tin nhắn</h3>
            <p className="text-xs sm:text-base text-muted-foreground px-3">
              Các cuộc trò chuyện của bạn với nhà tuyển dụng sẽ xuất hiện ở đây
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
