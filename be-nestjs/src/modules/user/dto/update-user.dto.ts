import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullname?: string;

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
}
