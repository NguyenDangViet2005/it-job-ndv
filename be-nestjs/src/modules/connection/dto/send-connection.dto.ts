import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SendConnectionDto {
  @IsNotEmpty({ message: 'Mã người dùng cần kết nối không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'Mã người dùng cần kết nối phải là số nguyên' })
  connecteduserid: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã người dùng gửi lời mời phải là số nguyên' })
  userid?: number;
}
