import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';

export interface JobCompanyInfo {
  id: number;
  name: string;
  avatar: string | null;
  website: string | null;
  address: string | null;
  hotline: string | null;
  companyemail: string | null;
  coverimage: string | null;
  memberCount: number;
}

export interface JobSkillInfo {
  id: number;
  name: string;
}

export interface JobResponseData {
  id: number;
  companyid: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  quantity: number;
  deadline: string | null;
  salary: string | null;
  createdat: Date | null;
  updatedat: Date | null;
  company: JobCompanyInfo | null;
  skills: JobSkillInfo[];
  applicationCount: number;
}

export class JobMapper {
  /**
   * Định dạng dữ liệu tin tuyển dụng hoàn chỉnh cho client
   */
  static toJobResponse(
    job: any,
    company: any = null,
    skills: any[] = [],
    applicationCount: number = 0,
  ): JobResponseData {
    let companyInfo: JobCompanyInfo | null = null;

    if (company || job.company) {
      const c = company || job.company;
      companyInfo = {
        id: c.id,
        name: c.name,
        avatar: c.avatar || null,
        website: c.website || null,
        address: c.address || null,
        hotline: c.hotline || null,
        companyemail: c.companyemail || null,
        coverimage: c.coverimage || null,
        memberCount: c.companyMembers ? c.companyMembers.length : 0,
      };
    }

    const formattedSkills: JobSkillInfo[] = (skills || []).map((s: any) => ({
      id: s.skill?.id || s.id,
      name: s.skill?.name || s.name,
    }));

    return {
      id: job.id,
      companyid: job.companyid,
      title: job.title,
      description: job.description || null,
      type: job._type || job.type || 'full-time',
      status: job.status || 'open',
      quantity: job.quantity || 1,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : null,
      salary: job.salary || null,
      createdat: job.createdat || null,
      updatedat: job.updatedat || null,
      company: companyInfo,
      skills: formattedSkills,
      applicationCount: applicationCount ?? (job.applications ? job.applications.length : 0),
    };
  }

  /**
   * Map từ CreateJobDto sang entity Job của database
   */
  static toCreateJobEntity(dto: CreateJobDto, companyId: number) {
    return {
      companyid: companyId as any,
      title: dto.title.trim() as any,
      description: (dto.description || null) as any,
      _type: (dto.type || 'full-time') as any,
      quantity: (dto.quantity || 1) as any,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      salary: (dto.salary || null) as any,
      status: (dto.status || 'open') as any,
    };
  }

  /**
   * Map từ UpdateJobDto sang payload cập nhật Job trong database
   */
  static toUpdateJobEntity(dto: UpdateJobDto) {
    const updateData: Record<string, any> = {};

    if (dto.title !== undefined) updateData.title = dto.title.trim();
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.type !== undefined) updateData._type = dto.type;
    if (dto.quantity !== undefined) updateData.quantity = dto.quantity;
    if (dto.deadline !== undefined) {
      updateData.deadline = dto.deadline ? new Date(dto.deadline) : null;
    }
    if (dto.salary !== undefined) updateData.salary = dto.salary;
    if (dto.status !== undefined) updateData.status = dto.status;

    updateData.updatedat = new Date();
    return updateData;
  }
}
