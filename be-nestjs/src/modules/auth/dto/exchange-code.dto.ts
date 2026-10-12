import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeCodeDto {
  @IsNotEmpty({ message: 'Mã xác thực code không được để trống' })
  @IsString({ message: 'Mã xác thực code phải là chuỗi ký tự' })
  code!: string;
}
