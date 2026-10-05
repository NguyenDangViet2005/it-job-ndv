import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';
import { nowPlainDate } from '~/common/utils/temporal.util.js';

@Injectable()
export class SearchRepository {
  async searchJobs(keyword: string, offset: number, pageSize: number) {
    const today = nowPlainDate();
    return orm.Job
      .where((j: any) => j.title.ilike(`%${keyword}%`))
      .where((j: any) => j.status.neq('closed'))
      .where((j: any) => j.deadline.gte(today))
      .include('company')
      .orderBy((j: any) => j.id.desc())
      .offset(offset)
      .limit(pageSize)
      .all();
  }

  async findSkillsByJobIds(jobIds: number[]) {
    if (jobIds.length === 0) return [];
    return orm.SkillJob
      .where((sj: any) => sj.jobid.in(jobIds))
      .include('skill')
      .all();
  }

  async searchCompanies(keyword: string, offset: number, pageSize: number) {
    return orm.Company
      .where((c: any) => c.name.ilike(`%${keyword}%`))
      .orderBy((c: any) => c.name.asc())
      .offset(offset)
      .limit(pageSize)
      .all();
  }

  async findWardsWithProvinces(wardIds: number[]) {
    if (wardIds.length === 0) return [];
    return orm.Wards
      .where((w: any) => w.id.in(wardIds))
      .include('provinces')
      .all();
  }

  async searchSkills(keyword: string, offset: number, pageSize: number) {
    return orm.Skill
      .where((s: any) => s.name.ilike(`%${keyword}%`))
      .orderBy((s: any) => s.name.asc())
      .offset(offset)
      .limit(pageSize)
      .all();
  }
}
