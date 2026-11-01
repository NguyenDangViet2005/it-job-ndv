import { withTransaction } from '~/prisma/db.js';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { JobQueryDto } from './dto/job-query.dto.js';
import { JobMapper, type JobResponseData } from './job.mapper.js';
import { JobRepository } from './job.repository.js';
import { RedisCacheService } from '../redis/redis-cache.service.js';
import { REDIS_CACHE_TTL, REDIS_KEYS } from '../redis/redis-cache.constants.js';

export type { JobResponseData };

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly cache: RedisCacheService,
  ) {}

  private listKey(type: string, ...parts: Array<string | number | boolean>) {
    return `itjob:jobs:${type}:${parts.map((part) => encodeURIComponent(String(part))).join(':')}`;
  }

  private async invalidateJobCache(jobId?: number) {
    if (jobId) await this.cache.delete(REDIS_KEYS.job.detail(jobId));
    await this.cache.deleteByPattern(REDIS_KEYS.job.all);
  }

  /**
   * Tối ưu hóa tải kèm thông tin công ty, kỹ năng và số lượng ứng tuyển trong 3 truy vấn gộp (tránh N+1)
   */
  private async enrichJobs(jobs: any[]): Promise<JobResponseData[]> {
    if (jobs.length === 0) return [];
    const jobIds = jobs.map((j) => j.id);

    // 1. Tải danh sách kỹ năng liên quan
    const skillJobs = await this.jobRepo.findSkillJobsByJobIds(jobIds);

    const skillMap = new Map<number, any[]>();
    for (const sj of skillJobs) {
      if (!skillMap.has(sj.jobid)) skillMap.set(sj.jobid, []);
      skillMap.get(sj.jobid)!.push((sj as any).skill);
    }

    // 2. Tải số lượng đơn ứng tuyển cho mỗi công việc
    const applications = await this.jobRepo.findApplicationsByJobIds(jobIds);

    const appCountMap = new Map<number, number>();
    for (const a of applications) {
      appCountMap.set(a.jobid, (appCountMap.get(a.jobid) || 0) + 1);
    }

    // 3. Tải thông tin công ty nếu chưa được nạp sẵn
    const companyIds = [
      ...new Set(jobs.map((j) => j.companyid).filter(Boolean)),
    ] as number[];
    let companyMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const companies = await this.jobRepo.findCompaniesByIds(companyIds);
      companyMap = new Map(companies.map((c) => [c.id, c]));
    }

    return jobs.map((job) => {
      const company = (job as any).company || companyMap.get(job.companyid);
      const skills = skillMap.get(job.id) || [];
      const appCount = appCountMap.get(job.id) || 0;
      return JobMapper.toJobResponse(job, company, skills, appCount);
    });
  }

  /**
   * Lấy danh sách việc làm đang mở có phân trang và tìm kiếm theo từ khóa
   */
  async getAll(query: JobQueryDto) {
    const pageNumber =
      query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || '').trim();
    return this.cache.remember(
      this.listKey('list', pageNumber, pageSize, keyword.toLowerCase()),
      REDIS_CACHE_TTL.JOB.LIST,
      async () => {
        const offset = (pageNumber - 1) * pageSize;
        const count = await this.jobRepo.countOpenJobs(keyword);
        const rows = await this.jobRepo.findOpenJobs(keyword, offset, pageSize);
        const formatted = await this.enrichJobs(rows);
        return {
          data: formatted,
          totalItems: count,
          pageNumber,
          page: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        };
      },
    );
  }

  /**
   * Lấy chi tiết công việc theo ID
   */
  async getById(id: number): Promise<JobResponseData> {
    return this.cache.remember(
      REDIS_KEYS.job.detail(id),
      REDIS_CACHE_TTL.JOB.DETAIL,
      () => this.getByIdFromDb(id),
    );
  }

  private async getByIdFromDb(id: number): Promise<JobResponseData> {
    const job = await this.jobRepo.findById(id);

    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    const enriched = await this.enrichJobs([job]);
    return enriched[0];
  }

  /**
   * Lấy các công việc được đăng trong ngày hôm nay
   */
  async getJobsToday(): Promise<JobResponseData[]> {
    return this.cache.remember(
      this.listKey('today'),
      REDIS_CACHE_TTL.JOB.TODAY,
      async () => {
        const jobs = await this.jobRepo.findJobsToday();
        return this.enrichJobs(jobs);
      },
    );
  }

  /**
   * Lấy danh sách công việc theo kỹ năng
   */
  async getJobsBySkill(
    skillId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;
    return this.cache.remember(
      this.listKey('skill', skillId, pNumber, pSize),
      REDIS_CACHE_TTL.JOB.LIST,
      () => this.getJobsBySkillFromDb(skillId, pNumber, pSize),
    );
  }

  private async getJobsBySkillFromDb(
    skillId: number,
    pNumber: number,
    pSize: number,
  ) {
    const offset = (pNumber - 1) * pSize;

    const skillJobs = await this.jobRepo.findSkillJobsBySkillId(skillId);
    const jobIds = skillJobs.map((sj: any) => sj.jobid);

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

    const count = await this.jobRepo.countJobsByIds(jobIds);
    const rows = await this.jobRepo.findJobsByIds(jobIds, offset, pSize);

    const formatted = await this.enrichJobs(rows);

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
   * Lấy danh sách công việc theo ID công ty
   */
  async getJobsByCompanyId(
    companyId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    onlyActive: boolean = false,
  ) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;
    return this.cache.remember(
      this.listKey('company', companyId, pNumber, pSize, onlyActive),
      REDIS_CACHE_TTL.JOB.LIST,
      () =>
        this.getJobsByCompanyIdFromDb(companyId, pNumber, pSize, onlyActive),
    );
  }

  private async getJobsByCompanyIdFromDb(
    companyId: number,
    pNumber: number,
    pSize: number,
    onlyActive: boolean,
  ) {
    const offset = (pNumber - 1) * pSize;

    const count = await this.jobRepo.countJobsByCompanyId(
      companyId,
      onlyActive,
    );
    const rows = await this.jobRepo.findJobsByCompanyId(
      companyId,
      offset,
      pSize,
      onlyActive,
    );

    const formatted = await this.enrichJobs(rows);

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
   * Lấy danh sách công việc cho nhà tuyển dụng quản lý
   */
  async getJobsByUserId(
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    onlyActive: boolean = false,
  ) {
    const member = await this.jobRepo.findCompanyMemberByUserId(userId);

    let companyId = member?.companyid;
    if (!companyId) {
      const createdCompany = await this.jobRepo.findCompanyByCreatorId(userId);
      companyId = createdCompany?.id;
    }

    if (!companyId) {
      throw new NotFoundException('Bạn chưa được liên kết với công ty nào');
    }

    return this.getJobsByCompanyId(companyId, pageNumber, pageSize, onlyActive);
  }

  /**
   * Tạo tin tuyển dụng mới
   */
  async create(userId: number, dto: CreateJobDto): Promise<JobResponseData> {
    const result = await withTransaction(async () => {
      const member = await this.jobRepo.findCompanyMemberByUserId(userId);

      let companyId = member?.companyid;
      if (!companyId) {
        const createdCompany =
          await this.jobRepo.findCompanyByCreatorId(userId);
        companyId = createdCompany?.id;
      }

      if (!companyId) {
        throw new BadRequestException(
          'Tài khoản của bạn chưa được liên kết với công ty nào để đăng tin',
        );
      }

      const jobEntity = JobMapper.toCreateJobEntity(dto, companyId);
      const newJob = await this.jobRepo.create(jobEntity);

      if (dto.skillids && dto.skillids.length > 0) {
        for (const skillid of dto.skillids) {
          await this.jobRepo.addSkillJob(newJob.id, skillid);
        }
      }

      return this.getByIdFromDb(newJob.id);
    }, true);
    await this.invalidateJobCache(result.id);
    return result;
  }

  /**
   * Cập nhật tin tuyển dụng
   */
  async update(
    jobId: number,
    currentUser: { id: number; role: string },
    dto: UpdateJobDto,
  ): Promise<JobResponseData> {
    const result = await withTransaction(async () => {
      const job = await this.jobRepo.findById(jobId);
      if (!job) {
        throw new NotFoundException('Không tìm thấy tin tuyển dụng');
      }

      // Kiểm tra quyền hạn
      if (currentUser.role !== 'admin') {
        const member = await this.jobRepo.findCompanyMember(
          job.companyid,
          currentUser.id,
        );
        const isCreator =
          (await this.jobRepo.findCompanyById(job.companyid))
            ?.createdbyuserid === currentUser.id;

        if (!member && !isCreator) {
          throw new ForbiddenException(
            'Bạn không có quyền chỉnh sửa tin tuyển dụng của công ty này',
          );
        }
      }

      const updatePayload = JobMapper.toUpdateJobEntity(dto, job);
      await this.jobRepo.update(jobId, updatePayload);

      if (dto.skillids !== undefined) {
        await this.jobRepo.deleteSkillJobsByJobId(jobId);
        for (const skillid of dto.skillids) {
          await this.jobRepo.addSkillJob(jobId, skillid);
        }
      }

      return this.getByIdFromDb(jobId);
    }, true);
    await this.invalidateJobCache(jobId);
    return result;
  }

  /**
   * Xóa tin tuyển dụng
   */
  async deleteJob(jobId: number, currentUser: { id: number; role: string }) {
    const result = await withTransaction(async () => {
      const job = await this.jobRepo.findById(jobId);
      if (!job) {
        throw new NotFoundException('Không tìm thấy tin tuyển dụng');
      }

      if (currentUser.role !== 'admin') {
        const member = await this.jobRepo.findCompanyMember(
          job.companyid,
          currentUser.id,
        );
        const isCreator =
          (await this.jobRepo.findCompanyById(job.companyid))
            ?.createdbyuserid === currentUser.id;

        if (!member && !isCreator) {
          throw new ForbiddenException(
            'Bạn không có quyền xóa tin tuyển dụng của công ty này',
          );
        }
      }

      await this.jobRepo.delete(jobId);

      return {
        success: true,
        message: 'Xóa tin tuyển dụng thành công',
      };
    }, true);
    await this.invalidateJobCache(jobId);
    return result;
  }
}
