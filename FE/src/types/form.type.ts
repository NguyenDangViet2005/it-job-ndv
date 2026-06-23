// Form Types
export interface RegisterFormData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
