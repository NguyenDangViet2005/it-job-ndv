import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsIn(['pending', 'reviewed', 'accepted', 'rejected'], {
    message: 'Trạng thái đơn ứng tuyển phải là pending, reviewed, accepted hoặc rejected',
  })
  @IsNotEmpty({ message: 'Trạng thái đơn ứng tuyển không được để trống' })
  status!: string;

  @IsOptional()
  @IsString({ message: 'Đường dẫn CV phải là chuỗi ký tự' })
  cvurl?: string;

  @IsOptional()
  @IsString({ message: 'Thư giới thiệu phải là chuỗi ký tự' })
  coverletter?: string;
}
