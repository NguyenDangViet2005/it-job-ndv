import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Mã công ty không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'Mã công ty phải là số nguyên' })
  companyid: number;

  @IsNotEmpty({ message: 'Đánh giá số sao không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'Số sao phải là số nguyên' })
  @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
  @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Nội dung nhận xét phải là chuỗi' })
  comment?: string;
}
