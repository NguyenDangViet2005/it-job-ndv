import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { CompanyQueryDto } from './dto/company-query.dto.js';
import { CompanyMapper, type FormattedCompany } from './company.mapper.js';
import { CompanyRepository } from './company.repository.js';

export type { FormattedCompany };

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Lấy danh sách công ty với phân trang và tìm kiếm theo tên
   */
  async getCompanies(query: CompanyQueryDto) {
    const pageNumber = query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || query.search || '').trim();
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.companyRepo.count(keyword);
    const rows = await this.companyRepo.findCompanies(keyword, offset, pageSize);

    // Tối ưu hóa truy vấn thông tin địa lý gộp trong 1 query (tránh N+1)
    const wardIds = [...new Set(rows.map((c: any) => c.wardid).filter(Boolean))] as number[];
    let wardMap = new Map<number, any>();
    if (wardIds.length > 0) {
      const wards = await this.companyRepo.findWardsByIds(wardIds);
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
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.companyRepo.countLogos();
    const rows = await this.companyRepo.findCompanyLogos(offset, pageSize);

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
    const comp = await this.companyRepo.findById(id);

    if (!comp) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    let ward: any = null;
    if (comp.wardid) {
      ward = await this.companyRepo.findWardById(comp.wardid);
    }

    return CompanyMapper.toCompanyResponse(comp, ward);
  }

  /**
   * Lấy thông tin công ty của HR hiện tại
   */
  async getCompanyByUserId(userId: number): Promise<FormattedCompany> {
    // 1. Kiểm tra thành viên công ty đang hoạt động
    const member = await this.companyRepo.findMemberByUserId(userId);

    // 2. Nếu không tìm thấy trong thành viên, kiểm tra xem có phải người tạo công ty không
    let companyId = member?.companyid;
    if (!companyId) {
      const createdCompany = await this.companyRepo.findByCreatorId(userId);
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
      const ward = await this.companyRepo.findWardById(dto.wardid);
      if (!ward) {
        throw new BadRequestException('Phường/Xã không tồn tại');
      }
    }

    const companyEntity = CompanyMapper.toCreateCompanyEntity(dto, userId);
    const newCompany = await this.companyRepo.create(companyEntity);
    await this.companyRepo.addMember(newCompany.id, userId, 'active');

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
    const company = await this.companyRepo.findSimpleById(companyId);
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    // Kiểm tra quyền: Admin hoặc thành viên/người tạo công ty
    if (currentUser.role !== 'admin' && company.createdbyuserid !== currentUser.id) {
      const isMember = await this.companyRepo.findMember(companyId, currentUser.id);
      if (!isMember) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa công ty này');
      }
    }

    if (dto.wardid) {
      const ward = await this.companyRepo.findWardById(dto.wardid);
      if (!ward) {
        throw new BadRequestException('Phường/Xã không tồn tại');
      }
    }

    const updateData = CompanyMapper.toUpdateCompanyEntity(dto);
    await this.companyRepo.update(companyId, updateData);

    return this.getCompanyById(companyId);
  }

  /**
   * Xóa công ty và toàn bộ dữ liệu liên quan (jobs, posts, attachments, reviews...)
   */
  async deleteCompany(companyId: number, currentUser: { id: number; role: string }) {
    const company = await this.companyRepo.findSimpleById(companyId);
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
    const jobs = await this.companyRepo.findJobsByCompanyId(companyId);
    const jobIds = jobs.map((j: any) => j.id);

    if (jobIds.length > 0) {
      await this.companyRepo.deleteJobsAndApplications(jobIds);
    }

    // 3. Dọn dẹp Posts, Attachments (trên Cloudinary và DB), Interactions
    const posts = await this.companyRepo.findPostsByCompanyId(companyId);
    const postIds = posts.map((p: any) => p.id);

    if (postIds.length > 0) {
      const attachments = await this.companyRepo.findAttachmentsByPostIds(postIds);

      for (const att of attachments) {
        if (att.fileurl) {
          await this.cloudinaryService.deleteFile(att.fileurl).catch(() => {});
        }
      }

      await this.companyRepo.deletePostsAndRelations(postIds);
    }

    // 4. Dọn dẹp Follows, Reviews, CompanyMembers và xóa Company
    await this.companyRepo.deleteFollowsReviewsMembersAndCompany(companyId);

    return { success: true, message: 'Xóa công ty thành công' };
  }

  /**
   * Upload ảnh đại diện công ty: Tải lên Cloudinary trước, cập nhật DB rồi mới xóa ảnh cũ
   */
  async uploadCompanyAvatar(companyId: number, file: Express.Multer.File) {
    const company = await this.companyRepo.findSimpleById(companyId);
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    const uploadRes = await this.cloudinaryService.uploadFile(file);
    const oldAvatar = company.avatar;

    await this.companyRepo.updateAvatar(companyId, uploadRes.secure_url);

    if (oldAvatar) {
      await this.cloudinaryService.deleteFile(oldAvatar).catch(() => {});
    }

    return uploadRes.secure_url;
  }

  /**
   * Upload ảnh bìa công ty: Tải lên Cloudinary trước, cập nhật DB rồi mới xóa ảnh cũ
   */
  async uploadCompanyCover(companyId: number, file: Express.Multer.File) {
    const company = await this.companyRepo.findSimpleById(companyId);
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }

    const uploadRes = await this.cloudinaryService.uploadFile(file);
    const oldCover = company.coverimage;

    await this.companyRepo.updateCover(companyId, uploadRes.secure_url);

    if (oldCover) {
      await this.cloudinaryService.deleteFile(oldCover).catch(() => {});
    }

    return uploadRes.secure_url;
  }
}
