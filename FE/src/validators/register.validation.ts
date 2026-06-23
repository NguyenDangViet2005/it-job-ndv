import { z } from "zod";

// Schema cho đăng ký ứng viên (user)
export const RegisterFormSchema = z.object({
  fullname: z.string().min(2, { message: "Họ tên ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ" })
    .max(15, { message: "Số điện thoại quá dài" }),
  password: z.string().min(6, { message: "Mật khẩu ít nhất 6 ký tự" }),
  gender: z.string().optional(),
  dateofbirth: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

// Schema cho đăng ký nhà tuyển dụng (HR)
export const RegisterHRFormSchema = z.object({
  // User Info
  fullname: z.string().min(2, { message: "Họ tên ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ" })
    .max(15, { message: "Số điện thoại quá dài" }),
  password: z.string().min(6, { message: "Mật khẩu ít nhất 6 ký tự" }),
  gender: z.string().optional(),
  dateofbirth: z.string().optional(),

  // Company Info
  companyName: z.string().min(2, { message: "Tên công ty ít nhất 2 ký tự" }),
  companyWebsite: z
    .string()
    .url({ message: "URL website không hợp lệ" })
    .optional()
    .or(z.literal("")),
  companyHotline: z.string().optional(),
  companyemail: z
    .string()
    .email({ message: "Email công ty không hợp lệ" })
    .optional()
    .or(z.literal("")),
  companyDescription: z.string().optional(),
  companyFoundedYear: z
    .number()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  companyAddress: z.string().optional(),
  companyNationality: z.string().optional(),

  // Location
  provinceid: z.number().min(1, { message: "Vui lòng chọn tỉnh/thành phố" }),
  wardid: z.number().min(1, { message: "Vui lòng chọn quận/huyện" }),
});

export type RegisterHRFormData = z.infer<typeof RegisterHRFormSchema>;
