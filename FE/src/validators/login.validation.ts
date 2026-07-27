import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;
