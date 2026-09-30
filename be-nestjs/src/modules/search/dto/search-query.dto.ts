import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQueryDto {
  @IsNotEmpty({ message: 'Từ khóa tìm kiếm không được để trống' })
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  keyword: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}
