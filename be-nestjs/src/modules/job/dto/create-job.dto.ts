import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  Min,
  IsIn,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString({ message: 'Tiêu đề công việc phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tiêu đề công việc phải có ít nhất 3 ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề công việc không được để trống' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'Mô tả công việc phải là chuỗi ký tự' })
  description?: string;

  @IsOptional()
  @IsIn(['full-time', 'part-time'], {
    message: 'Hình thức công việc phải là full-time hoặc part-time',
  })
  type?: string = 'full-time';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng tuyển dụng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tuyển dụng tối thiểu là 1' })
  quantity?: number = 1;

  @IsNotEmpty({ message: 'Hạn nộp hồ sơ không được để trống' })
  @IsString({ message: 'Hạn nộp hồ sơ phải là chuỗi ngày hợp lệ (YYYY-MM-DD)' })
  deadline!: string;

  @IsOptional()
  @IsString({ message: 'Mức lương phải là chuỗi ký tự' })
  salary?: string;

  @IsOptional()
  @IsIn(['open', 'closed'], {
    message: 'Trạng thái công việc phải là open hoặc closed',
  })
  status?: string = 'open';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã công ty phải là số' })
  companyid?: number;

  @IsOptional()
  @IsArray({ message: 'Danh sách kỹ năng phải là mảng' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Mỗi mã kỹ năng phải là số' })
  skillids?: number[];
}
