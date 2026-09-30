import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: 'Nội dung bài viết phải là chuỗi ký tự' })
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã công ty phải là số nguyên' })
  companyid?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã người dùng phải là số nguyên' })
  userid?: number;

  @IsOptional()
  keepImageUrls?: string[] | string;
}
