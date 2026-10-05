import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { isDeadlinePassed } from '~/common/utils/temporal.util.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { ApplicationQueryDto } from './dto/application-query.dto.js';
import { ApplicationMapper, type ApplicationResponseData } from './application.mapper.js';
import { ApplicationRepository } from './application.repository.js';

export type { ApplicationResponseData };

@Injectable()
export class ApplicationService {
  constructor(private readonly appRepo: ApplicationRepository) {}

  /**
   * Tối ưu hóa tải thông tin công việc, công ty và ứng viên trong 2 truy vấn gộp (tránh N+1)
   */
  private async enrichApplications(apps: any[]): Promise<ApplicationResponseData[]> {
    if (apps.length === 0) return [];

    const jobIds = [...new Set(apps.map((a) => a.jobid))] as number[];
    const userIds = [...new Set(apps.map((a) => a.userid))] as number[];

    const jobs = await this.appRepo.findJobsWithCompanyByIds(jobIds);
    const users = await this.appRepo.findUsersByIds(userIds);

    const jobMap = new Map(jobs.map((j) => [j.id, j]));
    const userMap = new Map(users.map((u) => [u.id, u]));

    return apps.map((app) =>
      ApplicationMapper.toApplicationResponse(
        app,
        jobMap.get(app.jobid),
        userMap.get(app.userid),
      ),
    );
  }

  /**
   * Lấy toàn bộ đơn ứng tuyển trong hệ thống (chỉ dành cho Quản trị viên)
   */
  async getAll(query: ApplicationQueryDto) {
    const pageNumber = query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const offset = (pageNumber - 1) * pageSize;

    const count = await this.appRepo.countAll();
    const rows = await this.appRepo.findAll(offset, pageSize);

    const formatted = await this.enrichApplications(rows);

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
   * Ứng viên nộp hồ sơ ứng tuyển vào công việc
   */
  async create(userId: number, dto: CreateApplicationDto): Promise<ApplicationResponseData> {
    const job = await this.appRepo.findJobById(dto.jobid);
    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    if (job.status === 'closed') {
      throw new BadRequestException('Tin tuyển dụng này đã đóng, không thể nộp hồ sơ');
    }

    if (job.deadline && isDeadlinePassed(job.deadline)) {
      throw new BadRequestException('Hạn nộp hồ sơ cho công việc này đã kết thúc');
    }

    // Kiểm tra đơn ứng tuyển trùng lặp
    const existing = await this.appRepo.findByJobAndUser(dto.jobid, userId);

    if (existing) {
      throw new BadRequestException('Bạn đã ứng tuyển vào công việc này rồi');
    }

    // Kiểm tra link CV: Nếu client không truyền thì lấy CV đã lưu trong hồ sơ ứng viên
    let finalCvUrl = dto.cvurl;
    if (!finalCvUrl) {
      const user = await this.appRepo.findUserById(userId);
      finalCvUrl = user?.cvurl || undefined;
    }

    if (!finalCvUrl) {
      throw new BadRequestException('Vui lòng cung cấp link CV hoặc tải CV lên trước khi ứng tuyển');
    }

    const payload = ApplicationMapper.toCreateApplicationEntity(dto, userId, finalCvUrl);
    await this.appRepo.create(payload);

    return this.getById(dto.jobid, userId, { id: userId, role: 'user' });
  }

  /**
   * Lấy danh sách đơn ứng tuyển của ứng viên
   */
  async getByUserId(
    targetUserId: number,
    currentUser: { id: number; role: string },
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    if (currentUser.role !== 'admin' && currentUser.id !== targetUserId) {
      throw new ForbiddenException('Bạn không có quyền xem danh sách đơn ứng tuyển này');
    }

    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;
    const offset = (pNumber - 1) * pSize;

    const count = await this.appRepo.countByUserId(targetUserId);
    const rows = await this.appRepo.findByUserId(targetUserId, offset, pSize);

    const formatted = await this.enrichApplications(rows);

    return {
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Lấy danh sách đơn ứng tuyển theo công việc (dành cho Nhà tuyển dụng của công ty)
   */
  async getByJobId(
    jobId: number,
    currentUser: { id: number; role: string },
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const job = await this.appRepo.findJobById(jobId);
    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    // Kiểm tra quyền hạn
    if (currentUser.role !== 'admin') {
      const isMember = await this.appRepo.findCompanyMember(job.companyid, currentUser.id);
      const isCreator = (await this.appRepo.findCompanyById(job.companyid))?.createdbyuserid === currentUser.id;

      if (!isMember && !isCreator) {
        throw new ForbiddenException('Bạn không có quyền xem đơn ứng tuyển của công việc này');
      }
    }

    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;
    const offset = (pNumber - 1) * pSize;

    const count = await this.appRepo.countByJobId(jobId);
    const rows = await this.appRepo.findByJobId(jobId, offset, pSize);

    const formatted = await this.enrichApplications(rows);

    return {
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Lấy danh sách đơn ứng tuyển của toàn bộ công ty (dành cho Nhà tuyển dụng)
   */
  async getByCompanyId(
    companyId: number,
    currentUser: { id: number; role: string },
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    if (currentUser.role !== 'admin') {
      const isMember = await this.appRepo.findCompanyMember(companyId, currentUser.id);
      const isCreator = (await this.appRepo.findCompanyById(companyId))?.createdbyuserid === currentUser.id;

      if (!isMember && !isCreator) {
        throw new ForbiddenException('Bạn không có quyền xem đơn ứng tuyển của công ty này');
      }
    }

    const jobs = await this.appRepo.findJobsByCompanyId(companyId);
    const jobIds = jobs.map((j) => j.id);

    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;
    const offset = (pNumber - 1) * pSize;

    if (jobIds.length === 0) {
      return {
        data: [],
        totalItems: 0,
        pageNumber: pNumber,
        page: pNumber,
        pageSize: pSize,
        totalPages: 0,
      };
    }

    const count = await this.appRepo.countByJobIds(jobIds);
    const rows = await this.appRepo.findByJobIds(jobIds, offset, pSize);

    const formatted = await this.enrichApplications(rows);

    return {
      data: formatted,
      totalItems: count,
      pageNumber: pNumber,
      page: pNumber,
      pageSize: pSize,
      totalPages: Math.ceil(count / pSize),
    };
  }

  /**
   * Xem chi tiết một đơn ứng tuyển
   */
  async getById(
    jobId: number,
    targetUserId: number,
    currentUser: { id: number; role: string },
  ): Promise<ApplicationResponseData> {
    const app = await this.appRepo.findByJobAndUser(jobId, targetUserId);

    if (!app) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    const job = await this.appRepo.findJobById(jobId);

    // Kiểm tra quyền: Bản thân người nộp, hoặc Nhà tuyển dụng của công ty, hoặc Admin
    if (currentUser.role !== 'admin' && currentUser.id !== targetUserId) {
      let hasEmployerPermission = false;
      if (job) {
        const isMember = await this.appRepo.findCompanyMember(job.companyid, currentUser.id);
        const isCreator = (await this.appRepo.findCompanyById(job.companyid))?.createdbyuserid === currentUser.id;
        hasEmployerPermission = Boolean(isMember || isCreator);
      }

      if (!hasEmployerPermission) {
        throw new ForbiddenException('Bạn không có quyền xem đơn ứng tuyển này');
      }
    }

    const enriched = await this.enrichApplications([app]);
    return enriched[0];
  }

  /**
   * Cập nhật trạng thái đơn ứng tuyển (chấp nhận, từ chối, đã xem)
   */
  async updateStatus(
    jobId: number,
    targetUserId: number,
    currentUser: { id: number; role: string },
    dto: UpdateApplicationStatusDto,
  ): Promise<ApplicationResponseData> {
    const app = await this.appRepo.findByJobAndUser(jobId, targetUserId);

    if (!app) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    const job = await this.appRepo.findJobById(jobId);
    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng tương ứng');
    }

    // Chỉ nhà tuyển dụng của công ty hoặc admin mới được duyệt trạng thái
    if (currentUser.role !== 'admin') {
      const isMember = await this.appRepo.findCompanyMember(job.companyid, currentUser.id);
      const isCreator = (await this.appRepo.findCompanyById(job.companyid))?.createdbyuserid === currentUser.id;

      if (!isMember && !isCreator) {
        throw new ForbiddenException('Bạn không có quyền cập nhật trạng thái đơn ứng tuyển này');
      }
    }

    const updatePayload = ApplicationMapper.toUpdateApplicationEntity(dto);
    await this.appRepo.updateStatus(jobId, targetUserId, updatePayload);

    return this.getById(jobId, targetUserId, currentUser);
  }

  /**
   * Xóa đơn ứng tuyển
   */
  async deleteApplication(
    jobId: number,
    targetUserId: number,
    currentUser: { id: number; role: string },
  ) {
    const app = await this.appRepo.findByJobAndUser(jobId, targetUserId);

    if (!app) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển');
    }

    // Ứng viên chỉ có thể hủy đơn của chính mình (hoặc Admin xóa)
    if (currentUser.role !== 'admin' && currentUser.id !== targetUserId) {
      throw new ForbiddenException('Bạn chỉ có thể xóa đơn ứng tuyển của chính mình');
    }

    await this.appRepo.delete(jobId, targetUserId);

    return {
      success: true,
      message: 'Xóa đơn ứng tuyển thành công',
    };
  }
}
