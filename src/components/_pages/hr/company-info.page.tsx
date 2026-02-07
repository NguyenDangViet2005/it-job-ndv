"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/useAuth";
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
import type {  CompanyUpdateRequest } from "@/types/api.type";
import { toast } from "sonner";
import { Company } from "@/types";
import KPI from "@/components/sections/hr/kpi.section";
import Image from "next/image";
import HRCompanyInfoSkeleton from "@/components/common/skeletons/hr/company-info.skeleton";

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

  // Stats data
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalPosts: 0,
    totalFollowers: 0,
    totalReviews: 0,
  });

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    nationality: "",
    website: "",
    description: "",
    foundedyear: "",
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
      
      // Set stats from company data
      setStats({
        totalJobs: company.jobs?.length || 0,
        totalPosts: company.posts?.length || 0,
        totalFollowers: company.follows?.length || 0,
        totalReviews: company.reviews?.length || 0,
      });

      setFormData({
        name: company.name || "",
        nationality: company.nationality || "",
        website: company.website || "",
        description: company.description || "",
        foundedyear: company.foundedyear?.toString() || "",
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
        foundedyear: formData.foundedyear
          ? parseInt(formData.foundedyear)
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
        prev ? { ...prev, coverimage: result.coverimageUrl } : prev,
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
        foundedyear: companyData.foundedyear?.toString() || "",
        address: companyData.address || "",
      });
    }
    setIsEditing(false);
  };

  // Loading state
  if (loading) {
    return <HRCompanyInfoSkeleton />;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Bảng Điều Khiển HR
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Tổng quan về hoạt động tuyển dụng và thông tin công ty
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="gap-2 cursor-target text-sm"
              disabled={saving}
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Hủy</span>
            </Button>
          )}
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={saving}
            className={cn(
              "gap-2 cursor-target text-sm",
              isEditing
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
            )}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Đang lưu...</span>
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Lưu</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Chỉnh Sửa</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <KPI />

      {/* Cover Image & Logo */}
      <Card className="overflow-hidden cursor-target p-0">
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-r from-blue-500 to-cyan-500">
          {companyData.coverimage ? (
            <Image
              src={companyData.coverimage}
              alt="Cover"
              fill
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          )}
          {isEditing && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 gap-1 sm:gap-2 cursor-target text-xs sm:text-sm"
              onClick={handleCoverClick}
              disabled={uploadingCover}
            >
              {uploadingCover ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="hidden sm:inline">Đang tải...</span>
                </>
              ) : (
                <>
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Đổi Ảnh Bìa</span>
                </>
              )}
            </Button>
          )}
        </div>
        <CardContent className="relative pt-12 sm:pt-16 pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-2 shadow-xl ring-4 ring-background">
                {companyData.avatar ? (
                  <Image
                    src={companyData.avatar}
                    alt={companyData.name}
                    fill
                    className="w-full h-full rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full cursor-target"
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="sm:ml-40 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-5 sm:-mt-15">{companyData.name}</h2>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  {companyData.description?.substring(0, 100) ||
                    "Chưa có mô tả"}
                  {companyData.description &&
                  companyData.description.length > 100
                    ? "..."
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-500 text-yellow-500" />
                <span className="text-xl sm:text-2xl font-bold">4.5</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {companyData.nationality && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Globe className="h-3 w-3" />
                  {companyData.nationality}
                </Badge>
              )}
              {companyData.foundedyear && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  Thành lập {companyData.foundedyear}
                </Badge>
              )}
              {companyData.address && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[200px]">{companyData.address}</span>
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Tổng Công Việc</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {stats.totalJobs}
                </p>
              </div>
              <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Bài Viết</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {stats.totalPosts}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Người Theo Dõi</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {stats.totalFollowers}
                </p>
              </div>
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-target hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Đánh Giá</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {stats.totalReviews}
                </p>
              </div>
              <Star className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
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

        <TabsContent value="basic" className="space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Tổng Quan Công Ty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Tên Công Ty *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="cursor-target text-sm"
                  placeholder="Nhập tên công ty"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality" className="text-sm">Quốc Tịch</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target text-sm"
                    placeholder="VD: Việt Nam"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedyear" className="text-sm">Năm Thành Lập</Label>
                  <Input
                    id="foundedyear"
                    type="number"
                    value={formData.foundedyear}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target text-sm"
                    placeholder="VD: 2020"
                    min="1800"
                    max="2100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Mô Tả</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md cursor-target resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  placeholder="Mô tả về công ty của bạn..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-4 sm:mt-6">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Thông Tin Liên Hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm">Website</Label>
                <div className="flex gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target text-sm"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm">Địa Chỉ</Label>
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="cursor-target text-sm"
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
