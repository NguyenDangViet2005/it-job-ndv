"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/useAuth";
import { userApi } from "@/apis/user.api";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (!user?.id || !token) {
      toast.error("Vui lòng đăng nhập lại");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await userApi.changePassword(
        user.id,
        currentPassword,
        newPassword,
        token,
      );

      toast.success(response.message || "Đổi mật khẩu thành công");

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-8 max-w-3xl">
      <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">Cài đặt tài khoản</h1>

      <div className="space-y-3 sm:space-y-6">
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-lg">Thông tin cá nhân</CardTitle>
            <CardDescription className="text-xs">Cập nhật thông tin cơ bản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-6 pt-0">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-xs">Họ và tên</Label>
              <Input id="name" defaultValue={user?.fullname} className="text-xs sm:text-sm h-8 sm:h-10" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                disabled
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
            <Button className="text-xs h-7 sm:h-9">Lưu thay đổi</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-lg">Đổi mật khẩu</CardTitle>
            <CardDescription className="text-xs">Cập nhật mật khẩu của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-6 pt-0">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="current-password" className="text-xs">Mật khẩu hiện tại</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="new-password" className="text-xs">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="confirm-password" className="text-xs">Xác nhận mật khẩu</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="text-xs h-7 sm:h-9"
            >
              {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-destructive text-sm sm:text-lg">Xoá tài khoản</CardTitle>
            <CardDescription className="text-xs">
              Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xoá
              vĩnh viễn.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Button variant="destructive" className="text-xs h-7 sm:h-9">Xoá tài khoản</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
