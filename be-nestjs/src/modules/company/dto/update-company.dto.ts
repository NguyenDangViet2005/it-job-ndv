import {
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên công ty phải có ít nhất 2 ký tự' })
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  coverimage?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  hotline?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email công ty không hợp lệ' })
  companyemail?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Năm thành lập phải là số nguyên' })
  @Min(1800, { message: 'Năm thành lập không hợp lệ' })
  @Max(new Date().getFullYear(), { message: 'Năm thành lập không được vượt quá năm hiện tại' })
  foundedyear?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Mã phường/xã phải là số' })
  wardid?: number;
}
