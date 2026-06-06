"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Plus, X, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { userApi } from "@/apis/user.api";
import { skillApi } from "@/apis/skill.api";
import { toast } from "sonner";
import { openCV } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Skill {
  id: number;
  name: string;
}

export default function ResumePage() {
  const { user, token, updateUser } = useAuth();
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingSkill, setAddingSkill] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingCV, setUploadingCV] = useState(false);

  // Load user skills
  useEffect(() => {
    if (user?.id && token) {
      loadUserSkills();
    }
  }, [user?.id, token]);

  const loadUserSkills = async () => {
    if (!user?.id || !token) return;

    try {
      setLoading(true);
      const response = await userApi.getSkills(user.id, token);

      // Handle different response formats
      let skills: Skill[] = [];
      if (Array.isArray(response)) {
        skills = response;
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        skills = Array.isArray((response as any).data)
          ? (response as any).data
          : [];
      } else if (
        response &&
        typeof response === "object" &&
        "$values" in response
      ) {
        skills = Array.isArray((response as any).$values)
          ? (response as any).$values
          : [];
      }

      setUserSkills(skills);
    } catch (error) {
      setUserSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all skills when dialog opens
  const loadAllSkills = async () => {
    if (!token) return;

    try {
      const response = await skillApi.getAll(1, 100, token);
      setAllSkills(response.data || []);
    } catch (error) {
      console.error("Failed to load all skills:", error);
    }
  };

  // Handle add skill
  const handleAddSkill = async (skillid: number) => {
    if (!user?.id || !token) return;

    try {
      setAddingSkill(true);
      await userApi.addSkill(user.id, skillid, token);
      await loadUserSkills();
      setDialogOpen(false);
      setSearchQuery("");
      toast.success("Thêm kỹ năng thành công!");
    } catch (error) {
      toast.error("Thêm kỹ năng thất bại!");
    } finally {
      setAddingSkill(false);
    }
  };

  // Handle remove skill
  const handleRemoveSkill = async (skillid: number) => {
    if (!user?.id || !token) return;

    try {
      await userApi.removeSkill(user.id, skillid, token);
      await loadUserSkills();
      toast.success("Xóa kỹ năng thành công!");
    } catch (error) {
      toast.error("Xóa kỹ năng thất bại!");
    }
  };

  // Handle upload CV
  const handleUploadCV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id || !token) return;

    try {
      setUploadingCV(true);
      const response = await userApi.updateCV(user.id, file, token);

      // Update user with full user data from response
      if (response.data) {
        updateUser(response.data);
        toast.success("Tải CV lên thành công!");
      }
    } catch (error) {
      console.error("Upload CV error:", error);
      toast.error("Tải CV lên thất bại!");
    } finally {
      setUploadingCV(false);
      event.target.value = "";
    }
  };

  // Filter skills
  const filteredSkills = Array.isArray(allSkills)
    ? allSkills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !Array.isArray(userSkills)
          ? true
          : !userSkills.some((us) => us.id === skill.id),
      )
    : [];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Vui lòng đăng nhập để xem hồ sơ
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-8 max-w-5xl">
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
          <h1 className="text-xl sm:text-3xl font-bold">Hồ sơ / CV của tôi</h1>
        </div>

        <Card className="bg-card">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-foreground text-sm sm:text-lg">Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className="text-xs font-medium text-foreground">
                  Họ và tên
                </label>
                <p className="text-xs sm:text-base text-muted-foreground">{user.fullname}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">
                  Email
                </label>
                <p className="text-xs sm:text-base text-muted-foreground truncate">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="text-xs font-medium text-foreground">
                    Số điện thoại
                  </label>
                  <p className="text-xs sm:text-base text-muted-foreground">{user.phone}</p>
                </div>
              )}
              {user.address && (
                <div>
                  <label className="text-xs font-medium text-foreground">
                    Địa chỉ
                  </label>
                  <p className="text-xs sm:text-base text-muted-foreground">{user.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-6">
            <CardTitle className="text-foreground text-sm sm:text-lg">Kỹ năng</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={loadAllSkills}
                  className="hover:scale-105 transition-transform text-xs h-7 sm:h-9 w-full sm:w-auto"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Thêm kỹ năng
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    Chọn kỹ năng
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Tìm kiếm kỹ năng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background"
                  />
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {filteredSkills.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          {searchQuery
                            ? "Không tìm thấy kỹ năng"
                            : "Không có kỹ năng khả dụng"}
                        </p>
                      ) : (
                        filteredSkills.map((skill) => (
                          <Button
                            key={skill.id}
                            variant="outline"
                            className="w-full justify-start hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleAddSkill(skill.id)}
                            disabled={addingSkill}
                          >
                            {skill.name}
                          </Button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            {loading ? (
              <div className="flex justify-center py-3">
                <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin text-primary" />
              </div>
            ) : userSkills.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-3">
                Chưa có kỹ năng nào. Hãy thêm kỹ năng của bạn!
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {userSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="group px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1 sm:gap-2 hover:bg-primary/20 transition-colors"
                  >
                    {skill.name}
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-foreground text-sm sm:text-lg">CV đã tải lên</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            {(user as any).cvurl ? (
              <div className="space-y-2 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 border rounded-lg bg-primary/5 gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-base font-medium text-foreground">CV của bạn</p>
                      <p className="text-xs text-muted-foreground">
                        Đã tải lên
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCV((user as any).cvurl, `CV_${user?.fullname || "User"}.pdf`)}
                      className="hover:bg-primary/10 hover:text-primary flex-1 sm:flex-none text-xs h-7 sm:h-9"
                    >
                      Xem CV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary relative flex-1 sm:flex-none text-xs h-7 sm:h-9"
                      disabled={uploadingCV}
                    >
                      {uploadingCV ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3 mr-1" />
                      )}
                      Tải lại
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                        onChange={handleUploadCV}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploadingCV}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center">
                <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2 sm:mb-4" />
                <p className="text-xs sm:text-base text-muted-foreground mb-2 sm:mb-4">
                  Chưa có CV nào được tải lên
                </p>
                <Button
                  variant="outline"
                  className="hover:bg-primary/10 hover:text-primary relative text-xs h-7 sm:h-9"
                  disabled={uploadingCV}
                >
                  {uploadingCV ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3 mr-1" />
                  )}
                  Tải CV lên
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleUploadCV}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadingCV}
                  />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
