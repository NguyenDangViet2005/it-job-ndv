import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterHRDto {
  // === Thông tin tài khoản tuyển dụng ===
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password!: string;

  @IsString({ message: 'Họ và tên phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullname!: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MinLength(10, { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone!: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'], {
    message: 'Giới tính phải là male, female hoặc other',
  })
  gender?: string;

  @IsOptional()
  @IsString()
  dateofbirth?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  coverimage?: string;

  // === Thông tin công ty ===
  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên công ty phải có ít nhất 2 ký tự' })
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  companyName!: string;

  @IsOptional()
  @IsString()
  companyAvatar?: string;

  @IsOptional()
  @IsString()
  companyCoverImage?: string;

  @IsOptional()
  @IsString()
  companyNationality?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @IsOptional()
  @IsString()
  companyHotline?: string;

  @IsOptional()
  @IsString()
  companyemail?: string;

  @IsOptional()
  @IsString()
  companyDescription?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Năm thành lập phải là số nguyên' })
  @Min(1800, { message: 'Năm thành lập không hợp lệ' })
  @Max(new Date().getFullYear(), { message: 'Năm thành lập không được vượt quá năm hiện tại' })
  companyFoundedYear?: number;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Mã tỉnh/thành phố phải là số' })
  @IsNotEmpty({ message: 'Vui lòng chọn tỉnh/thành phố' })
  provinceid!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Mã phường/xã/quận/huyện phải là số' })
  @IsNotEmpty({ message: 'Vui lòng chọn phường/xã/quận/huyện' })
  wardid!: number;
}
