import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';

export interface FormattedCompany {
  id: number;
  name: string;
  avatar: string | null;
  coverimage: string | null;
  nationality: string | null;
  website: string | null;
  description: string | null;
  foundedyear: number | null;
  address: string | null;
  hotline: string | null;
  companyemail: string | null;
  wardid: number | null;
  wardname: string | null;
  provincename: string | null;
  createdbyuserid: number | null;
  createdat: Date | null;
  updatedat: Date | null;
  follows: any[];
  members: any[];
  membersCount: number;
  jobs: any[];
  posts: any[];
  reviews: any[];
}

export class CompanyMapper {
  /**
   * Chuyển đổi Company entity và thông tin địa phương thành FormattedCompany response
   */
  static toCompanyResponse(comp: any, ward?: any): FormattedCompany {
    return {
      id: comp.id,
      name: comp.name,
      avatar: comp.avatar || null,
      coverimage: comp.coverimage || null,
      nationality: comp.nationality || null,
      website: comp.website || null,
      description: comp.description || null,
      foundedyear: comp.foundedyear || null,
      address: comp.address || null,
      hotline: comp.hotline || null,
      companyemail: comp.companyemail || null,
      wardid: comp.wardid || null,
      wardname: ward?.name || null,
      provincename: ward?.provinces?.name || null,
      createdbyuserid: comp.createdbyuserid || null,
      createdat: comp.createdat || null,
      updatedat: comp.updatedat || null,
      follows: comp.follows || [],
      members: comp.companyMembers || [],
      membersCount: comp.companyMembers ? comp.companyMembers.length : 0,
      jobs: comp.jobs || [],
      posts: comp.posts || [],
      reviews: comp.reviews || [],
    };
  }

  /**
   * Chuyển đổi Company entity thành response gọn gàng cho danh sách logo
   */
  static toCompanyLogoResponse(comp: any) {
    return {
      id: comp.id,
      name: comp.name,
      avatar: comp.avatar || null,
    };
  }

  /**
   * Map từ CreateCompanyDto sang payload lưu trữ entity Company trong DB
   */
  static toCreateCompanyEntity(dto: CreateCompanyDto, userId: number) {
    return {
      name: dto.name.trim() as any,
      avatar: (dto.avatar || null) as any,
      coverimage: (dto.coverimage || null) as any,
      nationality: (dto.nationality || null) as any,
      website: (dto.website || null) as any,
      hotline: (dto.hotline || null) as any,
      companyemail: (dto.companyemail?.toLowerCase().trim() || null) as any,
      description: (dto.description || null) as any,
      foundedyear: (dto.foundedyear || null) as any,
      address: (dto.address || null) as any,
      wardid: (dto.wardid || null) as any,
      createdbyuserid: userId as any,
    };
  }

  /**
   * Map từ UpdateCompanyDto sang payload cập nhật entity Company trong DB
   */
  static toUpdateCompanyEntity(dto: UpdateCompanyDto) {
    const updateData: Record<string, any> = {};

    if (dto.name !== undefined) updateData.name = dto.name.trim();
    if (dto.avatar !== undefined) updateData.avatar = dto.avatar;
    if (dto.coverimage !== undefined) updateData.coverimage = dto.coverimage;
    if (dto.nationality !== undefined) updateData.nationality = dto.nationality;
    if (dto.website !== undefined) updateData.website = dto.website;
    if (dto.hotline !== undefined) updateData.hotline = dto.hotline;
    if (dto.companyemail !== undefined) {
      updateData.companyemail = dto.companyemail?.toLowerCase().trim();
    }
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.foundedyear !== undefined) updateData.foundedyear = dto.foundedyear;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.wardid !== undefined) updateData.wardid = dto.wardid;

    updateData.updatedat = nowPlainDateTime();
    return updateData;
  }
}
