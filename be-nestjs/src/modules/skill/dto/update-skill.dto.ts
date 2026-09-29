import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateSkillDto {
  @IsString({ message: 'Tên kỹ năng phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên kỹ năng không được để trống' })
  @MaxLength(100, { message: 'Tên kỹ năng không được vượt quá 100 ký tự' })
  name!: string;
}
