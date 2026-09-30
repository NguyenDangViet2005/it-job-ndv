import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { CompanyQueryDto } from './dto/company-query.dto.js';
import { CompanyMapper, type FormattedCompany } from './company.mapper.js';

export type { FormattedCompany };

@Injectable()
export class CompanyService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

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
      const agg = await orm.Company
        .where((c: any) => c.name.ilike(`%${keyword}%`))
        .aggregate((a) => ({ count: a.count() }));
      count = agg.count;

      rows = await orm.Company
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
      const agg = await orm.Company.aggregate((a) => ({
        count: a.count(),
      }));
      count = agg.count;

      rows = await orm.Company
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
      const wards = await orm.Wards
        .where((w: any) => w.id.in(wardIds))
        .include('provinces')
        .all();
      wardMap = new Map(wards.map((w: any) => [w.id, w]));
    }

    const formatted = rows.map((c: any) =>
      CompanyMapper.toCompanyResponse(c, c.wardid ? wardMap.get(c.wardid) : null),
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

    const { count } = await orm.Company.aggregate((a) => ({
      count: a.count(),
    }));

    const rows = await orm.Company
      .orderBy((c: any) => c.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

    const formatted = rows.map((c: any) => CompanyMapper.toCompanyLogoResponse(c));

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
    const comp = await orm.Company
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
      ward = await orm.Wards
        .where({ id: comp.wardid })
        .include('provinces')
        .first();
    }

    return CompanyMapper.toCompanyResponse(comp, ward);
  }

  /**
   * Lấy thông tin công ty của HR hiện tại
   */
  async getCompanyByUserId(userId: number): Promise<FormattedCompany> {
    // 1. Kiểm tra thành viên công ty đang hoạt động
    const member = await orm.CompanyMembers
      .where({ userid: userId, status: 'active' as any })
      .first();

    // 2. Nếu không tìm thấy trong thành viên, kiểm tra xem có phải người tạo công ty không
    let companyId = member?.companyid;
    if (!companyId) {
      const createdCompany = await orm.Company
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
      const ward = await orm.Wards.where({ id: dto.wardid }).first();
      if (!ward) {
        throw new BadRequestException('Phường/Xã không tồn tại');
      }
    }

    const companyEntity = CompanyMapper.toCreateCompanyEntity(dto, userId);
    const newCompany = await orm.Company.create(companyEntity);

    await orm.CompanyMembers.create({
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
    const company = await orm.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    // Kiểm tra quyền: Admin hoặc thành viên/người tạo công ty
    if (currentUser.role !== 'admin' && company.createdbyuserid !== currentUser.id) {
      const isMember = await orm.CompanyMembers
        .where({ companyid: companyId, userid: currentUser.id, status: 'active' as any })
        .first();
      if (!isMember) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa công ty này');
      }
    }

    if (dto.wardid) {
      const ward = await orm.Wards.where({ id: dto.wardid }).first();
      if (!ward) {
        throw new BadRequestException('Phường/Xã không tồn tại');
      }
    }

    const updateData = CompanyMapper.toUpdateCompanyEntity(dto);
    await orm.Company.where({ id: companyId }).update(updateData);

    return this.getCompanyById(companyId);
  }

  /**
   * Xóa công ty và toàn bộ dữ liệu liên quan (jobs, posts, attachments, reviews...)
   */
  async deleteCompany(companyId: number, currentUser: { id: number; role: string }) {
    const company = await orm.Company.where({ id: companyId }).first();
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
    const jobs = await orm.Job.where({ companyid: companyId }).all();
    const jobIds = jobs.map((j: any) => j.id);

    if (jobIds.length > 0) {
      await orm.Application.where((a: any) => a.jobid.in(jobIds)).delete();
      await orm.SkillJob.where((sj: any) => sj.jobid.in(jobIds)).delete();
      await orm.Job.where((j: any) => j.id.in(jobIds)).delete();
    }

    // 3. Dọn dẹp Posts, Attachments (trên Cloudinary và DB), Interactions
    const posts = await orm.Post.where({ companyid: companyId }).all();
    const postIds = posts.map((p: any) => p.id);

    if (postIds.length > 0) {
      const attachments = await orm.Attachment
        .where((att: any) => att.postid.in(postIds))
        .all();

      for (const att of attachments) {
        if (att.fileurl) {
          await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
        }
      }

      await orm.Attachment.where((att: any) => att.postid.in(postIds)).delete();
      await orm.Interaction.where((it: any) => it.postid.in(postIds)).delete();
      await orm.Post.where((p: any) => p.id.in(postIds)).delete();
    }

    // 4. Dọn dẹp Follows, Reviews, CompanyMembers
    await orm.Follow.where({ companyid: companyId }).delete();
    await orm.Review.where({ companyid: companyId }).delete();
    await orm.CompanyMembers.where({ companyid: companyId }).delete();

    // 5. Xóa Company
    await orm.Company.where({ id: companyId }).delete();

    return { success: true, message: 'Xóa công ty thành công' };
  }

  /**
   * Upload ảnh đại diện công ty: Tải lên Cloudinary trước, cập nhật DB rồi mới xóa ảnh cũ
   */
  async uploadCompanyAvatar(companyId: number, file: Express.Multer.File) {
    const company = await orm.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    const uploadRes = await this.cloudinaryService.uploadFile(file);
    const oldAvatar = company.avatar;

    await orm.Company.where({ id: companyId }).update({
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
    const company = await orm.Company.where({ id: companyId }).first();
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    const uploadRes = await this.cloudinaryService.uploadFile(file);
    const oldCover = company.coverimage;

    await orm.Company.where({ id: companyId }).update({
      coverimage: uploadRes.secure_url as any,
      updatedat: new Date() as any,
    });

    if (oldCover) {
      await this.cloudinaryService.deleteFile(oldCover).catch(() => {});
    }

    return uploadRes.secure_url;
  }
}
