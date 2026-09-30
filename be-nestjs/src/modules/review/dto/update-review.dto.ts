import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số sao phải là số nguyên' })
  @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
  @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
  rating?: number;

  @IsOptional()
  @IsString({ message: 'Nội dung nhận xét phải là chuỗi' })
  comment?: string;
}
