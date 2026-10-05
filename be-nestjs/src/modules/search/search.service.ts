import { Injectable } from '@nestjs/common';
import { CompanyMapper } from '~/modules/company/company.mapper.js';
import { JobMapper } from '~/modules/job/job.mapper.js';
import { SearchQueryDto } from './dto/search-query.dto.js';
import { SearchRepository } from './search.repository.js';

@Injectable()
export class SearchService {
  constructor(private readonly searchRepo: SearchRepository) {}

  /**
   * Tìm kiếm tổng hợp theo từ khóa: Công việc, Công ty, Kỹ năng
   */
  async search(query: SearchQueryDto) {
    const keyword = query.keyword.trim();
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const offset = (page - 1) * pageSize;

    // 1. Tìm kiếm Jobs
    const jobs = await this.searchRepo.searchJobs(keyword, offset, pageSize);

    // Lấy skills của các jobs tìm được
    const jobIds = jobs.map((j: any) => j.id);
    let skillMap = new Map<number, any[]>();
    if (jobIds.length > 0) {
      const skillJobs = await this.searchRepo.findSkillsByJobIds(jobIds);
      for (const sj of skillJobs) {
        if (!skillMap.has(sj.jobid)) skillMap.set(sj.jobid, []);
        skillMap.get(sj.jobid)!.push((sj as any).skill);
      }
    }

    const formattedJobs = jobs.map((j: any) =>
      JobMapper.toJobResponse(j, j.company, skillMap.get(j.id) || [], 0),
    );

    // 2. Tìm kiếm Companies
    const companies = await this.searchRepo.searchCompanies(keyword, offset, pageSize);

    const wardIds = [...new Set(companies.map((c: any) => c.wardid).filter(Boolean))] as number[];
    let wardMap = new Map<number, any>();
    if (wardIds.length > 0) {
      const wards = await this.searchRepo.findWardsWithProvinces(wardIds);
      wardMap = new Map(wards.map((w: any) => [w.id, w]));
    }

    const formattedCompanies = companies.map((c: any) =>
      CompanyMapper.toCompanyResponse(c, c.wardid ? wardMap.get(c.wardid) : null),
    );

    // 3. Tìm kiếm Skills
    const skills = await this.searchRepo.searchSkills(keyword, offset, pageSize);

    return {
      jobs: formattedJobs,
      companies: formattedCompanies,
      skills,
    };
  }
}
