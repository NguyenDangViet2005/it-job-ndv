import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullname!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'], {
    message: 'Giới tính phải là male, female hoặc other',
  })
  gender?: string;

  @IsOptional()
  @IsString()
  dateofbirth?: string;

  @IsOptional()
  @IsIn(['user', 'employer'], {
    message: 'Vai trò chỉ có thể là user hoặc employer',
  })
  role?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
