import { z } from "zod";

export const applicationFormSchema = z.object({
  coverLetter: z
    .string()
    .min(10, "Thư xin việc phải có ít nhất 10 ký tự")
    .max(1000, "Thư xin việc không được quá 1000 ký tự"),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
