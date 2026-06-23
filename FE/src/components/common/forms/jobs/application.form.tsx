"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  applicationFormSchema,
  ApplicationFormData,
} from "@/validators/application.validation";
import { applicationApi } from "@/apis/application.api";
import { userApi } from "@/apis/user.api";
import { useAuth } from "@/lib/hooks/useAuth";
import { FileText, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { openCV } from "@/utils";
interface ApplicationFormProps {
  jobid: number;
  jobTitle: string;
  companyName: string;
  onClose?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
}

export default function ApplicationForm({
  jobid,
  jobTitle,
  companyName,
  onClose,
  onSuccess,
  isModal = false,
}: ApplicationFormProps) {
  const { user, token, updateUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      coverletter: "",
    },
  });

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      router.back();
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

  const onSubmit = async (values: ApplicationFormData) => {
    if (!user || !token) {
      toast.error("Vui lòng đăng nhập để ứng tuyển");
      return;
    }

    // Sử dụng CV URL đã upload
    const cvurl = (user as any).cvurl || "";

    if (!cvurl) {
      toast.error("Vui lòng tải CV lên trước khi ứng tuyển");
      return;
    }

    setIsLoading(true);

    try {
      const response = await applicationApi.create(
        {
          jobid,
          userid: user.id,
          cvurl: cvurl,
          coverletter: values.coverletter,
        },
        token,
      );

      toast.success("Ứng tuyển thành công!");
      form.reset();

      if (onSuccess) {
        onSuccess();
      }

      // Đóng modal hoặc redirect sau 1 giây
      setTimeout(() => {
        if (isModal && onClose) {
          onClose();
        } else {
          router.push("/user/applied-jobs");
        }
      }, 1000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi ứng tuyển"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Form content that can be used in both modal and page mode
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* CV Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            CV của bạn *
          </label>
          {!(user as any)?.cvurl ? (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Chưa có CV nào được tải lên
              </p>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary relative"
                disabled={uploadingCV}
              >
                {uploadingCV ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Tải CV lên
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleUploadCV}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploadingCV}
                />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">CV của bạn</p>
                  <p className="text-sm text-muted-foreground">Đã tải lên</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openCV((user as any).cvurl)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  Xem CV
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary/10 hover:text-primary relative"
                  disabled={uploadingCV}
                >
                  {uploadingCV ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Tải lại
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleUploadCV}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadingCV}
                  />
                </Button>
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Tải CV lên dạng PDF, DOC, DOCX hoặc hình ảnh
          </p>
        </div>

        {/* Cover Letter */}
        <FormField
          control={form.control}
          name="coverletter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thư xin việc *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Giới thiệu về bản thân, kinh nghiệm làm việc và lý do bạn phù hợp với vị trí này..."
                  className="min-h-[150px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tối thiểu 10 ký tự, tối đa 1000 ký tự
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary text-white font-semibold disabled:opacity-50"
          >
            {isLoading ? "Đang gửi..." : "Gửi đơn ứng tuyển"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  );

  // If modal mode, return form content directly without Card wrapper
  if (isModal) {
    return formContent;
  }

  // Page mode: wrap in Card
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Ứng tuyển công việc</CardTitle>
        <CardDescription>
          <div className="mt-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {jobTitle}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {companyName}
            </p>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
