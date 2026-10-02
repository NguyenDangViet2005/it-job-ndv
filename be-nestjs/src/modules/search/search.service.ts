import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { nowPlainDate } from '~/common/utils/temporal.util.js';
import { CompanyMapper } from '~/modules/company/company.mapper.js';
import { JobMapper } from '~/modules/job/job.mapper.js';
import { SearchQueryDto } from './dto/search-query.dto.js';

@Injectable()
export class SearchService {
  /**
   * Tìm kiếm tổng hợp theo từ khóa: Công việc, Công ty, Kỹ năng
   */
  async search(query: SearchQueryDto) {
    const keyword = query.keyword.trim();
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const offset = (page - 1) * pageSize;

    const today = nowPlainDate();

    // 1. Tìm kiếm Jobs
    const jobs = await orm.Job
      .where((j: any) => j.title.ilike(`%${keyword}%`))
      .where((j: any) => j.status.neq('closed'))
      .where((j: any) => j.deadline.gte(today))
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset(offset)
      .limit(pageSize)
      .all();

    // Lấy skills của các jobs tìm được
    const jobIds = jobs.map((j: any) => j.id);
    let skillMap = new Map<number, any[]>();
    if (jobIds.length > 0) {
      const skillJobs = await orm.SkillJob
        .where((sj: any) => sj.jobid.in(jobIds))
        .include('skill')
        .all();
      for (const sj of skillJobs) {
        if (!skillMap.has(sj.jobid)) skillMap.set(sj.jobid, []);
        skillMap.get(sj.jobid)!.push((sj as any).skill);
      }
    }

    const formattedJobs = jobs.map((j: any) =>
      JobMapper.toJobResponse(j, j.company, skillMap.get(j.id) || [], 0),
    );

    // 2. Tìm kiếm Companies
    const companies = await orm.Company
      .where((c: any) => c.name.ilike(`%${keyword}%`))
      .orderBy((c: any) => c.name.asc())
      .offset(offset)
      .limit(pageSize)
      .all();

    const wardIds = [...new Set(companies.map((c: any) => c.wardid).filter(Boolean))];
    let wardMap = new Map<number, any>();
    if (wardIds.length > 0) {
      const wards = await orm.Wards
        .where((w: any) => w.id.in(wardIds))
        .include('provinces')
        .all();
      wardMap = new Map(wards.map((w: any) => [w.id, w]));
    }

    const formattedCompanies = companies.map((c: any) =>
      CompanyMapper.toCompanyResponse(c, c.wardid ? wardMap.get(c.wardid) : null),
    );

    // 3. Tìm kiếm Skills
    const skills = await orm.Skill
      .where((s: any) => s.name.ilike(`%${keyword}%`))
      .orderBy((s: any) => s.name.asc())
      .offset(offset)
      .limit(pageSize)
      .all();

    return {
      jobs: formattedJobs,
      companies: formattedCompanies,
      skills,
    };
  }
}
