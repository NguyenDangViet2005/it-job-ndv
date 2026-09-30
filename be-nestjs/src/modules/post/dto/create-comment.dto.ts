import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  @IsString({ message: 'Nội dung bình luận phải là chuỗi' })
  content: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã người dùng phải là số nguyên' })
  userid?: number;
}
