import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ToggleFollowDto {
  @IsNotEmpty({ message: 'Mã công ty không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'Mã công ty phải là số nguyên' })
  companyid: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã người dùng phải là số nguyên' })
  userid?: number;
}
