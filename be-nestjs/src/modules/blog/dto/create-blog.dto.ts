import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBlogDto {
  @IsNotEmpty({ message: 'Tiêu đề bài viết không được để trống' })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  title: string;

  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  content: string;

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

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã tác giả phải là số nguyên' })
  userid?: number;
}
