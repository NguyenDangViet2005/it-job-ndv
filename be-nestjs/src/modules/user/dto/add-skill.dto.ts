import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddSkillDto {
  @Type(() => Number)
  @IsInt({ message: 'skillid phải là số nguyên' })
  @IsNotEmpty({ message: 'skillid không được để trống' })
  skillid!: number;
}
