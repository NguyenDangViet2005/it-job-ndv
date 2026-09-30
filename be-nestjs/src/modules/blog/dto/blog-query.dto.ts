import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BlogQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang tối thiểu là 1' })
  pageNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Kích thước trang phải là số nguyên' })
  @Min(1, { message: 'Kích thước trang tối thiểu là 1' })
  pageSize?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã danh mục phải là số nguyên' })
  categoryid?: number;

  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  keyword?: string;
}
