import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Globe, Building2 } from "lucide-react";

interface JobData {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  quantity: number;
  deadline: string;
  salary?: string;
  createdat: string;
  company: {
    id: number;
    name: string;
    avatar?: string;
    website?: string;
    address?: string;
    city?: string;
  };
  skills: Array<{
    id: number;
    name: string;
  }>;
}

interface JobEditForm {
  companyid: number;
  title: string;
  description: string;
  type: string;
  quantity: number;
  deadline: string;
  salary?: string;
  status: string;
}

interface JobDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  job?: JobData | null;
  form?: JobEditForm;
  onFormChange?: (form: JobEditForm) => void;
  onSave?: () => void;
}

const getStatusLabel = (status: string) => {
  const statusLabels = {
    open: "Đang Mở",
    closed: "Đã Đóng",
  };
  return statusLabels[status as keyof typeof statusLabels] || status;
};

const getTypeLabel = (type: string) => {
  const typeLabels = {
    "full-time": "Toàn thời gian",
    "part-time": "Bán thời gian",
    "contract": "Hợp đồng",
    "internship": "Thực tập",
  };
  return typeLabels[type as keyof typeof typeLabels] || type;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function JobDetailModal({
  open,
  onOpenChange,
  mode,
  job,
  form,
  onFormChange,
  onSave,
}: JobDetailModalProps) {
  // Validation: Ensure required props are provided based on mode
  if (mode === "view" && !job) return null;
  if (mode === "edit" && (!form || !onFormChange || !onSave)) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[50vw] !max-w-none sm:!max-w-none max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">
            {mode === "view" ? "Chi Tiết Công Việc" : "Chỉnh Sửa Công Việc"}
          </DialogTitle>
        </DialogHeader>

        {mode === "view" && job ? (
          // VIEW MODE - Simple Design
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 px-1">
            {/* Company Info */}
            {job.company && (
              <div className="flex items-start gap-4 pb-6 border-b">
                {job.company.avatar && (
                  <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg border p-2 flex items-center justify-center">
                    <img
                      src={job.company.avatar}
                      alt={job.company.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {job.company.name}
                  </h3>
                  {job.company.address && (
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-1">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-red-500" />
                      <span>{job.company.address}</span>
                    </div>
                  )}
                  {job.company.website && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Globe className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {job.company.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Title */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Tiêu đề công việc <span className="text-red-500">*</span>
              </Label>
              <div className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-md">
                <p className="font-semibold text-gray-900">{job.title}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Mô tả công việc <span className="text-red-500">*</span>
              </Label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md min-h-[120px]">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Type and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  Loại hình công việc <span className="text-red-500">*</span>
                </Label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-900">{getTypeLabel(job.type)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  Trạng thái <span className="text-red-500">*</span>
                </Label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-900">{getStatusLabel(job.status)}</p>
                </div>
              </div>
            </div>

            {/* Quantity and Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  Số lượng cần tuyển <span className="text-red-500">*</span>
                </Label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-900">{job.quantity}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  Hạn nộp hồ sơ <span className="text-red-500">*</span>
                </Label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-900">{formatDate(job.deadline)}</p>
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Mức lương</Label>
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-md">
                <p className="font-semibold text-green-700">{job.salary || "Thỏa thuận"}</p>
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Kỹ năng yêu cầu</Label>
                <div className="flex gap-2 flex-wrap">
                  {job.skills.map((skill) => (
                    <span 
                      key={skill.id} 
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md border border-gray-200"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // EDIT MODE
          form && onFormChange && (
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 space-y-5">
              {/* Company Info at Top - Edit Mode */}
              {job?.company && (
                <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl border">
                  {job.company.avatar && (
                    <div className="flex-shrink-0 w-24 h-24 bg-white rounded-xl border-2 shadow-sm p-2 flex items-center justify-center">
                      <img
                        src={job.company.avatar}
                        alt={job.company.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <p className="font-bold text-xl truncate">{job.company.name}</p>
                    </div>
                    {job.company.address && (
                      <p className="text-sm text-muted-foreground truncate">
                        📍 {job.company.address}
                      </p>
                    )}
                    {job.company.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-block mt-1 truncate max-w-full"
                      >
                        🌐 {job.company.website}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  Tiêu đề công việc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => onFormChange({ ...form, title: e.target.value })}
                  placeholder="VD: Senior Frontend Developer"
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Mô tả công việc <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    onFormChange({ ...form, description: e.target.value })
                  }
                  placeholder="Nhập mô tả chi tiết về công việc, yêu cầu, trách nhiệm..."
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-semibold">
                    Loại hình công việc <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => onFormChange({ ...form, type: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Toàn thời gian</SelectItem>
                      <SelectItem value="part-time">Bán thời gian</SelectItem>
                      <SelectItem value="contract">Hợp đồng</SelectItem>
                      <SelectItem value="internship">Thực tập</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-semibold">
                    Trạng thái <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      onFormChange({ ...form, status: value })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Đang mở</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="closed">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity and Deadline */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-base font-semibold">
                    Số lượng cần tuyển <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) =>
                      onFormChange({
                        ...form,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="VD: 5"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-base font-semibold">
                    Hạn nộp hồ sơ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      onFormChange({ ...form, deadline: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
              </div>

              {/* Salary Edit */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-base font-semibold">
                  Mức lương
                </Label>
                <Input
                  id="salary"
                  value={form.salary || ""}
                  onChange={(e) =>
                    onFormChange({ ...form, salary: e.target.value })
                  }
                  placeholder="VD: 15 - 25 triệu, Thỏa thuận..."
                  className="h-11"
                />
              </div>
            </div>
          )
        )}

        {mode === "edit" && onSave && (
          <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Hủy
            </Button>
            <Button onClick={onSave} className="min-w-[100px]">
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
