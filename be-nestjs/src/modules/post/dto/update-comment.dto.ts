import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCommentDto {
  @IsOptional()
  @IsString({ message: 'Nội dung bình luận phải là chuỗi' })
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Mã người dùng phải là số nguyên' })
  userid?: number;

  @IsOptional()
  keepImageUrls?: string[] | string;
}
