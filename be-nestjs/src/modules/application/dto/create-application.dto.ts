import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
  @Type(() => Number)
  @IsInt({ message: 'Mã công việc phải là số nguyên' })
  @IsNotEmpty({ message: 'Mã công việc không được để trống' })
  jobid!: number;

  @IsOptional()
  @IsString({ message: 'Đường dẫn CV phải là chuỗi ký tự' })
  cvurl?: string;

  @IsOptional()
  @IsString({ message: 'Thư giới thiệu phải là chuỗi ký tự' })
  coverletter?: string;
}
