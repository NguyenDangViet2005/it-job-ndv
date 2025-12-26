import { z } from "zod";

export const applicationFormSchema = z.object({
  cvUrl: z
    .string()
    .min(1, "Vui lòng nhập link CV của bạn")
    .url("Link CV không hợp lệ"),
  coverLetter: z
    .string()
    .min(10, "Thư xin việc phải có ít nhất 10 ký tự")
    .max(1000, "Thư xin việc không được quá 1000 ký tự"),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
