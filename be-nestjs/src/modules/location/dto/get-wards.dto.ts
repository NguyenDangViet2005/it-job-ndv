import { IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWardsDto {
  @Type(() => Number)
  @IsInt({ message: 'Mã tỉnh/thành phố (provinceid) phải là số nguyên' })
  @IsNotEmpty({ message: 'Vui lòng cung cấp mã tỉnh/thành phố (provinceid)' })
  provinceid!: number;
}
