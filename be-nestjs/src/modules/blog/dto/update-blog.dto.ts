import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBlogDto {
  @IsOptional()
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  content?: string;

  @IsOptional()
  @IsString({ message: 'Tóm tắt bài viết phải là chuỗi ký tự' })
  excerpt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã danh mục phải là số nguyên' })
  categoryid?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Thời gian đọc phải là số phút' })
  readtime?: number;
}
