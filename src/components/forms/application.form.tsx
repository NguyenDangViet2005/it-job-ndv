"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/shadcn/card";
import {
  applicationFormSchema,
  ApplicationFormData,
} from "@/validations/application.validation";
import { applicationApi } from "@/apis/application.api";
import { useAuth } from "@/hooks/useAuth";

interface ApplicationFormProps {
  jobId: number;
  jobTitle: string;
  companyName: string;
  onClose?: () => void;
  isModal?: boolean;
}

export default function ApplicationForm({
  jobId,
  jobTitle,
  companyName,
  onClose,
  isModal = false,
}: ApplicationFormProps) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      cvUrl: "",
      coverLetter: "",
    },
  });

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const onSubmit = async (values: ApplicationFormData) => {
    if (!user || !token) {
      setError("Vui lòng đăng nhập để ứng tuyển");
      return;
    }

    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await applicationApi.create(
        {
          jobId,
          userId: user.id,
          cvUrl: values.cvUrl,
          coverLetter: values.coverLetter,
        },
        token
      );

      setSuccess(true);
      form.reset();

      // Đóng modal hoặc redirect sau 2 giây
      setTimeout(() => {
        if (isModal && onClose) {
          onClose();
        } else {
          router.push("/user/applied-jobs");
        }
      }, 2000);
    } catch (err) {
      setError(
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
        {/* Success Message */}
        {success && (
          <div className="p-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
            ✓ Ứng tuyển thành công!{" "}
            {isModal ? "Đang đóng..." : "Đang chuyển hướng..."}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* CV URL */}
        <FormField
          control={form.control}
          name="cvUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link CV của bạn *</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://drive.google.com/cv/yourname.pdf"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Nhập link Google Drive, Dropbox hoặc link CV online của bạn
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Letter */}
        <FormField
          control={form.control}
          name="coverLetter"
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
            disabled={isLoading || success}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold disabled:opacity-50"
          >
            {isLoading
              ? "Đang gửi..."
              : success
              ? "Đã gửi thành công"
              : "Gửi đơn ứng tuyển"}
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
