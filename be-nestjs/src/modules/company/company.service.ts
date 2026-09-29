import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '~/prisma/db.js';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { CompanyQueryDto } from './dto/company-query.dto.js';

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

@Injectable()
export class CompanyService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Định dạng dữ liệu công ty kèm theo thông tin địa phương (xã/phường, tỉnh/thành)
   */
  private formatCompany(comp: any, ward?: any): FormattedCompany {
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
   * Lấy danh sách công ty với phân trang và tìm kiếm theo tên
   */
  async getCompanies(query: CompanyQueryDto) {
    const pageNumber = query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || query.search || '').trim();

    let count: number;
    let rows: any[];

    if (keyword) {
      const agg = await db.orm.public.Company
        .where((c: any) => c.name.ilike(`%${keyword}%`))
        .aggregate((a) => ({ count: a.count() }));
      count = agg.count;

      rows = await db.orm.public.Company
        .where((c: any) => c.name.ilike(`%${keyword}%`))
        .include('companyMembers')
        .include('jobs')
        .include('posts')
        .include('reviews')
        .include('follows')
        .orderBy((c: any) => c.id.desc())
        .offset((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .all();
    } else {
      const agg = await db.orm.public.Company.aggregate((a) => ({
        count: a.count(),
      }));
      count = agg.count;

      rows = await db.orm.public.Company
        .include('companyMembers')
        .include('jobs')
        .include('posts')
        .include('reviews')
        .include('follows')
        .orderBy((c: any) => c.id.desc())
        .offset((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .all();
    }

    // Tối ưu hóa truy vấn thông tin địa lý gộp trong 1 query (tránh N+1)
    const wardIds = [...new Set(rows.map((c: any) => c.wardid).filter(Boolean))];
    let wardMap = new Map<number, any>();
    if (wardIds.length > 0) {
      const wards = await db.orm.public.Wards
        .where((w: any) => w.id.in(wardIds))
        .include('provinces')
        .all();
      wardMap = new Map(wards.map((w: any) => [w.id, w]));
    }

    const formatted = rows.map((c: any) =>
      this.formatCompany(c, c.wardid ? wardMap.get(c.wardid) : null),
    );

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Lấy danh sách logo các công ty
   */
  async getCompanyLogos(query: CompanyQueryDto) {
    const pageNumber = query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const { count } = await db.orm.public.Company.aggregate((a) => ({
      count: a.count(),
    }));

    const rows = await db.orm.public.Company
      .orderBy((c: any) => c.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

    const formatted = rows.map((c: any) => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar,
    }));

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Lấy chi tiết công ty theo ID
   */
  async getCompanyById(id: number): Promise<FormattedCompany> {
    const comp = await db.orm.public.Company
      .where({ id })
      .include('companyMembers')
      .include('jobs')
      .include('posts')
      .include('reviews')
      .include('follows')
      .first();

    if (!comp) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    let ward: any = null;
    if (comp.wardid) {
      ward = await db.orm.public.Wards
        .where({ id: comp.wardid })
        .include('provinces')
        .first();
    }

    return this.formatCompany(comp, ward);
  }

  /**
   * Lấy thông tin công ty của HR hiện tại
   */
  async getCompanyByUserId(userId: number): Promise<FormattedCompany> {
    // 1. Kiểm tra thành viên công ty đang hoạt động
    const member = await db.orm.public.CompanyMembers
      .where({ userid: userId, status: 'active' as any })
      .first();

    // 2. Nếu không tìm thấy trong thành viên, kiểm tra xem có phải người tạo công ty không
    let companyId = member?.companyid;
    if (!companyId) {
      const createdCompany = await db.orm.public.Company
        .where({ createdbyuserid: userId })
        .first();
      companyId = createdCompany?.id;
    }

    if (!companyId) {
      throw new NotFoundException('Bạn chưa được liên kết với công ty nào');
    }

    return this.getCompanyById(companyId);
  }

  /**
   * Tạo mới công ty và gắn người dùng làm thành viên quản trị
   */
  async createCompany(userId: number, dto: CreateCompanyDto): Promise<FormattedCompany> {
    if (dto.wardid) {
      const ward = await db.orm.public.Wards.where({ id: dto.wardid }).first();
      if (!ward) {
        throw new BadRequestException('Phường/Xã không tồn tại');
      }
    }

    const newCompany = await db.orm.public.Company.create({
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
    });

    await db.orm.public.CompanyMembers.create({
      companyid: newCompany.id as any,
      userid: userId as any,
      status: 'active' as any,
      joinedat: new Date() as any,
    });

    return this.getCompanyById(newCompany.id);
  }

  /**
   * Cập nhật thông tin công ty
   */
  async updateCompany(
    companyId: number,
    currentUser: { id: number; role: string },
    dto: UpdateCompanyDto,
  ): Promise<FormattedCompany> {
    const company = await db.orm.public.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    // Kiểm tra quyền: Admin hoặc thành viên/người tạo công ty
    if (currentUser.role !== 'admin' && company.createdbyuserid !== currentUser.id) {
      const isMember = await db.orm.public.CompanyMembers
        .where({ companyid: companyId, userid: currentUser.id, status: 'active' as any })
        .first();
      if (!isMember) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa công ty này');
      }
    }

    if (dto.wardid) {
      const ward = await db.orm.public.Wards.where({ id: dto.wardid }).first();
      if (!ward) {
        throw new BadRequestException('Phường/Xã không tồn tại');
      }
    }

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name.trim();
    if (dto.avatar !== undefined) updateData.avatar = dto.avatar;
    if (dto.coverimage !== undefined) updateData.coverimage = dto.coverimage;
    if (dto.nationality !== undefined) updateData.nationality = dto.nationality;
    if (dto.website !== undefined) updateData.website = dto.website;
    if (dto.hotline !== undefined) updateData.hotline = dto.hotline;
    if (dto.companyemail !== undefined) updateData.companyemail = dto.companyemail?.toLowerCase().trim();
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.foundedyear !== undefined) updateData.foundedyear = dto.foundedyear;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.wardid !== undefined) updateData.wardid = dto.wardid;
    updateData.updatedat = new Date();

    await db.orm.public.Company.where({ id: companyId }).update(updateData);
    return this.getCompanyById(companyId);
  }

  /**
   * Xóa công ty và toàn bộ dữ liệu liên quan (jobs, posts, attachments, reviews...)
   */
  async deleteCompany(companyId: number, currentUser: { id: number; role: string }) {
    const company = await db.orm.public.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    if (currentUser.role !== 'admin' && company.createdbyuserid !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền xóa công ty này');
    }

    // 1. Xóa ảnh đại diện và ảnh bìa trên Cloudinary
    if (company.avatar) {
      await this.cloudinaryService.deleteFile(company.avatar).catch(() => {});
    }
    if (company.coverimage) {
      await this.cloudinaryService.deleteFile(company.coverimage).catch(() => {});
    }

    // 2. Dọn dẹp Jobs và Applications
    const jobs = await db.orm.public.Job.where({ companyid: companyId }).all();
    const jobIds = jobs.map((j: any) => j.id);

    if (jobIds.length > 0) {
      await db.orm.public.Application.where((a: any) => a.jobid.in(jobIds)).delete();
      await db.orm.public.SkillJob.where((sj: any) => sj.jobid.in(jobIds)).delete();
      await db.orm.public.Job.where((j: any) => j.id.in(jobIds)).delete();
    }

    // 3. Dọn dẹp Posts, Attachments (trên Cloudinary và DB), Interactions
    const posts = await db.orm.public.Post.where({ companyid: companyId }).all();
    const postIds = posts.map((p: any) => p.id);

    if (postIds.length > 0) {
      const attachments = await db.orm.public.Attachment
        .where((att: any) => att.postid.in(postIds))
        .all();

      for (const att of attachments) {
        if (att.fileurl) {
          await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
        }
      }

      await db.orm.public.Attachment.where((att: any) => att.postid.in(postIds)).delete();
      await db.orm.public.Interaction.where((it: any) => it.postid.in(postIds)).delete();
      await db.orm.public.Post.where((p: any) => p.id.in(postIds)).delete();
    }

    // 4. Dọn dẹp Follows, Reviews, CompanyMembers
    await db.orm.public.Follow.where({ companyid: companyId }).delete();
    await db.orm.public.Review.where({ companyid: companyId }).delete();
    await db.orm.public.CompanyMembers.where({ companyid: companyId }).delete();

    // 5. Xóa Company
    await db.orm.public.Company.where({ id: companyId }).delete();

    return { success: true, message: 'Xóa công ty thành công' };
  }

  /**
   * Upload ảnh đại diện công ty: Tải lên Cloudinary trước, cập nhật DB rồi mới xóa ảnh cũ
   */
  async uploadCompanyAvatar(companyId: number, file: Express.Multer.File) {
    const company = await db.orm.public.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    const uploadRes = await this.cloudinaryService.uploadFile(file);
    const oldAvatar = company.avatar;

    await db.orm.public.Company.where({ id: companyId }).update({
      avatar: uploadRes.secure_url as any,
      updatedat: new Date() as any,
    });

    if (oldAvatar) {
      await this.cloudinaryService.deleteFile(oldAvatar).catch(() => {});
    }

    return uploadRes.secure_url;
  }

  /**
   * Upload ảnh bìa công ty: Tải lên Cloudinary trước, cập nhật DB rồi mới xóa ảnh cũ
   */
  async uploadCompanyCover(companyId: number, file: Express.Multer.File) {
    const company = await db.orm.public.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    const uploadRes = await this.cloudinaryService.uploadFile(file);
    const oldCover = company.coverimage;

    await db.orm.public.Company.where({ id: companyId }).update({
      coverimage: uploadRes.secure_url as any,
      updatedat: new Date() as any,
    });

    if (oldCover) {
      await this.cloudinaryService.deleteFile(oldCover).catch(() => {});
    }

    return uploadRes.secure_url;
  }
}
