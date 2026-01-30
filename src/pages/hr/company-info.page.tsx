"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { Badge } from "@/components/ui/shadcn/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  Upload,
  Camera,
  Briefcase,
  Star,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { companyApi } from "@/apis/company.api";
import type { Company, CompanyUpdateRequest } from "@/types/api.type";
import { toast } from "sonner";

const HRCompanyInfo = () => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Company data from API
  const [companyData, setCompanyData] = useState<Company | null>(null);

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    nationality: "",
    website: "",
    description: "",
    foundedYear: "",
    address: "",
  });

  // Fetch company data on mount
  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const company = await companyApi.getMyCompany(token || undefined);
      setCompanyData(company);
      setFormData({
        name: company.name || "",
        nationality: company.nationality || "",
        website: company.website || "",
        description: company.description || "",
        foundedYear: company.foundedYear?.toString() || "",
        address: company.address || "",
      });
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Không thể tải thông tin công ty");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!companyData) return;

    try {
      setSaving(true);

      const updateData: CompanyUpdateRequest = {
        name: formData.name,
        nationality: formData.nationality || undefined,
        website: formData.website || undefined,
        description: formData.description || undefined,
        foundedYear: formData.foundedYear
          ? parseInt(formData.foundedYear)
          : undefined,
        address: formData.address || undefined,
      };

      const result = await companyApi.updateMyCompany(
        updateData,
        token || undefined,
      );
      setCompanyData(result.data);
      setIsEditing(false);
      toast.success("Cập nhật thông tin công ty thành công!");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Không thể cập nhật thông tin công ty");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleCoverClick = () => {
    if (isEditing && coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File không được vượt quá 10MB");
      return;
    }

    try {
      setUploadingAvatar(true);
      const result = await companyApi.uploadAvatar(file, token || undefined);

      setCompanyData((prev: Company | null) =>
        prev ? { ...prev, avatar: result.avatarUrl } : prev,
      );
      toast.success("Upload ảnh đại diện thành công!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Không thể upload ảnh đại diện");
    } finally {
      setUploadingAvatar(false);
      // Reset input
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File không được vượt quá 10MB");
      return;
    }

    try {
      setUploadingCover(true);
      const result = await companyApi.uploadCover(file, token || undefined);

      setCompanyData((prev: Company | null) =>
        prev ? { ...prev, coverImage: result.coverImageUrl } : prev,
      );
      toast.success("Upload ảnh bìa thành công!");
    } catch (error) {
      console.error("Error uploading cover:", error);
      toast.error("Không thể upload ảnh bìa");
    } finally {
      setUploadingCover(false);
      // Reset input
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original data
    if (companyData) {
      setFormData({
        name: companyData.name || "",
        nationality: companyData.nationality || "",
        website: companyData.website || "",
        description: companyData.description || "",
        foundedYear: companyData.foundedYear?.toString() || "",
        address: companyData.address || "",
      });
    }
    setIsEditing(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Đang tải thông tin công ty...</p>
        </div>
      </div>
    );
  }

  // No company data
  if (!companyData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Building2 className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Chưa có thông tin công ty</h2>
          <p className="text-muted-foreground">
            Bạn chưa được liên kết với công ty nào
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverUpload}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Thông Tin Công Ty
          </h1>
          <p className="text-muted-foreground text-lg">
            Quản lý hồ sơ và thông tin công ty của bạn
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="gap-2 cursor-target"
              disabled={saving}
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
          )}
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={saving}
            className={cn(
              "gap-2 cursor-target",
              isEditing
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
            )}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Lưu Thay Đổi
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Chỉnh Sửa
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Cover Image & Logo */}
      <Card className="overflow-hidden cursor-target">
        <div className="relative h-64 bg-gradient-to-r from-blue-500 to-cyan-500">
          {companyData.coverImage ? (
            <img
              src={companyData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          )}
          {isEditing && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 gap-2 cursor-target"
              onClick={handleCoverClick}
              disabled={uploadingCover}
            >
              {uploadingCover ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Đổi Ảnh Bìa
                </>
              )}
            </Button>
          )}
        </div>
        <CardContent className="relative pt-16 pb-6">
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl ring-4 ring-background">
                {companyData.avatar ? (
                  <img
                    src={companyData.avatar}
                    alt={companyData.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full cursor-target"
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="ml-40 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold">{companyData.name}</h2>
                <p className="text-muted-foreground mt-1">
                  {companyData.description?.substring(0, 100) ||
                    "Chưa có mô tả"}
                  {companyData.description &&
                  companyData.description.length > 100
                    ? "..."
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span className="text-2xl font-bold">4.5</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {companyData.nationality && (
                <Badge variant="outline" className="gap-1">
                  <Globe className="h-3 w-3" />
                  {companyData.nationality}
                </Badge>
              )}
              {companyData.foundedYear && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Founded {companyData.foundedYear}
                </Badge>
              )}
              {companyData.address && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {companyData.address}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng Công Việc</p>
                <p className="text-3xl font-bold text-blue-600">
                  {companyData.jobs?.length || 0}
                </p>
              </div>
              <Briefcase className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bài Viết</p>
                <p className="text-3xl font-bold text-green-600">
                  {companyData.posts?.length || 0}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Người Theo Dõi</p>
                <p className="text-3xl font-bold text-purple-600">
                  {companyData.follows?.length || 0}
                </p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đánh Giá</p>
                <p className="text-3xl font-bold text-orange-600">
                  {companyData.reviews?.length || 0}
                </p>
              </div>
              <Star className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="cursor-target">
            Thông Tin Cơ Bản
          </TabsTrigger>
          <TabsTrigger value="contact" className="cursor-target">
            Thông Tin Liên Hệ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tổng Quan Công Ty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Công Ty *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="cursor-target"
                  placeholder="Nhập tên công ty"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Quốc Tịch</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target"
                    placeholder="VD: Việt Nam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Năm Thành Lập</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target"
                    placeholder="VD: 2020"
                    min="1800"
                    max="2100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md cursor-target resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Mô tả về công ty của bạn..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Liên Hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground mt-2" />
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa Chỉ</Label>
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target"
                    placeholder="Nhập địa chỉ công ty"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRCompanyInfo;
