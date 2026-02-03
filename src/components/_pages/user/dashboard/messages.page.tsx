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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Tin nhắn</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hộp thư</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có tin nhắn</h3>
            <p className="text-muted-foreground">
              Các cuộc trò chuyện của bạn với nhà tuyển dụng sẽ xuất hiện ở đây
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
