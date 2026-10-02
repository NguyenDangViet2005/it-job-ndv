import { RegisterDto } from './dto/register.dto.js';
import { RegisterHRDto } from './dto/register-hr.dto.js';
import {
  toPlainDate,
  formatDateString,
  nowPlainDateTime,
} from '~/common/utils/temporal.util.js';
import { DEFAULT_USER_AVATAR } from '~/common/constants/index.js';

export class AuthMapper {
  /**
   * Chuyển đổi RegisterDto sang payload tạo User trong database
   */
  static toCreateUserEntity(dto: RegisterDto, hashedPassword: string) {
    return {
      email: dto.email.toLowerCase().trim() as any,
      password: hashedPassword as any,
      fullname: dto.fullname.trim() as any,
      phone: (dto.phone?.trim() || null) as any,
      gender: (dto.gender || null) as any,
      dateofbirth: toPlainDate(dto.dateofbirth) as any,
      role: (dto.role || 'user') as any,
      avatar: (dto.avatar || DEFAULT_USER_AVATAR) as any,
    };
  }

  /**
   * Chuyển đổi RegisterHRDto sang payload tạo User (Employer) trong database
   */
  static toCreateHREmployerEntity(dto: RegisterHRDto, hashedPassword: string) {
    return {
      email: dto.email.toLowerCase().trim() as any,
      password: hashedPassword as any,
      fullname: dto.fullname.trim() as any,
      phone: (dto.phone?.trim() || null) as any,
      gender: (dto.gender || null) as any,
      dateofbirth: toPlainDate(dto.dateofbirth) as any,
      avatar: (dto.avatar || DEFAULT_USER_AVATAR) as any,
      coverimage: (dto.coverimage || null) as any,
      role: 'employer' as any,
    };
  }

  /**
   * Chuyển đổi RegisterHRDto sang payload tạo Company trong database
   */
  static toCreateHRCompanyEntity(dto: RegisterHRDto, userId: number) {
    return {
      name: dto.companyName.trim() as any,
      avatar: (dto.companyAvatar || null) as any,
      coverimage: (dto.companyCoverImage || null) as any,
      nationality: (dto.companyNationality || null) as any,
      website: (dto.companyWebsite || null) as any,
      hotline: (dto.companyHotline || null) as any,
      companyemail: (dto.companyemail?.toLowerCase().trim() || null) as any,
      description: (dto.companyDescription || null) as any,
      foundedyear: (dto.companyFoundedYear || null) as any,
      address: (dto.companyAddress || null) as any,
      wardid: dto.wardid as any,
      createdbyuserid: userId as any,
    };
  }

  /**
   * Payload tạo CompanyMembers ban đầu cho HR
   */
  static toCreateHRCompanyMemberEntity(companyId: number, userId: number) {
    return {
      companyid: companyId as any,
      userid: userId as any,
      status: 'active' as any,
      joinedat: nowPlainDateTime() as any,
    };
  }

  /**
   * Loại bỏ các trường nhạy cảm khỏi user object trước khi trả về client
   */
  static toSafeUser(user: any) {
    if (!user) return null;
    const { password, refreshtoken, ...rest } = user;
    if (rest.dateofbirth) {
      rest.dateofbirth = formatDateString(rest.dateofbirth);
    }
    rest.avatar = rest.avatar || DEFAULT_USER_AVATAR;
    return rest;
  }

  /**
   * Định dạng dữ liệu công ty kèm thông tin địa phương trả về cho HR lúc đăng ký
   */
  static toHRCompanyResponse(company: any, ward: any) {
    return {
      id: company.id,
      name: company.name,
      avatar: company.avatar || null,
      coverimage: company.coverimage || null,
      nationality: company.nationality || null,
      website: company.website || null,
      description: company.description || null,
      foundedyear: company.foundedyear || null,
      address: company.address || null,
      hotline: company.hotline || null,
      companyemail: company.companyemail || null,
      wardid: company.wardid,
      wardname: ward?.name || null,
      provincename: ward?.provinces?.name || null,
      createdbyuserid: company.createdbyuserid,
      createdat: company.createdat,
      updatedat: company.updatedat,
    };
  }
}
