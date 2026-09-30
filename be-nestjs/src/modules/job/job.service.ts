import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { JobQueryDto } from './dto/job-query.dto.js';
import { JobMapper, type JobResponseData } from './job.mapper.js';

export type { JobResponseData };

@Injectable()
export class JobService {
  /**
   * Tối ưu hóa tải kèm thông tin công ty, kỹ năng và số lượng ứng tuyển trong 3 truy vấn gộp (tránh N+1)
   */
  private async enrichJobs(jobs: any[]): Promise<JobResponseData[]> {
    if (jobs.length === 0) return [];
    const jobIds = jobs.map((j) => j.id);

    // 1. Tải danh sách kỹ năng liên quan
    const skillJobs = await orm.SkillJob
      .where((sj: any) => sj.jobid.in(jobIds))
      .include('skill')
      .all();

    const skillMap = new Map<number, any[]>();
    for (const sj of skillJobs) {
      if (!skillMap.has(sj.jobid)) skillMap.set(sj.jobid, []);
      skillMap.get(sj.jobid)!.push((sj as any).skill);
    }

    // 2. Tải số lượng đơn ứng tuyển cho mỗi công việc
    const applications = await orm.Application
      .where((a: any) => a.jobid.in(jobIds))
      .all();

    const appCountMap = new Map<number, number>();
    for (const a of applications) {
      appCountMap.set(a.jobid, (appCountMap.get(a.jobid) || 0) + 1);
    }

    // 3. Tải thông tin công ty nếu chưa được nạp sẵn
    const companyIds = [...new Set(jobs.map((j) => j.companyid).filter(Boolean))];
    let companyMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const companies = await orm.Company
        .where((c: any) => c.id.in(companyIds))
        .include('companyMembers')
        .all();
      companyMap = new Map(companies.map((c: any) => [c.id, c]));
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
    const pageNumber = query.pageNumber && query.pageNumber > 0 ? query.pageNumber : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const keyword = (query.keyword || '').trim();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let countQuery = orm.Job
      .where((j: any) => j.status.ne('closed'))
      .where((j: any) => j.deadline.gte(today));

    let dataQuery = orm.Job
      .where((j: any) => j.status.ne('closed'))
      .where((j: any) => j.deadline.gte(today));

    if (keyword) {
      countQuery = countQuery.where((j: any) => j.title.ilike(`%${keyword}%`)) as any;
      dataQuery = dataQuery.where((j: any) => j.title.ilike(`%${keyword}%`)) as any;
    }

    const { count } = await countQuery.aggregate((a) => ({ count: a.count() }));

    const rows = await dataQuery
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .all();

    const formatted = await this.enrichJobs(rows);

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
   * Lấy chi tiết công việc theo ID
   */
  async getById(id: number): Promise<JobResponseData> {
    const job = await orm.Job
      .where({ id })
      .include('company')
      .first();

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
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const jobs = await orm.Job
      .where((j: any) => j.status.ne('closed'))
      .where((j: any) => j.deadline.gte(startOfToday))
      .where((j: any) => j.createdat.gte(startOfToday))
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .all();

    return this.enrichJobs(jobs);
  }

  /**
   * Lấy danh sách công việc theo kỹ năng
   */
  async getJobsBySkill(skillId: number, pageNumber: number = 1, pageSize: number = 10) {
    const pNumber = pageNumber > 0 ? pageNumber : 1;
    const pSize = pageSize > 0 ? pageSize : 10;

    const skillJobs = await orm.SkillJob.where({ skillid: skillId }).all();
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

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const { count } = await orm.Job
      .where((j: any) => j.id.in(jobIds))
      .where((j: any) => j.status.ne('closed'))
      .where((j: any) => j.deadline.gte(today))
      .aggregate((a) => ({ count: a.count() }));

    const rows = await orm.Job
      .where((j: any) => j.id.in(jobIds))
      .where((j: any) => j.status.ne('closed'))
      .where((j: any) => j.deadline.gte(today))
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

    const formatted = await this.enrichJobs(rows);

    return {
      data: formatted,
      totalItems: count,
      pageNumber,
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

    let queryBuilder = orm.Job.where({ companyid: companyId });

    if (onlyActive) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      queryBuilder = queryBuilder
        .where((j: any) => j.status.ne('closed'))
        .where((j: any) => j.deadline.gte(today)) as any;
    }

    const { count } = await queryBuilder.aggregate((a) => ({ count: a.count() }));

    const rows = await queryBuilder
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset((pNumber - 1) * pSize)
      .limit(pSize)
      .all();

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
    const member = await orm.CompanyMembers
      .where({ userid: userId, status: 'active' as any })
      .first();

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

    return this.getJobsByCompanyId(companyId, pageNumber, pageSize, onlyActive);
  }

  /**
   * Tạo tin tuyển dụng mới
   */
  async create(userId: number, dto: CreateJobDto): Promise<JobResponseData> {
    const member = await orm.CompanyMembers
      .where({ userid: userId, status: 'active' as any })
      .first();

    let companyId = member?.companyid;
    if (!companyId) {
      const createdCompany = await orm.Company
        .where({ createdbyuserid: userId })
        .first();
      companyId = createdCompany?.id;
    }

    if (!companyId) {
      throw new BadRequestException('Tài khoản của bạn chưa được liên kết với công ty nào để đăng tin');
    }

    const jobEntity = JobMapper.toCreateJobEntity(dto, companyId);
    const newJob = await orm.Job.create(jobEntity);

    if (dto.skillids && dto.skillids.length > 0) {
      for (const skillid of dto.skillids) {
        await orm.SkillJob.create({
          jobid: newJob.id as any,
          skillid: skillid as any,
        });
      }
    }

    return this.getById(newJob.id);
  }

  /**
   * Cập nhật tin tuyển dụng
   */
  async update(
    jobId: number,
    currentUser: { id: number; role: string },
    dto: UpdateJobDto,
  ): Promise<JobResponseData> {
    const job = await orm.Job.where({ id: jobId }).first();
    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    // Kiểm tra quyền hạn
    if (currentUser.role !== 'admin') {
      const member = await orm.CompanyMembers
        .where({ companyid: job.companyid, userid: currentUser.id, status: 'active' as any })
        .first();
      const isCreator = await orm.Company
        .where({ id: job.companyid, createdbyuserid: currentUser.id })
        .first();

      if (!member && !isCreator) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa tin tuyển dụng của công ty này');
      }
    }

    const updatePayload = JobMapper.toUpdateJobEntity(dto);
    await orm.Job.where({ id: jobId }).update(updatePayload);

    if (dto.skillids !== undefined) {
      await orm.SkillJob.where({ jobid: jobId }).delete();
      for (const skillid of dto.skillids) {
        await orm.SkillJob.create({
          jobid: jobId as any,
          skillid: skillid as any,
        });
      }
    }

    return this.getById(jobId);
  }

  /**
   * Xóa tin tuyển dụng
   */
  async deleteJob(jobId: number, currentUser: { id: number; role: string }) {
    const job = await orm.Job.where({ id: jobId }).first();
    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    if (currentUser.role !== 'admin') {
      const member = await orm.CompanyMembers
        .where({ companyid: job.companyid, userid: currentUser.id, status: 'active' as any })
        .first();
      const isCreator = await orm.Company
        .where({ id: job.companyid, createdbyuserid: currentUser.id })
        .first();

      if (!member && !isCreator) {
        throw new ForbiddenException('Bạn không có quyền xóa tin tuyển dụng của công ty này');
      }
    }

    // Xóa liên kết SkillJob và Application trước khi xóa Job
    await orm.SkillJob.where({ jobid: jobId }).delete();
    await orm.Application.where({ jobid: jobId }).delete();
    await orm.Job.where({ id: jobId }).delete();

    return {
      success: true,
      message: 'Xóa tin tuyển dụng thành công',
    };
  }
}
