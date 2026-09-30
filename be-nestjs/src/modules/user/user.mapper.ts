import { UpdateUserDto } from './dto/update-user.dto.js';

export class UserMapper {
  /**
   * Loại bỏ các trường nhạy cảm khỏi user object trước khi trả về
   */
  static toSafeUser(user: any) {
    if (!user) return null;
    const { password, refreshtoken, ...rest } = user;
    return rest;
  }

  /**
   * Định dạng dữ liệu xem hồ sơ công khai của người dùng
   */
  static toUserProfileResponse(user: any) {
    const safe = this.toSafeUser(user);
    if (!safe) return null;

    return {
      id: safe.id,
      fullname: safe.fullname,
      avatar: safe.avatar,
      coverimage: safe.coverimage,
      role: safe.role,
      gender: safe.gender,
      cvurl: safe.cvurl,
      createdat: safe.createdat,
    };
  }

  /**
   * Map từ UpdateUserDto sang payload cập nhật User trong database
   */
  static toUpdateUserEntity(dto: UpdateUserDto) {
    const updateData: Record<string, any> = {};

    if (dto.fullname !== undefined) updateData.fullname = dto.fullname.trim();
    if (dto.phone !== undefined) updateData.phone = dto.phone.trim();
    if (dto.gender !== undefined) updateData.gender = dto.gender;
    if (dto.dateofbirth !== undefined) {
      updateData.dateofbirth = dto.dateofbirth ? new Date(dto.dateofbirth) : null;
    }

    return updateData;
  }
}
